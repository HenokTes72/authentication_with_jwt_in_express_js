const { body } = require('express-validator');
const User = require('../models/User');

module.exports.validateSignup = () => {
  return [
    // Email validation
    body('email')
      .exists().withMessage('Email is required') // checks for existance first
      .isEmail().withMessage('Invalid email')    // checks if it is a valid e-mail
      .custom(email => {                        // checks if it is already used in the database
        return User.findOne({ email: email })
          .then(
            user => {
              if (user) {
                return Promise.reject('Email already in use')
              }
            }
          );
      }).withMessage('Email is already used'),
    // Username validation
    body('username')
      .exists().withMessage('Username is required')// checks for existane
      .isLength({ min: 5 }).withMessage('Username must be atleast five characters')
      .custom(username => {
        return User.findOne({ username: username })
          .then(
            user => {
              if (user) {
                return Promise.reject('Username already in use')
              }
            }
          );
      }).withMessage('Username already in use'),

    body('password')
      .exists().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be atleast 6 characters long'),

    body('name')
      .exists().withMessage('Name is required')
  ];
};

module.exports.validateLogin = () => {
  return [
    body('email')
      .exists().withMessage('You must provide username'),

    body('password')
      .exists().withMessage('You must provide password'),
    
      body(['email', 'password']).exists().withMessage('You must provide both username and password')
  ];
}