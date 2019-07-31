# Token based authentication with JWT in express js
This project demonstrates how to use jwt - json web token and passport in an express application
## Description
[JWT](https://jwt.io/introduction/) is a Internet standard for creating JSON-based access tokens that assert some number of claims. For example, a server could generate a token that has the claim "logged in as admin" and provide that to a client. The client could then use that token to prove that it is logged in as admin and provide that to the server [JSON WEB TOKEN](https://en.wikipedia.org/wiki/JSON_Web_Token)

[Passport](http://www.passportjs.org)  Passport is authentication middleware for Node.js. It can be dropped into any Express-based  web applicaiton.  

Using these two libraries, we can implement a token based authentication in our express app
 
## How I implemented
* I first defined the strategy for passport to operate in jwtStrategy.js file inside authentication directory and exported it

```javascript
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const config = require('../config/constants');
const opts = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.jwtSecret
};


module.exports = new Strategy(opts, (payload, done) => {
    console.log('The payload is ', payload)
    User.findById(payload.id)
        .then(
            userFound => {
                if (userFound) {
                    const { password, ...user } = userFound._doc;
                    return done(null, user)
                }
                return done(null, false);
            }
        )
        .catch(
            err => console.log(err)
        )
})
```

* Then imported the stratagy defined and make passport use it in the main entry file

```javascript
    var passport = require('passport');
    const JwtStrategy = require('./authentication/jwtStrategy');
    // skipped some lines of code to concern on the domain
    //*****************************************************//

    // Make passport use the jwt strategy
    passport.use(JwtStrategy);
    // Initialize passport 
    app.use(passport.initialize());
```

* Created 'verifyAuth' module that checks whether the user is loggedIn or not or is admin or not
```javascript
    const passport = require('passport');


module.exports = {
    isLoggedIn: passport.authenticate('jwt', {session: false}),
    isAdmin: (req, res, next) => {
        if(!req.user.isAdmin){
            res.status(401).json({message: 'unauthorized'})
        }
        else {
            next();
        }
    }
}
```

* Imported the verifyAuth and used middlewares difined in a route ex: in /routes/users.js

```javascript
    // Skiped some lines of code to concern on the domain
    const verifyAuth = require('../authentication/verifyAuth');

    // now using isLoggedIn to check wheter the user has the authorized token or not
    // in /users
    
    router.get('/', verifyAuth.isLoggedIn, (req, res) => {
    res.json({ message: 'Welcome to users' })
});
```

## Installation and usage
* Clone the repository
```bash
git clone https://github.com/HizkiasAbraham/authentication_with_jwt_in_express_js.git
```
* Now navigate to the cloned directory
 ```bash
cd authentication_with_jwt_in_express_js
 ```
* Install the dependencies required
 ```bash
 npm install
```
* You have to create a .env file with the following values specific to your environment
```bash
NODE_ENV='your development environment'
JWT_SECRET='the secret text used to sign the token and verify later'

SERVER_PORT = 'port of the server you want to run'
DB_URL = 'url to a mongo database'
```
* Run the application
```bash
npm start
```

## How to test
* Create a user through *your-server-address/users/signup* with **POST** method and the fields of the user model
* Try to access *your-server-address/users* with **GET** method 
    * It shoud respond with a status code 401 - unauthorized
* Now log in with the credential of the user you signed up earlier through *your-server-address/users/login* and **POST** method
    * Copy the token returned after a successful login
    * Addthe token to your request header with name 'Authorizaiton'
    * Try to access *your-server-address/users* with **GET** method again
        *  It should return a message 'Welcome to users'



