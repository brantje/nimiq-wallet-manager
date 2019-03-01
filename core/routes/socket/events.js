const express = require('express')
const router = express.Router()
var SocketSingleton = require('../../../lib/SocketSingletion')

module.exports = function (NimiqHelper) {
    const $ = NimiqHelper.getConsensus()
    const SocketIO = 'SocketIO'
    SocketSingleton.io.on('connection', function (socket) {
        Log.d(SocketIO,'A client has connected')
        socket.on('disconnect', function() {
            Log.d(SocketIO,'A client has left us :(')
        })
    })

    $.blockchain = $.consensus.blockchain
    $.mempool = $.consensus.mempool
    $.network = $.consensus.network
    $.accounts = $.consensus.accounts

    $.consensus.network.on('peers-changed', () => {
        Log.d(SocketIO,'Emitting NETWORK_PEERS_CHANGED')
        SocketSingleton.io.emit('NETWORK_PEERS_CHANGED', $.network.peerCount)
    })

    $.consensus.on('established', function () {
        Log.d(SocketIO,'consensus established')
        SocketSingleton.io.emit('CONSENSUS_ESTABLISHED')
    })

    $.consensus.on('lost', function () {
        SocketSingleton.io.emit('CONSENSUS_LOST')
    })

    $.consensus.network.on('peer-joined', () => {
        Log.d(SocketIO,'Emitting NETWORK_PEER_JOINED')
        SocketSingleton.io.emit('NETWORK_PEER_JOINED')
    })
    $.consensus.network.on('peer-left', () => {
        Log.d(SocketIO,'Emitting NETWORK_PEER_LEFT')
        SocketSingleton.io.emit('NETWORK_PEER_LEFT')
    })

    $.blockchain.on('head-changed', async (head) => {
        Log.d(SocketIO,'Emitting BLOCKCHAIN_HEAD_CHANGED')
        SocketSingleton.io.emit('BLOCKCHAIN_HEAD_CHANGED', await NimiqHelper._blockToObj(head, false))
    })

    $.mempool.on('transaction-added', (tx) => {
        if($.consensus.established) {
            Log.d(SocketIO,'Emitting MEMPOOL_TRANSACTION_ADDED')
            SocketSingleton.io.emit('MEMPOOL_TRANSACTION_ADDED', NimiqHelper._transactionToObj(tx))
        }
    })

    $.mempool.on('transactions-ready', () => {
        if($.consensus.established) {
            Log.d(SocketIO,'Emitting MEMPOOL_TRANSACTIONS_READY')
            SocketSingleton.io.emit('MEMPOOL_TRANSACTIONS_READY')
        }
    })

    return router
}