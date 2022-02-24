require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require('mongoose')
const fileUpload = require("express-fileupload")
const bcrypt = require('bcrypt')
const saltRounds = 10;
const path = require("path")


const app = express();




app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());



//connection to mongoose
const mongoURL = "mongodb://localhost:27017/FinalMyStudGoDB_Final"

const connectDB = () => {
    try {
        mongoose.connect(mongoURL, { useNewUrlParser: true, autoIndex: false }, () => {
            console.log("Connected to the Mongo Database");
        })
    } catch (err) {
        console.log(err);
    }
}

connectDB();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    cpassword: {
        type: String,
    },
    email: {
        type: String,
        // unique: true,
    },
    phone:
    {
        type: String,
    },
    gender:
    {
        type: String,
    },
    image:
    {
        type: String,
    },
})



const User = mongoose.model('User', userSchema);


app.get('/', function (req, res) {
    res.render('index')
})

app.get("/register", function (req, res) {
    res.render('register')
})

app.get('/login', function (req, res) {
    res.render('login')
})

app.get("/roadmap", function (req, res) {
    res.render("roadmap")
})

app.get("/planner", function (req, res) {
    res.render("planner")
})

app.get("/resources", function (req, res) {
    res.render("resources")
})

// app.get("/user-profile", function (req, res) {
//     res.render("profile",{users: ""})
// })



app.get("/aptitude", function (req, res) {
    res.render("game")
})

app.get('/index', function (req, res) {
    res.render("end_page");
})


app.get("/high_scores", function (req, res) {
    res.render("highscores");
})

app.get("/end", function (req, res) {
    res.render("end")
})


// app.get('/profile', function (req, res) {
//     res.render("profile")
// })

global.my_id = "";

app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            name: req.body.username,
            email: req.body.email,
            password: hash,
            cpassword: req.body.cPassword,
            phone: "",
            image: "",
            gender: "",
        })
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                my_id = newUser._id.toString();
                console.log(newUser._id.toString());
                res.render("user-page", { users: newUser })
            }
        })
    })

})

app.post("/login", async function (req, res) {
    const { email, password } = req.body;
    try {
        User.findOne({ email: email }, (err, user) => {
            if (!user) {
                console.log("Email not Found")
            }
            else {
                if (user) {
                    bcrypt.compare(password, user.password, function (err, reslt) {
                        if (reslt == true) {
                            my_id = user._id.toString();
                            res.render("user-page", { users: user })
                        }
                    })

                }
            }

        })
    } catch (err) {
        console.log(err);
    }
})

app.get("/logout", function (req, res) {
    res.redirect("/");
});


//profile part
app.get("/edit_profiles/:id", function (req, res) {
    const id = req.params.id;
    my_id = id.toString();
    try {
        User.findOne({ _id: id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    res.render("user-edit", { users: user })
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})

app.post("/user_profile_edit", function (req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    var file = req.files.uploaded_image;
    var img_name = file.name;



    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
        file.mv('public/assets/upload_images/' + file.name, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            else {
                const phone = req.body.pmobile;
                const gender = req.body.pgender;

                try {

                    User.findOneAndUpdate({
                        _id: my_id,
                    },
                        {
                            image: img_name,
                            phone: phone,
                            gender: gender,
                        },
                        function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            else {

                                res.redirect("/user-profile")
                            }
                        }
                    )

                } catch (err) {
                    console.log(err);
                }
            }
        })
    }


})

//profile
app.get("/user-profile", function (req, res) {
    try {
        User.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    console.log(user)
                    res.render("profile", { users: user });
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})


app.get("/go_home", function (req, res) {
    try {
        User.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    console.log(user)
                    res.render("user-page", { users: user });
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})


app.get("/discussion", function (req, res) {
    try {
        User.findOne({ _id: my_id }, (err, user) => {
            if (!user) {
                console.log("ID not Found")
            }
            else {
                if (user) {
                    console.log(user)
                    res.render("discussion", { users: user });
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
})

const router_sendmail = require("./send_mail.js")

app.use(router_sendmail)

app.listen(3000, function () {
    console.log("Successfully started on port 3000")
})