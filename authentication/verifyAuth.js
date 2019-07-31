const passport = require('passport');


module.exports = {
    isLoggedIn: passport.authenticate('jwt', {session: false}),
    isAdmin: (req, res, next) => {
        console.log('The user is ',req.user)
        if(!req.user.isAdmin){
            res.status(401).json({message: 'unauthorized'})
        }
        else {
            next();
        }
    }
}