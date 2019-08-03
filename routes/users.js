var router = require('express').Router();
const verifyAuth = require('../authentication/verifyAuth');

const inputValidation = require('../utils/inputVailidation');
const usersController = require('../controllers/usersController');

// the root route to users
router.get('/', verifyAuth.isLoggedIn, usersController.home);

// signup route
router.post('/signup', inputValidation.validateSignup(), usersController.signup);

// login route
router.post('/login', inputValidation.validateLogin(), usersController.login);

module.exports = router;

