const express = require('express');
const router = express.Router();
const Nimiq = require('@nimiq/core');

module.exports = function (NimiqHelper) {
    router.get('/', async (req, res, next) => {
        let account;
        try {
            account = await NimiqHelper.getAccount(req.query.address);
        } catch (e){
            res.status(422);
            return res.json({'error': e.message});
        }
        return res.json(account);
    });
    return router
}
