const mongoose = require('mongoose');
const AddressBooks = mongoose.model('Contacts');
const router = require('express').Router();
const auth = require('../../../auth');
const Nimiq = require('@nimiq/core');



module.exports = function (NimiqHelper) {

    router.post('/', auth.required, async (req, res, next) => {
        const {body, payload: {id}} = req;
        const userId = id;
        const entry = body;
        if (!entry.label) {
            return res.status(422).json({
                errors: {
                    label: 'is required',
                },
            });
        }

        if (!entry.address) {
            return res.status(422).json({
                errors: {
                    address: 'is required',
                },
            });
        }

        let validAddress;
        try {
            validAddress = Nimiq.Address.fromUserFriendlyAddress(entry.address);
        } catch (e){

        }
        if(!validAddress){
            return res.status(422).json({
                errors: {
                    address: 'is not valid',
                },
            });
        }

        let address = await AddressBooks.findOne({user: id, address: entry.address});
        if(address){
            return res.status(422).json({
                errors: {
                    address: 'already exists',
                },
            });
        }

        const newEntry = new AddressBooks(entry);
        newEntry.user = userId;

        return newEntry.save()
            .then(() => res.json(newEntry));
    });


    router.delete('/:id', auth.required, async (req, res, next) => {
        const {body: {entry}, payload: {id}} = req;

        let address = await AddressBooks.findOne({user: id, _id: req.params.id});
        if(address){
            return address.remove().then(() => res.json({success: true}));
        }
        return res.status(404);
    });



    router.patch('/:id', auth.required, async (req, res, next) => {
        const {body, payload: {id}} = req;
        const userId = id;
        const entry = body;
        if (!entry.label) {
            return res.status(422).json({
                errors: {
                    label: 'is required',
                },
            });
        }

        if (!entry.address) {
            return res.status(422).json({
                errors: {
                    address: 'is required',
                },
            });
        }

        let validAddress;
        try {
            validAddress = Nimiq.Address.fromUserFriendlyAddress(entry.address);
        } catch (e){

        }
        if(!validAddress){
            return res.status(422).json({
                errors: {
                    address: 'is not valid',
                },
            });
        }

        let address = await AddressBooks.findOne({user: id, _id: req.params.id});
        if(address){
            address.label = entry.label;
            address.address = entry.address;
            return address.save().then(() => res.json(address.toJSON()));
        }
        return res.status(404).json({error: 'Not found'});
    });


    router.get('/', auth.required, async (req, res, next) => {
        const {body: {}, payload: {id}} = req;
        let addresses = await AddressBooks.find({user: id});
        let results = [];
        for (let address of addresses) {
            results.push(address.toJSON());
        }
        return res.json(results);
    });
    return router
};