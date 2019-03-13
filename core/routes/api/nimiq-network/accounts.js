const express = require('express')
const router = express.Router()
const Nimiq = require('@nimiq/core')
const auth = require('../../auth')

module.exports = function (NimiqHelper) {
    router.get('/:address', auth.required, async (req, res, next) => {
        try {
            const account = await NimiqHelper.getAccount(req.params.address)
            return res.json(account)
        } catch (e) {
            res.status(422)
            return res.json({'error': e.message})

        }
    })
    return router
}
