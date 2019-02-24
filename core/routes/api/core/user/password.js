const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../../auth');
const Users = mongoose.model('Users');
const crypto = require('crypto');
const JsonWebToken = require('jsonwebtoken');
const {check, validationResult, body} = require('express-validator/check');


module.exports = function (NimiqHelper) {
    router.put('/', auth.optional,
        auth.required,
        [
            body('old').not().isEmpty().withMessage('Old password is empty'),
            body('password').not().isEmpty().withMessage('Password is empty'),
            body('confirmPassword').not().isEmpty().withMessage('Rpeat password is empty'),
        ],
        async (req, res, next) => {
            const {payload: {id}, body} = req;
            let errors = validationResult(req).array();

            let password = body;

            let user = await Users.findOne({_id: id});
            if (!user.validatePassword(password.old)) {
                return res.status(422).json({
                    error: 'Invalid password'
                });
            }

            if(password.password !== password.confirmPassword){
                return res.status(422).json({
                    error: 'Passwords do not match',
                });
            }

            user.setPassword(password.password);
            user.save().then(() => res.json({success: true}));
        });
    return router;
};