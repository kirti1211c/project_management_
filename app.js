const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/projects3', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to mongoose");
    })
    .catch(err => {
        console.log("error")
        console.log(err)
    })

const userSchema = new mongoose.Schema({
    id: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: [2, 'should be greater than 2 characters'],
        validate: [
            {
                validator(value) {
                    return "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
                },
                message: "passwors must include a special charcter, number, small and capital alphabet"
            }

        ]
    },
    email: {
        type: String,
        required: true,
        // validate: [
        //     {
        //         validator(value) {
        //             return "^(?=.@)"
        //         },
        //         message: "type correct email format"
        //     }
        // ]
    },
    position: {
        type: String,
        required: true,
        enum: ['Manager', 'Employee']
    }

});


const User = mongoose.model('User', userSchema);
// const user1 = new User({ id: uuid(), username: "us1", password: "us1$", email: "us1@g.c", position: "Manager" });
// user1.save()
//     .then(p => {
//         // console.log(p)
//         // console.log(p["position"])
//     })
//     .catch(e => {
//         // console.log(e)
//     })

const projSchema = new mongoose.Schema({
    id: String,
    title: {
        type: String,
        required: true
    },
    lead: {
        type: String,
        required: true
    },
    people: {
        type: [String],
        required: true,
    }
});


const Proj = mongoose.model('Proj', projSchema);

// const proj1 = new Proj({ id: uuid(), title: "proj1", lead: "us1", people: ["us2", "us3"] });
// proj1.save()
//     .then(p => {
//         console.log(p)
//         // console.log(p["position"])
//     })
//     .catch(e => {
//         console.log(e)
//     })

// const proj1 = new Proj({ id: uuid(), title: "proj2", lead: "divya", people: ["us1", "kirti"] });
// proj1.save()
//     .then(p => {
//         console.log(p)
//         // console.log(p["position"])
//     })
//     .catch(e => {
//         console.log(e)
//     })

// console.log("after")
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let homeFlag = false;
let regFlag = false;

app.get('/', (req, res) => {
    console.log("homeeeee");
    res.render('home.ejs', { flag: homeFlag })
})

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/', urlencodedParser, (req, res) => {

    const { username, password } = req.body;
    User.find({ username: String(username), password: String(password) }).then(data => {
        // console.log(data)
        if (!data.length) {
            // == [] || data == null || data == undefined || data == {} || data == '[]') {
            // res.send("No such user")
            // res.send('<script>alert("Incorrect username or password"); res.redirect(' / ');</script > ')
            // res.send('<script>alert("Incorrect username or password")</script>');
            // res.redirect('/');
            homeFlag = true;
            res.render('home', { flag: homeFlag });
            // alert("Incorrect username or password")
        } else {
            console.log("xdgjsg")
            res.redirect('/welcome?username=' + username)
        }
    }).catch(e => {
        console.log(e)
    })
    // res.send("<h1>successful log in</h1>");

})

app.post('/register', urlencodedParser, (req, res) => {

    const { username, email, password, position } = req.body;
    // console.log(username, email, password, position)
    // console.log(position)
    User.find({ username: String(username) }).then(data => {
        // console.log(data)
        if (!data.length) {
            try {
                const user1 = new User({ id: uuid(), username: username, password: password, email: email, position: position });
                user1.save()
                    .then(p => {
                        // console.log(p)
                        res.redirect('/welcome?username=' + username)
                    })
                    .catch(e => {
                        console.log(e.errors)
                    })
                // console.log(User.find)
            } catch {
                console.log("error")
            }
        } else {
            regFlag = true;
            res.render('register', { flag: regFlag });
        }
    }).catch(e => {
        console.log(e)
    })



})

app.get('/register', (req, res) => {
    console.log("reg");
    res.render('register.ejs', { flag: regFlag });
})



app.get('/welcome', (req, res) => {
    console.log("welcome");
    let { username } = req.query;
    console.log(username)
    Proj.find({}).then(pdata => {
        console.log(pdata[0]["title"])
        User.find({ username: username }).then(data => {
            console.log(data[0]["position"])
            let tdata = [data[0], pdata]
            res.render('welcome.ejs', { tdata })
        })
    }).catch(e => {
        console.log(e)
    })


})

app.get('/proj', (req, res) => {
    let { title } = req.query;
    console.log("jhhgjhfghdfgsfgsfgzbftsxnhyxgthykggmvmhv,yuk,vyuv,hjygufuhvvk ", title)
    Proj.find({ title: title }).then(pdata => {
        // console.log(pdata)
        let x = pdata[0]
        console.log("xhjsaghcydsfchgsdfhychasydfdacdggydgfdj", x)
        res.render('proj.ejs', { x })

    }).catch(e => {
        console.log(e)
    })

})


app.get('/userr', (req, res) => {
    let { username } = req.query;
    console.log("jhhgjhfghdfgsfgsfgzbftsxnhyxgthykggmvmhv,yuk,vyuv,hjygufuhvvk username ", username)
    User.find({ username: username }).then(pdata => {
        // console.log(pdata)
        let x = pdata[0]
        console.log("xhjsaghcydsfchgsdfhychasydfdacdggydgfdj", x)
        res.render('userr.ejs', { x })

    }).catch(e => {
        console.log(e)
    })

})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("Listening!");
})


// Proj.find({}).then(data => {
//     console.log(data)
//     // for (let i = 0; i < data.length; i++) {
//     //     console.log(data[i]["title"])
//     // }
//     // if (!data.length) {
//     //     // == [] || data == null || data == undefined || data == {} || data == '[]') {
//     // } else {

//     // }
// }).catch(e => {
//     console.log(e)
// })

// Proj.remove({ title: "proj2" }, function (err) {
//     if (!err) {
//         console.log("successfulllly")
//     }
//     else {
//         message.type = 'error';
//     }
// })


// User.find({}).then(data => {
//     console.log(data)
//     // if (!data.length) {
//     //     // == [] || data == null || data == undefined || data == {} || data == '[]') {
//     //     res.send("No such user")
//     // } else {
//     //     console.log(data)
//     // }
// }).catch(e => {
//     console.log(e)
// })


// User.remove({ username: "dsc" }, function (err) {
//     if (!err) {
//         console.log("successfulllly")
//     }
//     else {
//         message.type = 'error';
//     }
// })
