var express = require('express');
var app = express();

var mongoose = require('mongoose');
var passport = require('passport')

const usersRoute = require('./routes/users');
const bodyParser = require('body-parser');
const JwtStrategy = require('./authentication/jwtStrategy');

// const JwtStrategy = require('./authentication/jwtStrategy');



// fixes issues with deprecated default in Mongoose.js
mongoose.set('useCreateIndex', true);

// connect to mongodb
mongoose.connect(`mongodb://localhost:27017/token_auth`, { useNewUrlParser: true })
    .then(
        connected => console.log('successfully connected')
    )
    .catch(
        err => console.log(err)
    );
app.use((req, res, next) => {
    console.log(req.headers.authorization);
    next()
})
// Make passport use the jwt strategy
passport.use(JwtStrategy);
// Initialize passport 
app.use(passport.initialize());
// use body parser to parse incoming request body
app.use(bodyParser.json());
// mount users route
app.use('/users', usersRoute);

app.listen(4000, () => console.log('app started listening on port 4000'));  