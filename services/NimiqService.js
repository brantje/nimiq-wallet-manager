const mongoose = require('mongoose')
const Block = mongoose.model('Blocks')
const Transaction = mongoose.model('Transactions')
const TagCache = require('redis-tag-cache')
const Cache = new TagCache.default()
const Nimiq = require('@nimiq/core')
class NimiqService {
    constructor(NimiqHelper) {
        this.$ = NimiqHelper.getConsensus()
        this.helper = NimiqHelper
        this.$.consensus.blockchain.on('head-changed', (head) => this.headChanged(head))
        this.$.consensus.blockchain.on('block-reverted', (head) => this.blockReverted(head))
    }

    async headChanged(head) {
        let block = await this.helper.getBlockByHash(head.hash().toHex())
        let transactions = []
        for (let tx of block.transactions) {
            let newTx = Object.assign(new Transaction(), await this.helper.getTransactionByHash(tx))
            try{
                await newTx.save()
            } catch (e){
                Nimiq.Log.w(NimiqService, 'Error while inserting tx')
            }
            transactions.push(newTx._id)
            try {
                Nimiq.Log.i(NimiqService, 'Clearing caches for:', newTx.to, newTx.from)
                Cache.invalidate(newTx.to, newTx.from)
            } catch (e) {
                Nimiq.Log.w(NimiqService, 'Unable to clear cache. Is redis running? Error:', e)
            }
        }

        let newBlock = Object.assign(new Block(), block)
        newBlock.transactions = transactions
        try {
            newBlock.save()
        } catch (e) {
            Nimiq.Log.w(NimiqService, 'Error while inserting block')
        }
    }

    async blockReverted(head) {
        let block = await Block.findOne({hash: head.hash().toHex()})
        block.mainChain = false
        try {
            await block.save()
        } catch (e) {
            Nimiq.Log.w(NimiqService, 'Error while saving block')
        }

    }
}

module.exports = NimiqService