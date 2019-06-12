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
    if (!token) {
        res.status(401).json("Access denied. No token provided.");
        return;
    }
    // verify token
    try {
        console
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

//3
router.post('/addUser', function(req, res){
    if (req.body.q1 == req.body.q2)
    res.status(400).send("please specify 2 different questions");
if (req.body.cn.length < 2)
    res.status(400).send("need at least 2 verifing questions");
    
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
    DButilsAzure.execQuery("SELECT poiName FROM user_poi WHERE UserName = '"+currentUserName +"'")
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
    DButilsAzure.execQuery("SELECT Top 2 poiName FROM user_poi WHERE UserName = '"+currentUserName +"' ORDER BY id DESC")
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
    DButilsAzure.execQuery(" declare @Category1 varchar(255) declare @Category2 varchar(255) SET @Category1 = (select TOP 1 categoryName from Users where Users.UserName ='" + currentUserName + "'order by categoryName ASC)" + "SET @Category2 = (select TOP 1 categoryName from Users where Users.UserName ='" + currentUserName+"'order by categoryName DESC)"+
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

module.exports = router;
