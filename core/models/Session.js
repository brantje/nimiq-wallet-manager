const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const {Schema} = mongoose

const SessionSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    created: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now},
    expires: {type: Date, default: Date.now},
    sessionIpLocked: {type: Boolean, default: false},
    ip: {type: String},
    location: {type: Object},
    browser: {type: Object},
    deleted: {type: Number, default: 0}
})

SessionSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        created: this.created,
        lastActive: new Date(this.lastActive).getTime() / 1000,
        expires:  new Date(this.expires).getTime() / 1000,
        sessionIpLocked: this.sessionIpLocked,
        ip: this.ip,
        location: this.location,
        browser: this.browser,
    }
}
SessionSchema.index({user: 1})
mongoose.model('Sessions', SessionSchema)