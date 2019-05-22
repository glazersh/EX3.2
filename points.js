var express = require('express');
var app = express();
var DButilsAzure = require('../DButils');
const router = express.Router();

// 1
app.get('/ListOfPoints', function(req, res){
    DButilsAzure.execQuery("SELECT * FROM Poi")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})


// 2
app.get('/ListOfPoints/:poiName', function(req, res){
    console.log(req.params.poiName);
    DButilsAzure.execQuery("SELECT * FROM Poi WHERE poiName = '"+req.params.poiName +"'")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

module.exports = app;