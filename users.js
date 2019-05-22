var express = require('express');
var app = express();
var DButilsAzure = require('../DButils');
const router = express.Router();

router.use(express.json());


//3
router.post('/addUser', function(req, res){
    DButilsAzure.execQuery("INSERT INTO Users values('"+req.body.firstname +
    "','"+req.body.lastname + "','"+req.body.username +"','"+req.body.password + "','"+
    req.body.city + "','" + req.body.Country+ "','" + req.body.email+ "','" + req.body.ID+"','" + req.body.q1+"','" + req.body.ans1+"','" + req.body.q2+"','" + req.body.ans2+"')")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

// 4
router.get('/getQuestion/:username', function(req, res){
    DButilsAzure.execQuery("SELECT Question1, Question2 FROM Users WHERE UserName = '"+req.params.username +"'")
    .then(function(result){
        res.send(result)
     })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})


//5
router.post('/checkQuestion', function(req, res){
    DButilsAzure.execQuery("SELECT Answer1, Password FROM Users WHERE UserName = '"+req.body.username +"'" + " AND Question1 ='" +req.body.q1 +"'")
    .then(function(result){
        if(result['Answer1'] == req.body.ans1){
            res.send(result['Password']);
        }
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})


// 10
router.get('/getRecommendedPoi/:username', function(req, res){
    DButilsAzure.execQuery("SELECT Poi FROM USER_POI WHERE UserName = '"+req.params.username +"'")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

module.exports = router;
