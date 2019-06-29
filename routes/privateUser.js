var express = require('express');
var app = express();
var DButilsAzure = require('../DButils');
const router = express.Router();
var jwt = require('jsonwebtoken');
var SECRET = 'dorshula';
var currentUserName;

router.use(express.json());
var avg;

router.use('/', (req, res, next) => {
    const token = req.header("x-auth-token")
    // no token
<<<<<<< HEAD
=======
    console.log(token);
>>>>>>> 176b9989f175438e11b882782011baa8aec0eba5
    if (!token) {
        res.status(401).json("Access denied. No token provided.");
        return;
    }
    // verify token
    try {
        const decoded = jwt.verify(token, SECRET);
        req.decoded = decoded;
        currentUserName = decoded.username;
        next(); //move on to the actual function
    } 
    catch (exception) {
        res.status(400).json("Invalid token.");
        return;
    }
});

// 4
router.get('/getQuestions/:username', function(req, res){
    DButilsAzure.execQuery("SELECT Question1, Question2 FROM Users WHERE UserName = '"+currentUserName +"'")
    .then(function(result){
        res.send(result);
         })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

//5
router.post('/checkQuestion', function(req, res){
    DButilsAzure.execQuery("SELECT Answer1, Answer2, Password FROM Users WHERE UserName = '"+currentUserName +"'" + " AND Question1 ='" +req.body.q1 +"'"
    + " AND Question2 ='" +req.body.q2 +"'")
    .then(function(result){
        if(result[0].Answer1 == req.body.ans1 && result[0].Answer2 == req.body.ans2 ){
            res.send(result[0].Password);
        }
    })
    .catch(function(err){
        res.status(400).json("Invalid answers");

    })
})

//6
router.put('/restorePassword', function(req, res){
    DButilsAzure.execQuery("UPDATE Users SET Password='"+req.body.password +"'" + "WHERE UserName  ='" +currentUserName +"'")
    .then(function(result){
        res.status(200).json("password updated");
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
});


//11
router.put('/addFavoritePoi', function(req, res){
    DButilsAzure.execQuery("INSERT INTO user_poi values ('"+currentUserName +"'," + "'" + req.body.poiName  +"')")
    .then(function(result){
        res.status(200).json("poi added");
    })
    .catch(function(err){
        res.status(400).json("something went wrong");

    })
})

router.delete('/deleteFavoritePoi', function(req, res){
    DButilsAzure.execQuery("DELETE FROM  user_poi WHERE UserName = '"+currentUserName +"' and poiName = " + "'" + req.body.poiName  +"'")
    .then(function(result){
        res.status(200).json("poi delete");
    })
    .catch(function(err){
        res.status(400).json("something went wrong");

    })
})

//14
router.post('/addReview', function (req, res, next) {
    DButilsAzure.execQuery("INSERT INTO PoiReview (poiName, poiReview, UserName, rank)" + 
"VALUES ('" +  req.body.poiName + "','" + req.body.poiReview + "','" + currentUserName + "','" + req.body.rank + "') UPDATE Poi set poiRate =(SELECT AVG(cast(rank as decimal(10,2)))/5*100 FROM PoiReview WHERE poiName='"+req.body.poiName +"'" +
") WHERE poiName ='"+req.body.poiName+"'")
    .then(function(result){
        res.status(200).json("poi removed successfully");
    })
    .catch(function(err){
        res.status(400).json("something went wrong");

    })
});


// 15
router.get('/getFavPois', function(req, res){
    DButilsAzure.execQuery("SELECT Poi.poiName, Poi.poiDescription, Poi.poiRate, Poi.poiWatching, Poi.categoryName, Poi.poiURL " +
    "FROM user_poi join Poi " +
    "ON user_poi.poiName = Poi.poiName " +
    "WHERE user_poi.UserName = '"+currentUserName +"'")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

// 12
router.get('/getLastFavPoi', function(req, res){
    DButilsAzure.execQuery("SELECT Top 2 * FROM user_poi join Poi On user_poi.poiName=Poi.poiName WHERE UserName = '"+currentUserName +"' ORDER BY id DESC")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

//10
router.get('/getRecommendedPoi', function(req, res){
    DButilsAzure.execQuery(" declare @Category1 varchar(255) declare @Category2 varchar(255) SET @Category1 = (select TOP 1 categoryName from Users where Users.UserName ='" + currentUserName + "'order by categoryName ASC)" + "SET @Category2 = (select TOP 1 categoryName2 from Users where Users.UserName ='" + currentUserName+"'order by categoryName DESC)"+
    "select TOP 1 * from Poi where categoryName = @Category1 and poiWatching =(select Max(poiWatching) from Poi where categoryName=@Category1)"+
    "UNION ALL select TOP 1 * from Poi where categoryName = @Category2 and poiWatching = (select Max(poiWatching) from Poi where categoryName = @Category2)")  
        .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

//13 removeFavPOi
router.delete('/removeFavPoi', function(req, res){
    DButilsAzure.execQuery("DELETE FROM user_poi WHERE UserName='"+currentUserName +"'" + " AND poiName ='" + req.body.poiName  +"'")
    .then(function(result){
        res.status(200).json("poi removed successfully");
    })
    .catch(function(err){
        res.status(400).json("something went wrong");

    })
})



module.exports = router;
