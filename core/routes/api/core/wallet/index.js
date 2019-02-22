const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../../auth');
const Wallets = mongoose.model('Wallets');
const Nimiq = require('@nimiq/core');

module.exports = function (NimiqHelper) {

    router.post('/', auth.required, async (req, res, next) => {
        const {body, payload: {id}} = req;
        const wallet = body;
        const userId = id;
        if (!wallet.label) {
            return res.status(422).json({
                errors: {
                    label: 'is required',
                },
            });
        }

        if (!wallet.address) {
            return res.status(422).json({
                errors: {
                    address: 'is required',
                },
            });
        }

        let validAddress;
        try {
            validAddress = Nimiq.Address.fromUserFriendlyAddress(wallet.address);
        } catch (e) {

        }
        if (!validAddress) {
            return res.status(422).json({
                errors: {
                    address: 'is not valid',
                },
            });
        }

        let exists = await Wallets.findOne({user: id, address: wallet.address, deleted: 0});
        if (exists) {
            return res.status(422).json({
                errors: {
                    address: 'already exists for this user',
                },
            });
        }

        const newWallet = new Wallets(wallet);
        newWallet.user = userId;

        return newWallet.save()
            .then(() => res.json(newWallet.toJSON()));
    });


    router.get('/:address', auth.required, async (req, res, next) => {
        const {payload: {id}} = req;
        let addr;
        try {
            addr = Nimiq.Address.fromUserFriendlyAddress(req.params.address);
        } catch (e) {

        }
        if (!addr) {
            return res.status(422).json({
                errors: {
                    address: 'is not valid',
                },
            });
        }
        let wallet = await Wallets.findOne({user: id, address: addr.toUserFriendlyAddress(), deleted: 0});
        if (wallet) {
            let result = wallet.toJSON();
            let info = await NimiqHelper.getAccount(addr.toUserFriendlyAddress());
            let txs = await NimiqHelper.getAccountTransactions(addr, 200);
            result.balance = 0;
            if (info && info.balance) {
                result.balance = info.balance;
            }
            result.transactions = txs;
            return res.json(result);
        }
        return res.status(404).json({error: "Not found"});
    });

    router.get('/:address/seed', auth.required, async (req, res, next) => {
        const {payload: {id}} = req;
        let addr;
        try {
            addr = Nimiq.Address.fromUserFriendlyAddress(req.params.address);
        } catch (e) {

        }

        if (!addr) {
            return res.status(422).json({
                errors: {
                    address: 'is not valid',
                },
            });
        }


        let wallet = await Wallets.findOne({user: id, address: req.param('address')});
        if (wallet) {
            return res.json({seed: wallet.encryptedPrivateKey});
        }
        return res.status(404);
    });

    router.patch('/:address', auth.required, async (req, res, next) => {
        const {payload: {id}, body,} = req;
        const wallet = body;
        let walleta = await Wallets.findOne({user: id, address: req.param('address')});
        if (walleta) {
            if (wallet.label) {
                walleta.label = wallet.label;
            }
            if (wallet.order) {
                walleta.order = wallet.order;
            }
            return walleta.save().then(() => res.json(walleta.toJSON()));
        }
        return res.status(404);
    });

    router.delete('/:address', auth.required, async (req, res, next) => {
        const {payload: {id}} = req;

        let wallet = await Wallets.findOne({user: id, address: req.param('address')});
        if (wallet) {
            wallet.deleted = 1;
            return wallet.save().then(() => res.json({success: true}));
        }
        return res.status(404);
    });


    router.get('/', auth.required, async (req, res, next) => {
        const {payload: {id}} = req;
        let wallets = await Wallets.find({user: id, deleted: 0}).sort('order');
        let results = [];
        for (let wallet of wallets) {
            let result = wallet.toJSON();
            let info = await NimiqHelper.getAccount(wallet.address);
            result.balance = 0;
            if (info && info.balance) {
                result.balance = info.balance;
            }
            results.push(result)
        }
        return res.json(results);
    });
    return router;
};