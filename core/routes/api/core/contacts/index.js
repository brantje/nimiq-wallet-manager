const mongoose = require('mongoose')
const Contact = mongoose.model('Contacts')
const router = require('express').Router()
const auth = require('../../../auth')
const Nimiq = require('@nimiq/core')



module.exports = function (NimiqHelper) {

    router.post('/', auth.required, async (req, res, next) => {
        const {body, payload: {id}} = req
        const userId = id
        const entry = body
        if (!entry.label) {
            return res.status(422).json({
                errors: {
                    label: 'is required',
                },
            })
        }

        if (!entry.address) {
            return res.status(422).json({
                errors: {
                    address: 'is required',
                },
            })
        }

        let validAddress
        try {
            validAddress = Nimiq.Address.fromUserFriendlyAddress(entry.address)
        } catch (e){

        }
        if(!validAddress){
            return res.status(422).json({
                errors: {
                    address: 'is not valid',
                },
            })
        }

        let contact = await Contact.findOne({user: id, address: entry.address})
        if(contact){
            return res.status(422).json({
                errors: {
                    address: 'already exists',
                },
            })
        }

        const newEntry = new Contact(entry)
        newEntry.user = userId

        return newEntry.save()
            .then(() => res.json(newEntry))
    })


    router.delete('/:id', auth.required, async (req, res, next) => {
        const {body: {entry}, payload: {id}} = req

        let contact = await Contact.findOne({user: id, _id: req.params.id})
        if(contact){
            contact.deleted = 0
            return contact.save().then(() => res.json({success: true}))
        }
        return res.status(404)
    })



    router.patch('/:id', auth.required, async (req, res, next) => {
        const {body, payload: {id}} = req
        const entry = body
        if (!entry.label) {
            return res.status(422).json({
                errors: {
                    label: 'is required',
                },
            })
        }

        if (!entry.address) {
            return res.status(422).json({
                errors: {
                    address: 'is required',
                },
            })
        }

        let validAddress
        try {
            validAddress = Nimiq.Address.fromUserFriendlyAddress(entry.address)
        } catch (e){

        }
        if(!validAddress){
            return res.status(422).json({
                errors: {
                    address: 'is not valid',
                },
            })
        }

        let contact = await Contact.findOne({user: id, _id: req.params.id})
        if(contact){
            contact.label = entry.label
            contact.address = entry.address
            return contact.save().then(() => res.json(contact.toJSON()))
        }
        return res.status(404).json({error: 'Not found'})
    })


    router.get('/', auth.required, async (req, res, next) => {
        const {body: {}, payload: {id}} = req
        let contacts = await Contact.find({user: id, deleted: 0})
        let results = []
        for (let address of contacts) {
            results.push(address.toJSON())
        }
        return res.json(results)
    })
    return router
}