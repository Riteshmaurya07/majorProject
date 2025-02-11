const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');   // passport-local-mongoose is a Mongoose plugin that simplifies building username and password login with Passport.

const userSchema = new Schema({ 
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);  // This will add a username, hash and salt field to store the username, the hashed password and the salt value.
module.exports=mongoose.model('User', userSchema);  // Exporting the model  