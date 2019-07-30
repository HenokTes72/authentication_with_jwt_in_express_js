const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const config = require('../config/constants');
const opts = {
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
    secretOrKey: config.jwtSecret
};


module.exports = passport => {
    passport.use(new Strategy(opts, (payload, done) => {
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
    }))
}