const auth = require('../../auth');
const express = require('express');
const Nimiq = require('@nimiq/core');

const router = express.Router();

module.exports = function (NimiqHelper) {
    router.get('/:hash', async (req, res, next) => {
        try {
            const transaction = await NimiqHelper.getTransactionByHash(req.params.hash);
            return res.json(transaction);
        } catch (e){
            res.status(422);
            return res.json({'error': e.message});
        }
    });

    router.post('/send', auth.required, async (req, res, next) => {
        const {payload: {id}, body: {tx} } = req;
        let b = [];
        console.log(tx)
        for (let key in tx) {
            if (tx.hasOwnProperty(key)) {
                if (!isNaN(key)) {
                    b.push(tx[key])
                }
            }
        }
        console.log(b)
        let Buf = new Nimiq.SerialBuffer(b);
        let txObj = Nimiq.Transaction.unserialize(Buf);
        let result = await NimiqHelper.sendTx(txObj);
        console.log(result);
        if (result === 1) {
            return res.json({success: true});
        } else {
            return res.json({error: {mempoolError: result}});
        }
    });


    return router
};

