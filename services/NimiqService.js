const mongoose = require('mongoose');
const Block = mongoose.model('Blocks');
const Transaction = mongoose.model('Transactions');
const TagCache = require('redis-tag-cache');
const Cache = new TagCache.default();
const Nimiq = require('@nimiq/core');
class NimiqService {
    constructor(NimiqHelper) {
        this.$ = NimiqHelper.getConsensus();
        this.helper = NimiqHelper;
        this.$.consensus.blockchain.on('head-changed', (head) => this.headChanged(head));
        this.$.consensus.blockchain.on('block-reverted', (head) => this.blockReverted(head));
    }

    async headChanged(head) {
        let block = await this.helper.getBlockByHash(head.hash().toHex());
        let transactions = [];
        for (let tx of block.transactions) {
            let newTx = Object.assign(new Transaction(), await this.helper.getTransactionByHash(tx));
            await newTx.save();
            transactions.push(newTx._id);
            try {
                Cache.invalidate(tx.recipient.toHex(), tx.sender.toHex());
            } catch (e) {
                Nimiq.Log.w(NimiqService, 'Unable to clear cache. Is redis running?');
            }
        }

        let newBlock = Object.assign(new Block(), block);
        newBlock.transactions = transactions;
        newBlock.save();
    }

    async blockReverted(head) {
        let block = await Block.findOne({hash: head.hash().toHex()});
        block.mainChain = false;
        await block.save();
    }
}

module.exports = NimiqService;