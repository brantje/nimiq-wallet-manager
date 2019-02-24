const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../../auth');
const Users = mongoose.model('Users');
const Session = mongoose.model('Sessions');
const crypto = require('crypto');
const JsonWebToken = require('jsonwebtoken');
const {check, validationResult, body} = require('express-validator/check');


module.exports = function (NimiqHelper) {
    router.post('/', auth.optional,
        [
            body('username').not().isEmpty().withMessage('Invalid username'),
            body('password').not().isEmpty().withMessage('Invalid username'),
        ],
        async (req, res, next) => {
            return passport.authenticate('local', {session: false}, async (err, passportUser, info) => {
                if (err) {
                    return next(err);
                }

                if (passportUser) {
                    const today = new Date();
                    const expirationDate = new Date(today);
                    expirationDate.setDate(today.getDate() + 1);

                    const user = passportUser;
                    let session = new Session();
                    session.ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                    session.user = user._id;
                    session.expires = expirationDate;
                    await session.save()

                    // user.token = passportUser.generateJWT();

                    // res.cookie('accessToken', user.token, { expires: new Date(Date.now() + (24 * 3600000) ) });
                    return res.status(200).json(user.toAuthJSON({
                        session: session._id
                    }));
                }

                res.status(401).json( {errors: 'Invalid username or password'});
            })(req, res, next);
        });
    return router;
};