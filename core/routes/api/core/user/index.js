const express = require('express')
const auth = require('../../../auth')
const mongoose = require('mongoose')
const Users = mongoose.model('Users')

const router = express.Router()


module.exports = function (NimiqHelper) {
    router.use('/login', require('./login')(NimiqHelper))
    router.use('/register', require('./register')(NimiqHelper))
    router.use('/password', require('./password')(NimiqHelper))
    router.use('/two-factor', require('./two-factor')(NimiqHelper))
    router.use('/sessions', require('./session')(NimiqHelper))

    router.get('/current', auth.required, async (req, res, next) => {
        const {payload: {id}} = req

        return Users.findById(id)
                .then(async (user) => {
                    if (!user) {
                        return res.sendStatus(400)
                    }
                    // let settings = await Config.getAll(id);
                    let userJson = user.toJSON()
                    return res.json(userJson)
                })
    })
    return router
}