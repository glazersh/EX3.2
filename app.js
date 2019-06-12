var express = require('express');
var app = express();
const cors = require('cors')
app.use(cors())
app.options('*',cors())
var DButilsAzure = require('./DButils');

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);


const pointsRoutes = require('./routes/points');
app.use('/points', pointsRoutes);

const CountriesRoutes = require('./routes/Countries');
app.use('/Countries', CountriesRoutes);


const userRoutes = require('./routes/privateUser');
app.use('/privateUser', userRoutes);







