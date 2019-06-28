var express = require('express');
var app = express();
var DButilsAzure = require('../DButils');
const router = express.Router();
var jwt = require('jsonwebtoken');
var SECRET = 'dorshula';
var currentUserName;
router.use(express.json());


// 1
router.get('/ListOfPoints', function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM Poi")

        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})


// 2
router.get('/ListOfPoints/:poiName', function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM Poi WHERE poiName = '" + req.params.poiName + "'")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})


//7
router.get('/getRandomPOI', function (req, res) {
    DButilsAzure.execQuery("SELECT TOP 3 * FROM Poi WHERE poiRate > 3 ")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

//8
router.get('/getLastReview', function (req, res) {
    DButilsAzure.execQuery("select Top 2 timeStemp from PoiReview where poiName='" + req.body.poiName + "'" +
        "order by timeStemp DESC ")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

//8
router.get('/getCategories', function (req, res) {
    DButilsAzure.execQuery("select categoryName from Categories")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

//12
router.get('/ListOfPointsByCategory/:cn', function (req, res) {
    DButilsAzure.execQuery("select * from Poi where categoryName = '" + req.params.cn + "'")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})

// update watch
router.put('/addPoiWatching', function (req, res) {
    console.log("GHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    DButilsAzure.execQuery("UPDATE Poi SET poiWatching = poiWatching + 1 WHERE poiName = '" + req.body.poiName + "'")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
})


module.exports = router;