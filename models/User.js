const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

var userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(beautifyUnique)
// let handleDuplicationError = (err, res, next) => {
//     // console.log('the error inside ', err)
//     // let error = new Error('Duplicate entry');
//     console.log(err)
//     next({message: 'Duplicate entry'})
// }

// userSchema.post('save', handleDuplicationError);
userSchema.on('index', err => {console.log('The error is ', err)})
module.exports = mongoose.model('User', userSchema);