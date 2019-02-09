const express = require('express');
const Nimiq = require('@nimiq/core');
const router = express.Router();

module.exports = function (NimiqHelper) {
    const $ = NimiqHelper.getConsensus();


    router.get('/peer-list', function (req, res, next) {
        res.json(NimiqHelper.getPeerList());
    });


    router.get('/stats', function (req, res, next) {
        let now = Date.now()/ 1000;
        let diff = now - $.blockchain.head.timestamp;
        res.json({
            consensus: $.established,
            hashrate: Math.round($.blockchain.head.difficulty * Math.pow(2, 16) / 60),
            lastFound: diff,
            height: $.blockchain.height,
            difficulty: $.blockchain.head.difficulty,
            lastReward: Nimiq.Policy.blockRewardAt($.blockchain.head.height) + $.blockchain.head.transactions.reduce((sum, tx) => sum + tx.fee, 0),
            network: {
                bytesSent: $.network.bytesSent,
                bytesReceived: $.network.bytesReceived,
                peerCount: $.network.peerCount
            }
        });
    });


    router.get('/mempool', function (req, res, next) {
        let result = $.mempool.getTransactions().map((tx) => NimiqHelper._transactionToObj(tx));
        res.json(result);
    });

    return router
}

