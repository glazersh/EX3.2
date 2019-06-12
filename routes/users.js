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
router.post('/addUser', function(req, res){
    if (req.body.q1 == req.body.q2)
    res.status(400).send("please specify 2 different questions");

    DButilsAzure.execQuery("INSERT INTO Users values('"+req.body.firstname +
    "','"+req.body.lastname + "','"+req.body.username +"','"+req.body.password + "','"+
    req.body.city + "','" + req.body.Country+ "','" + req.body.email+ "','" + req.body.q1+"','" + req.body.ans1+"','" + req.body.q2+"','" + req.body.ans2+"','" + req.body.cn+"')")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})


//9 - LOGIN
router.post("/login",(req,res)=>{
    payload = {username:req.body.username, password: req.body.password };
    options = {expiresIn: "1d"};
    DButilsAzure.execQuery("SELECT Password FROM Users WHERE UserName='"+req.body.username +"'")
    .then(function(result){
        if(result[0].Password == req.body.password ){
            const token = jwt.sign(payload, SECRET, options);
            res.send(token);
        }
        else{
            console.log("password is wrong")
            res.send("password is wrong");

        }
    })
    .catch(function(err){
        console.log(err)
        res.send()
    })
    
});

module.exports = router;







