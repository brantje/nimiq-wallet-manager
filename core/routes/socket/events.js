const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Session = mongoose.model('Sessions')
const Wallet = mongoose.model('Wallets')
const JsonWebToken = require('jsonwebtoken')

const SocketSingleton = require('../../../lib/SocketSingletion')

module.exports = function (NimiqHelper) {
    const $ = NimiqHelper.getConsensus()
    const SocketIO = 'SocketIO'
    let clients = []

    SocketSingleton.io.on('connection', function (socket) {
        Log.d(SocketIO, 'A client has connected')

        let token = Buffer.from(socket.handshake.query.token, 'base64').toString()
        JsonWebToken.verify(token, process.env.JWT_SECRET, async function (error, decodedToken) {
            if (error) {
                socket.disconnect(true)
            }
            let session = await Session.findOne({_id: decodedToken.session_id, deleted: 0})
            if (session) {
                clients.push({
                    socket: socket,
                    session: decodedToken.session_id,
                    userId: decodedToken.id
                })
            } else {
                socket.disconnect(true)
            }
        })

        socket.on('disconnect', function () {
            clients = clients.filter(function (obj) {
                return obj.socket !== socket
            })
            Log.d(SocketIO, 'A client has left us :(')
        })
    })

    $.blockchain = $.consensus.blockchain
    $.mempool = $.consensus.mempool
    $.network = $.consensus.network
    $.accounts = $.consensus.accounts

    $.consensus.network.on('peers-changed', () => {
        Log.d(SocketIO, 'Emitting NETWORK_PEERS_CHANGED')
        SocketSingleton.io.emit('NETWORK_PEERS_CHANGED', $.network.peerCount)
    })

    $.consensus.on('established', function () {
        Log.d(SocketIO, 'consensus established')
        SocketSingleton.io.emit('CONSENSUS_ESTABLISHED')
    })

    $.consensus.on('lost', function () {
        SocketSingleton.io.emit('CONSENSUS_LOST')
    })

    $.consensus.network.on('peer-joined', () => {
        Log.d(SocketIO, 'Emitting NETWORK_PEER_JOINED')
        SocketSingleton.io.emit('NETWORK_PEER_JOINED')
    })
    $.consensus.network.on('peer-left', () => {
        Log.d(SocketIO, 'Emitting NETWORK_PEER_LEFT')
        SocketSingleton.io.emit('NETWORK_PEER_LEFT')
    })

    $.blockchain.on('head-changed', async (head) => {
        Log.d(SocketIO, 'Emitting BLOCKCHAIN_HEAD_CHANGED')
        let block = await NimiqHelper._blockToObj(head, true)
        let affectedAddresses = []
        for (let tx of block.transactions) {
            if (affectedAddresses.indexOf(tx.fromAddress) === -1) {
                affectedAddresses.push(tx.fromAddress)
            }
            if (affectedAddresses.indexOf(tx.toAddress) === -1) {
                affectedAddresses.push(tx.toAddress)
            }
        }
        let refresh = false
        for (let client of clients) {
            let wallets = await Wallet.find({user: client.userId, deleted: 0}, 'address')
            wallets = wallets.map((e) => e.address)
            for(let wallet of wallets){
                if(affectedAddresses.indexOf(wallet) >= 0){
                    refresh = true
                    break
                }
            }
        }
        SocketSingleton.io.emit('BLOCKCHAIN_HEAD_CHANGED', {refresh})
    })

    $.mempool.on('transaction-added', (tx) => {
        if ($.consensus.established) {
            Log.d(SocketIO, 'Emitting MEMPOOL_TRANSACTION_ADDED')
            SocketSingleton.io.emit('MEMPOOL_TRANSACTION_ADDED', NimiqHelper._transactionToObj(tx))
        }
    })

    $.mempool.on('transactions-ready', () => {
        if ($.consensus.established) {
            Log.d(SocketIO, 'Emitting MEMPOOL_TRANSACTIONS_READY')
            SocketSingleton.io.emit('MEMPOOL_TRANSACTIONS_READY')
        }
    })

    return router
}