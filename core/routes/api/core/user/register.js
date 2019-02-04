const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../../auth');
const Users = mongoose.model('Users');
const crypto = require('crypto');
const JsonWebToken = require('jsonwebtoken');
const {check, validationResult, body} = require('express-validator/check');


module.exports = function (NimiqHelper) {
    router.post('/', auth.optional,
        [
            // Validators
            body('username').not().isEmpty().withMessage('Invalid username'),
            body('username').custom(value => {
                return Users.findOne({username: value}).then(user => {
                    if (user) {
                        return Promise.reject('Username already in use');
                    }
                });
            }),
            body('email').isEmail().normalizeEmail().withMessage('Invalid e-mail'),
            body('email').custom(value => {
                return Users.findOne({email: value}).then(user => {
                    if (user) {
                        return Promise.reject('E-mail already in use');
                    }
                });
            }),
            body('password').isLength({min: 5}).custom((value, {req}) => {
                console.log(req.body.password, value)
                if (value !== req.param('password_repeat')) {
                    throw new Error('Password confirmation is incorrect');
                }
                return true;
            })
        ],
        async (req, res, next) => {
            let errors = validationResult(req).array();
            let success = false;
            if (errors.length === 0) {
                const finalUser = new Users({
                    username: req.param('username'),
                    email: req.param('email')
                });
                finalUser.setPassword(req.param('password'));
                await finalUser.save();
                success = true;
            }

            return res.json({success: success, errors: errors});
        });

    return router;
};