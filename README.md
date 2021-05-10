# API Fetch with JQuery

Ini repo buat nampung hasil qerja qeraz gw buat belajar cara pake AJAX dan melakukan operasi CRUD API pake JQuery Ajax.

~~Sumpa, gw stack pas pengen biar pas nge POST data itu biar ga reload, tapi tetep ga bisa. Mungkin emang JQuery Ajax ini rada gitu lah.~~

> Update 11/05/2021
>
> Ternyata udh bisa, kalo pas lagi pake VSCode Live Server, dia pasti bakal reload kalo submit form nya. Tapi kalo bisa langsung HTML nya, berjalan sesuai ekspektasi. T_T
>
> Ngateli...

Kalo pas buat websitenya, pake live server gpp. Tapi kalo udh mau tes JQuery Ajax-nya, jangan pake live server, langsung buka file HTML-nya. Soalnya live server-nya ngebug.

Intinya sih ini udh selese. Webnya simpel, cuma ngelakuin CRUD pake form yang ada disitu.

Ada 4 Operasi CRUD yg udh dilakuin di kode ini.

* Create

Ada di folder 'server/index.js', route untuk Createnya ada dari line 28

```javascript
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
```

Lalu untuk kode AJAX Create-nya nya ada di folder 'client/index.html', code AJAX nya ada dari line 66

```javascript
function postNewUser() {
            let formData = $('.post-user').serializeArray();
            let newUser = {
                name: formData[0].value,
                age: formData[1].value
            }
            console.log(newUser);
            $.ajax({
                url: 'http://localhost:5000/users/add',
                type: 'POST',
                data: newUser,
                dataType: 'json',
                success: (res) => {
                    window.alert(res.msg);
                },
                error: (res) => {
                    window.alert(res.msg + '\n' + res.err + '\n' + res.hint);
                }
            });
        }
```

* Read

Ada di folder 'server/index.js', route untuk Readnya ada dari line 15

```javascript
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
```

Lalu untuk AJAX Read-nya, ada di folder 'client/index.html', mulai dari baris 66

```javascript
function getUsers() {
            $.ajax({
                url: 'http://localhost:5000/users',
                type: 'GET',
                success: (data) => {
                    console.log(data);
                    // Remove old data in HTML
                    $('.database_table > .table > tbody > tr').remove();
                    // Insert Users data to table
                    for (let i = 0; i < data.length; i++) {
                        $('.database_table > .table > tbody').append(`
                        <tr>
                            <th scope="row">${data[i].id}</th>
                            <td>${data[i].name}</td>
                            <td>${data[i].age}</td>
                        </tr>
                    `);
                    }
                },
                complete: () => {
                    $('.database_table > p').remove();
                },
                error: () => {
                    $('.database_table > pre').remove();
                    $('.database_table').append('<pre>Failed to fetch data</pre>');
                }
            });
        }
```

Nampilin datanya ada didalem HTML mulai dari baris 31

```html
<section class="database_table container my-5">
    <h1>Database</h1>
    <!-- If data is being fetched -->
    <p>Data being fetched...</p>
    <!---->
    <table class="table">
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
            </tr>
        </thead>
        <tbody>
            <!-- This will be filled from Fetched Data by JQuery Ajax -->
        </tbody>
    </table>
</section>
```

* Update

Ada di folder 'server/index.js', route untuk Updatenya ada dari line 68

```javascript
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
```

Lalu untuk kode AJAX Update-nya, ada di folder 'client/index.html' dari baris 114

```javascript
function editExistingUser() {
            let formData = $('.put-user').serializeArray();
            let userId = formData[0].value;
            let editedUser = {
                name: formData[1].value,
                age: formData[2].value
            }
            $.ajax({
                url: `http://localhost:5000/users/update?id=${userId}`,
                type: 'PUT',
                data: editedUser,
                dataType: 'json',
                success: (res) => {
                    window.alert(res.msg);
                },
                error: (res) => {
                    window.alert(res.msg + '\n' + res.err + '\n' + res.hint);
                }
            });
        }
```

* Delete

Ada di folder 'server/index.js', route buat Delete-nya ada dari line

```javascript
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
```

Lalu untuk kode AJAX Delete-nya, ada di folder 'client/index.html' dari baris 134

```javascript
function deleteExistingUserById() {
            let formData = $('.delete-user').serializeArray();
            let userId = formData[0].value;
            $.ajax({
                url: `http://localhost:5000/users/delete?id=${userId}`,
                type: 'DELETE',
                dataType: 'json',
                success: (res) => {
                    window.alert(res.msg);
                },
                error: (res) => {
                    window.alert(res.msg + '\n' + res.err + '\n' + res.hint);
                }
            });
        }
```

---

Sekian, terima kasih.

Front-End Mentor

[Rafli Athala Jaskandi](https://github.com/VladRafli)
