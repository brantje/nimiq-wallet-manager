const express = require('express');
const router = express.Router();

module.exports = function (NimiqHelper) {
    router.get('/', async (req, res, next) => {
        let transaction;
        try {
            transaction = await NimiqHelper.getTransactionByHash(req.query.hash);
        } catch (e){
            res.status(422);
            return res.json({'error': e.message});
        }

        if(transaction === null){
            res.status(404);
            return res.json({'error': 'Transaction not found'});
        }

        return res.json(transaction);
    });
    return router
}

