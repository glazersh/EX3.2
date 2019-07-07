var express = require('express');
var app = express();
var DButilsAzure = require('../DButils');
const router = express.Router();
var jwt = require('jsonwebtoken');
var SECRET = 'dorshula';
var currentUserName;


router.use(express.json());
var avg;

//3
router.post('/addUser', function (req, res) {
    if (req.body.q1 == req.body.q2)
        res.status(400).send("please specify 2 different questions");

    DButilsAzure.execQuery("INSERT INTO Users values('" + req.body.firstname +
        "','" + req.body.lastname + "','" + req.body.username + "','" + req.body.password + "','" +
        req.body.city + "','" + req.body.Country + "','" + req.body.email + "','" + req.body.q1 + "','" + req.body.ans1 + "','" + req.body.q2 + "','" + req.body.ans2 + "','" + req.body.cn + "','" + req.body.cn2 + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})
//5
router.post('/checkQuestion', function (req, res) {
    DButilsAzure.execQuery("SELECT Answer1, Answer2, Password FROM Users WHERE UserName = '" + req.body.username + "'" + " AND Question1 ='" + req.body.q1 + "'"
        + " AND Question2 ='" + req.body.q2 + "'")
        .then(function (result) {
            if (result[0].Answer1 == req.body.ans1 && result[0].Answer2 == req.body.ans2) {
                res.send(result[0].Password);
            }
            else
                res.send("wrong answers");
        })
        .catch(function (err) {
            res.status(400).json("Invalid answers");

        })
})

// 4
router.get('/getQuestions/:username', function (req, res) {
    DButilsAzure.execQuery("SELECT Question1, Question2 FROM Users WHERE UserName = '" + req.params.username + "'")
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

//9 - LOGIN
router.post("/login", (req, res) => {
    payload = { username: req.body.username, password: req.body.password };
    options = { expiresIn: "1d" };
    console.log(req.body.username);


    DButilsAzure.execQuery("SELECT Password FROM Users WHERE UserName='" + req.body.username + "'")
        .then(function (result) {

            if (result[0] == undefined) {
                res.send("user name or password are invalid");
            }
            else
                if (result[0].Password == req.body.password) {
                    const token = jwt.sign(payload, SECRET, options);
                    res.send(token);
                    log.console(token)
                }
                else {
                    if (result[0].Password != req.body.password) {
                        res.send("password is wrong");
                    }
                }
        })
        .catch(function (err) {
            console.log(err)
            res.send()
        })

});

module.exports = router;







