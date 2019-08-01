require('dotenv').config();


module.exports = {
    jwtSecret : process.env.JWT_SECRET,
    methodNames: {
        signup: 'signup'
    }
}