const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {Schema} = mongoose;

const SessionSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    created: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now},
    expires: {type: Date, default: Date.now},
    sessionIpLocked: {type: Boolean, default: false},
    ip: {type: String},
    location: {type: String},
    browser: {type: Object},
    deleted: {type: Number, default: 0}
});

SessionSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        created: this.created,
        lastActive: this.lastActive,
        expires: this.expires,
        sessionIpLocked: this.sessionIpLocked,
        ip: this.ip,
        location: this.ip,
    };
};
SessionSchema.index({user: 1});
mongoose.model('Sessions', SessionSchema);