const express = require('express')
const router = express.Router()
const {check, validationResult, body} = require('express-validator/check')
const passport = require('passport')

module.exports = function (NimiqHelper) {
    router.get('/', function (req, res, next) {
        res.clearCookie('accessToken')
        return res.redirect('/login')
    })

    return router
}

