const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {Schema} = mongoose;

const UserSchema = new Schema({
    "username": {type: String, unique: true, required: true},
    "hash": String,
    "salt": String,
    "email": {type: String, unique: true, required: true},
    "active": {type: Boolean, default: true},
    "settings": {type: Object }
});

UserSchema.index({username: 1, email: 1});


UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 1);

    return jwt.sign({
        "username": this.username,
        "id": this._id,
        "two_factor_enabled": this.settings.two_factor_enabled || false,
        "2fa_secret": this.settings.two_factor_secret || false,
        "exp": parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.JWT_SECRET);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        username: this.username,
        token: this.generateJWT(),
    };
};

UserSchema.methods.toJSON = function () {
    const user = {
        "username": this.username,
        "settings": this.settings,
    };
    return user;
};

mongoose.model('Users', UserSchema);