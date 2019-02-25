const mongoose = require('mongoose');
const Session = mongoose.model('Sessions');
const router = require('express').Router();
const auth = require('../../../auth');
const Nimiq = require('@nimiq/core');



module.exports = function (NimiqHelper) {
    router.delete('/:id', auth.required, async (req, res, next) => {
        const {body: {entry}, payload: {id}} = req;
        let session = await Session.findOne({user: id, _id: req.params.id, deleted: 0});
        if(session){
            session.deleted = 1;
            return session.save().then(() => res.json({success: true}));
        }
        return res.status(404);
    });


    router.get('/', auth.required, async (req, res, next) => {
        const {body: {}, payload: {id}} = req;
        let sessions = await Session.find({user: id, deleted: 0}).sort({lastActive: -1})
        let results = [];
        for (let session of sessions) {
            results.push(session.toJSON());
        }
        return res.json(results);
    });
    return router
};