var User = require('../models/User');
var router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const verifyAuth = require('../authentication/verifyAuth')
const passport = require('passport');

router.get('/', verifyAuth.isLoggedIn, verifyAuth.isAdmin, (req, res) => {
    res.json({ message: 'Welcome to users' })
});

router.post('/signup', (req, res) => {
    if (req.body.email != undefined && req.body.username != undefined) {
        User.findOne({ email: req.body.email })
            .then(
                user => {
                    if (user) {
                        res.status(400).json({ message: 'email address already used' });
                    }
                    else {
                        // if(user.username === req.body.username)
                        let newUser = {
                            name: req.body.name,
                            email: req.body.email,
                            username: req.body.username,
                            password: req.body.password
                        };

                        bcrypt.genSalt(10)
                            .then(
                                salt => {
                                    bcrypt.hash(newUser.password, salt)
                                        .then(
                                            hash => {
                                                newUser.password = hash;
                                                User.create(newUser)
                                                    .then(
                                                        user => {
                                                            let { password, ...updatedUser } = user._doc;
                                                            res.status(200).json({ user: updatedUser });
                                                        }
                                                    )
                                            }
                                        )
                                        .catch(
                                            err => res.status(500).json({ message: 'Internal error while creating your account' })
                                        )
                                }
                            )
                            .catch(
                                err => res.status(500).json({ message: 'Internal server error while creating your account' })
                            );
                    }
                }
            )
            .catch(
                err => {
                    console.log('The error is ', err)
                    res.status(500).json({ message: err })
                }
            )
    }
    else {
        res.json(400).json({ message: 'You must provide an email' })
    }
})

router.post('/login', (req, res) => {
    if (req.body.email == undefined || req.body.password == undefined) {
        res.status(400).json({ message: 'you must provide all credentials' });
    }
    else {
        User.findOne({ email: req.body.email })
            .then(
                user => {
                    if (user) {
                        // res.status(200).json({token: jwt.sign()});
                        bcrypt.compare(req.body.password, user.password)
                            .then(
                                isMatch => {
                                    if (isMatch) {
                                        //  jwt.sign()
                                        console.log('the user id is ', user._id);
                                        let token = jwt.sign({ id: user._id }, config.jwtSecret);
                                        res.status(200).json({ token })
                                    }
                                    else {
                                        res.status(401).json({ message: 'Incalid userame or password' })
                                    }
                                }
                            )
                    }
                    else {
                        res.status(401).json({ message: 'Invalid username or password' })
                    }
                }
            );

        // res.json({message: 'loggedIn'})
    }
})

module.exports = router;

