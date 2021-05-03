const express = require('express');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(morgan('combined'));
app.use(cors({
    origin: '*'
}));

app.get('/users/', (req, res) => {
    try {
        const data = fs.readFileSync('../database/users.json');
        res.send(JSON.parse(data));
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
        res.status(500).send({
            mgs: "Error reading file from disk",
            err: err
        });
    }
});

app.post('/users/add', (req, res) => {
    const { name, age } = req.body;
    const newUser = {
        id: 0,
        name: name,
        age: parseInt(age)
    }
    let data;
    // Read the database
    try {
        data = fs.readFileSync('../database/users.json');
        data = JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
        res.status(500).send({
            mgs: "Error reading file from disk",
            err: err
        });
    }
    // Adding new data to database
    newUser.id = data.length + 1;
    data.push(newUser);
    // Write the database
    try {
        data = JSON.stringify(data, null, 4);
        fs.writeFileSync('../database/users.json', data);
        console.log('File is written successfully!');
        res.status(201).send({
            msg: "New user added!",
            user: newUser
        });
    } catch (err) {
        console.error(`Error on writing file: ${err}`);
        res.status(500).send({
            msg: "Error on writing file",
            err: err
        });
    }
});

app.put('/users/update', (req, res) => {
    const id = req.query.id
    const { name, age } = req.body;
    let data, findData;
    if (id === null) {
        console.log('URL query id is missing... tell client to suplement that on url parameter');
        res.status(400).send({
            msg: "You need to suplement url parameter of \'id\'",
            err: "URL parameter id is missing",
            hint: "http://localhost/users/update?id=1"
        });
    } else {
        // Read the database
        try {
            data = fs.readFileSync('../database/users.json');
            data = JSON.parse(data);
        } catch (err) {
            console.error(`Error reading file from disk: ${err}`);
            res.status(500).send({
                mgs: "Error reading file from disk",
                err: err
            });
        }
        // Find the data based on id given, then change the data given by index in the array
        findData = data.map((el) => {
            return el.id;
        }).findIndex(el => {
            return el == id;
        });
        if (findData == -1) {
            res.status(400).send({
                msg: "User with that ID is not found"
            });
            return;
        } else {
            data[findData].name = name;
            data[findData].age = parseInt(age);
        }
        // Write the database
        try {
            data = JSON.stringify(data, null, 4);
            fs.writeFileSync('../database/users.json', data);
            console.log('File is written successfully!');
            return res.status(200).send({
                msg: "User detail sucessfully changed!",
                user: {
                    id: id,
                    name: name,
                    age: age
                }
            });
        } catch (err) {
            console.error(`Error on writing file: ${err}`);
            res.status(500).send({
                msg: "Error on writing file",
                err: err
            });
        }
    }
});

app.delete('/users/delete', (req, res) => {
    const id = req.query.id
    let name, age;
    let data, findData;
    if (id === null) {
        console.log('URL query id is missing... tell client to suplement that on url parameter');
        res.status(400).send({
            msg: "You need to suplement url parameter of \'id\'",
            err: "URL parameter id is missing",
            hint: "http://localhost/users/delete?id=1"
        });
    } else {
        // Read the database
        try {
            data = fs.readFileSync('../database/users.json');
            data = JSON.parse(data);
        } catch (err) {
            console.error(`Error reading file from disk: ${err}`);
            res.status(500).send({
                mgs: "Error reading file from disk",
                err: err
            });
        }
        // Find the data based on id given, then delete the data given by index in the array
        findData = data.map((el) => {
            return el.id;
        }).findIndex(el => {
            return el == id;
        });
        if (findData == -1) {
            res.send({
                msg: "User with that ID is not found"
            });
            return;
        } else {
            name = data[findData].name;
            age = data[findData].age;
            data.splice(findData, 1);
        }
        // Write the database
        try {
            data = JSON.stringify(data, null, 4);
            fs.writeFileSync('../database/users.json', data);
            console.log('File is written successfully!');
            return res.status(200).send({
                msg: "User sucessfully deleted!",
                user: {
                    name: name,
                    age: age
                }
            });
        } catch (err) {
            console.error(`Error on writing file: ${err}`);
            res.status(500).send({
                msg: "Error on writing file",
                err: err
            });
        }
    }
});

app.listen(5000, console.log('Server is running on port 5000'));