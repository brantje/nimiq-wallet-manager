const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const {Schema} = mongoose

const UserSchema = new Schema({
    'username': {type: String, unique: true, required: true},
    'hash': String,
    'salt': String,
    'email': {type: String, unique: true, required: true},
    'active': {type: Boolean, default: true},
    'settings': {type: Object }
})

UserSchema.index({username: 1, email: 1})


UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

UserSchema.methods.generateJWT = function (params) {
    return jwt.sign({
        'username': this.username,
        'id': this._id,
        'session_id': params.session,
        'two_factor_enabled': (this.settings) ? this.settings.two_factor_enabled : false,
        'two_factor_secret': (this.settings) ? this.settings.two_factor_secret : false,
    }, process.env.JWT_SECRET)
}

UserSchema.methods.toAuthJSON = function (params) {
    return {
        _id: this._id,
        username: this.username,
        token: this.generateJWT(params),
    }
}

UserSchema.methods.toJSON = function () {
    const user = {
        'username': this.username,
        'settings': this.settings,
    }
    return user
}

mongoose.model('Users', UserSchema)