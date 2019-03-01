const express = require('express')
const router = express.Router()

module.exports = function (NimiqHelper) {
    router.get('/:blockHeightOrHash', async (req, res, next) => {
        let block
        try {
            if (isNaN(req.params.blockHeightOrHash)) {
                block = await NimiqHelper.getBlockByHash(req.params.blockHeightOrHash)
                return res.json(block)
            }
            block = await NimiqHelper.getBlockByNumber(req.params.blockHeightOrHash)
            if (block === null) {
                res.status(404)
                return res.json({'error': 'Block not found'})
            }
            return res.json(block)

        } catch (e) {
            res.status(422)
            return res.json({'error': e.message})
        }

    })
    return router
}

