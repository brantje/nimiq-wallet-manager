const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {Schema} = mongoose;

const WalletsSchema = new Schema({
    label: String,
    address: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
});

WalletsSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        label: this.label,
        address: this.address
    };
};
WalletsSchema.index({user: 1});
mongoose.model('Contacts', WalletsSchema);