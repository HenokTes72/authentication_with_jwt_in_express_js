var express = require('express');
var app = express();

var mongoose = require('mongoose');
var passport = require('passport')

const usersRoute = require('./routes/users');
const bodyParser = require('body-parser');
const JwtStrategy = require('./authentication/jwtStrategy');
require('dotenv').config();
// fixes issues with depreciation
mongoose.set('useCreateIndex', true);
// connect to mongodb
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(
        connected => console.log('successfully connected')
    )
    .catch(
        err => console.log(err)
    );
// Make passport use the jwt strategy
passport.use(JwtStrategy);
// Initialize passport 
app.use(passport.initialize());
// use body parser to parse incoming request body
app.use(bodyParser.json());
// mount users route
app.use('/users', usersRoute);

app.listen(process.env.SERVER_PORT, () => console.log('app started listening on port 4000'));  