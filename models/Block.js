const mongoose = require('mongoose');
const {Schema} = mongoose;

const BlockSchema = new Schema({
    number: String,
    hash: {type: String, unique: true, required: true},
    nonce: Number,
    miner: String,
    minerAddress: String,
    difficulty: Number,
    extraData: String,
    size: Number,
    timestamp: Number,
    mainChain: {type: Boolean, default: true},
    transactions: [{
        type: Schema.ObjectId,
        ref: 'Transactions'
    }],
});

BlockSchema.index({number: 1, hash: 1, miner: 1});

BlockSchema.methods.toJSON = function () {
    return {
        number: this.number,
        hash: this.hash,
        nonce: this.nonce,
        miner: this.miner,
        minerAddress: this.minerAddress,
        difficulty: this.difficulty,
        extraData: this.extraData,
        size: this.size,
        timestamp: this.timestamp,
        transactions: this.transactions,
    };
};


mongoose.model('Blocks', BlockSchema);