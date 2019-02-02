const express = require('express');
const router = express.Router();

module.exports = function (NimiqHelper) {
    router.get('/:hash', async (req, res, next) => {
        try {
            const transaction = await NimiqHelper.getTransactionByHash(req.params.hash);
            return res.json(transaction);
        } catch (e){
            res.status(422);
            return res.json({'error': e.message});
        }
    });
    return router
};

