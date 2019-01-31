const express = require('express');
const router = express.Router();
var SocketSingleton = require('../../lib/SocketSingletion');

module.exports = function (NimiqHelper) {
    const $ = NimiqHelper.getConsensus();
    const SocketIO = 'SocketIO';
    SocketSingleton.io.on('connection', function (socket) {
        Log.d(SocketIO,'A client has connected');
        socket.on('disconnect', function() {
            Log.d(SocketIO,'A client has left us :(');
        });
    });

    $.blockchain = $.consensus.blockchain;
    $.mempool = $.consensus.mempool;
    $.network = $.consensus.network;
    $.accounts = $.consensus.accounts;

    $.consensus.network.on('peers-changed', () => {
        Log.d(SocketIO,'Emitting network:peers-changed');
       SocketSingleton.io.emit('network:peers-changed', $.network.peerCount);
    });

    $.consensus.on('established', function () {
       Log.d(SocketIO,'consensus established');
        SocketSingleton.io.emit('consensus:established');
    });

    $.consensus.on('lost', function () {
        SocketSingleton.io.emit('consensus:lost');
    });

    $.consensus.network.on('peer-joined', () => {
        Log.d(SocketIO,'Emitting network:peer-joined');
       SocketSingleton.io.emit('network:peer-joined');
    });
    $.consensus.network.on('peer-left', () => {
        Log.d(SocketIO,'Emitting network:peer-left');
       SocketSingleton.io.emit('network:peer-left');
    });

    $.blockchain.on('head-changed', async (head) => {
        Log.d(SocketIO,'Emitting blockchain:head-changed');
        SocketSingleton.io.emit('blockchain:head-changed', await NimiqHelper._blockToObj(head, false));
    });

    $.mempool.on('transaction-added', (tx) => {
        if($.consensus.established) {
            Log.d(SocketIO,'Emitting mempool:transaction-added');
            SocketSingleton.io.emit('mempool:transaction-added', NimiqHelper._transactionToObj(tx));
        }
    });

    $.mempool.on('transactions-ready', () => {
        if($.consensus.established) {
            Log.d(SocketIO,'Emitting mempool:transactions-ready');
            SocketSingleton.io.emit('mempool:transactions-ready');
        }
    });

    return router
};