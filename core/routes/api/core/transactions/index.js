const router = require('express').Router();
const auth = require('../../../auth');
const Nimiq = require('@nimiq/core');
const mongoose = require('mongoose');
const Wallets = mongoose.model('Wallets');
/**
 * @apiDefine TransactionGroup Transaction
 *
 * Get and send transactions
 */
module.exports = function (NimiqHelper, Cache) {

    const $ = NimiqHelper.getConsensus();

    router.get('/recent', auth.required, async (req, res, next) => {
        const {payload: {id}} = req;
        let results = [];

        let wallets = await Wallets.find({user: id});
        let tags = [];
        if (wallets) {
            for (let wallet of wallets) {
                let addr = Nimiq.Address.fromUserFriendlyAddress(wallet.address);
                let txs = await NimiqHelper.getAccountTransactions(addr, 50);
                tags.push(addr.toHex());
                results = [].concat(results, txs);
            }
        }
        results = results.filter((tx, index, self) =>
            index === self.findIndex((t) => (
                t.hash === tx.hash
            ))
        );
        return res.json(results);
    });


    /*
     * @TODO implement new structure
     */
    /**

     * @api {post} /transaction/send Send transaction
     * @apiVersion 1.0.0
     * @apiGroup TransactionGroup
     * @apiName sendTransaction
     * @apiParam {json} tx  Serialized transaction
     * @apiParamExample {json} Request-Example:
     *     {
     *       "tx": {
                serialized tx
                }
     *     }
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *       {
     *            "success": true
     *        }
     */
    router.post('/send', auth.required, async (req, res, next) => {
        const {payload: {id}, body} = req;
        const tx = body;
        let b = [];
        for (let key in tx.tx) {
            if (tx.tx.hasOwnProperty(key)) {
                if (!isNaN(key)) {
                    b.push(tx.tx[key])
                }
            }
        }
        let Buf = new Nimiq.SerialBuffer(b);
        let txObj = Nimiq.Transaction.unserialize(Buf);
        let result = await NimiqHelper.sendTx(txObj);
        if (result === 1) {
            return res.json({success: true});
        } else {
            return res.json({error: {mempoolError: result}});
        }
    });
    return router;
};