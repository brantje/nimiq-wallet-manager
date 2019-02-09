const mongoose = require('mongoose');

const {Schema} = mongoose;

const WalletsSchema = new Schema({
    label: String,
    address: String,
    encryptedPrivateKey: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    order: Number
});

WalletsSchema.index({user: 1});
WalletsSchema.methods.toJSON = function () {
    return {
        label: this.label,
        address: this.address,
        order: this.order || 0,
        hasPrivateKey: (this.encryptedPrivateKey !== "")
    };
};


mongoose.model('Wallets', WalletsSchema);