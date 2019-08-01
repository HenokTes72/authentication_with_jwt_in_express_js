var User = require('../models/User');
var router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const verifyAuth = require('../authentication/verifyAuth');

const inputValidation = require('../utils/inputVailidation');
const { check, validationResult } = require('express-validator');

router.get('/', verifyAuth.isLoggedIn, (req, res) => {
    res.json({ message: 'Welcome to users' })
});

// signup route
router.post('/signup', inputValidation.validateSignup(), (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Email error ', errors);
        res.status(422).json({ errors: errors.array() });
    }
    else {
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
                                    .catch(
                                        err => {
                                            console.log(err)
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
});

// login route
router.post('/login', inputValidation.validateLogin(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
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
    }
});

module.exports = router;

