const express = require('express');
const router = express.Router();

module.exports = function (NimiqHelper) {
    router.get('/', async (req, res, next) => {
        let block;
        try {
            if (req.query.hasOwnProperty('hash')) {
                block = await NimiqHelper.getBlockByHash(req.query.hash);
            }

            if (req.query.hasOwnProperty('height')) {
                block = await NimiqHelper.getBlockByNumber(req.query.height);
            }

        } catch (e) {
            res.status(422);
            return res.json({'error': e.message});
        }

        if (block === null) {
            res.status(404);
            return res.json({'error': 'Block not found'});
        }

        return res.json(block);
    });
    return router;
}

