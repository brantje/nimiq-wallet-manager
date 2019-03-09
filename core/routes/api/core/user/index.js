const express = require('express')
const auth = require('../../../auth')
const mongoose = require('mongoose')
const Users = mongoose.model('Users')
const RateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')

const loginLimiter = RateLimit({
    store: new RedisStore(),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: JSON.stringify({error: 'Too many requests, please try again later.'})

})

const createAccountLimiter = RateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 10 requests
    message: JSON.stringify({error: 'Too many accounts created from this IP, please try again after an hour'})
})
const router = express.Router()


module.exports = function (NimiqHelper) {
    router.use('/login', loginLimiter, require('./login')(NimiqHelper))
    router.use('/register', createAccountLimiter, require('./register')(NimiqHelper))
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