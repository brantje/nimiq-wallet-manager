const mongoose = require('mongoose')
const {Schema} = mongoose

const TransactionSchema = new Schema({
    hash: {type: String, unique: true, required: true},
    blockHash: {type: String, required: true},
    blockNumber: Number,
    timestamp: Number,
    validityStartHeight: Number,
    from: String,
    fromAddress: String,
    to: String,
    toAddress: String,
    value: Number,
    fee: Number,
    data: String,
    flags: Number
})

TransactionSchema.index({hash: 1, from: 1, to: 1})

TransactionSchema.methods.toJSON = function () {
    return {
        hash: this.hash,
        blockHash: this.blockHash,
        blockNumber: this.blockNumber,
        timestamp: this.timestamp,
        validityStartHeight: this.validityStartHeight,
        from: this.from,
        fromAddress: this.fromAddress,
        to: this.to,
        toAddress: this.toAddress,
        value: this.value,
        fee: this.fee,
        data: this.data,
        flags: this.flags
    }
}


mongoose.model('Transactions', TransactionSchema)