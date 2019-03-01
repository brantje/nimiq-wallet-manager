const express = require('express')
const router = express.Router()
const {check, validationResult, body} = require('express-validator/check')
const passport = require('passport')

module.exports = function (NimiqHelper) {
    router.get('/', function (req, res, next) {
        res.render('login', {title: 'Login - Nimiq Wallet Manager'})
    })

    router.post('/', [
        body('username').not().isEmpty().withMessage('Invalid username'),
        body('password').not().isEmpty().withMessage('Invalid username'),

    ],
    function (req, res, next) {
        return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
            if (err) {
                return next(err)
            }

            if (passportUser) {
                const user = passportUser
                user.token = passportUser.generateJWT()
                res.cookie('accessToken', user.token, { expires: new Date(Date.now() + (24 * 3600000) ) })
                return res.redirect('/')
            }

            res.render('login', {errors: 'Invalid username or password'})
        })(req, res, next)
    })

    return router
}

