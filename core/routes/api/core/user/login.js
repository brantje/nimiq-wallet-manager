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
                let {sessionDuration, endAllPreviousSessions, sessionIpLocked} = req.body;

                if (err) {
                    return next(err);
                }

                if (passportUser) {
                    const today = new Date();
                    const user = passportUser;
                    sessionDuration = sessionDuration || 86500;
                    const expirationDate = new Date(today.getTime() + sessionDuration * 1000);
                    if (endAllPreviousSessions) {
                        await Session.updateMany({
                            user: user._id,
                            deleted: 0
                        }, {
                            $set: {
                                deleted: 1
                            }
                        }, {
                            multi: true
                        })
                    }
                    let session = new Session();
                    session.ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                    session.user = user._id;
                    session.expires = expirationDate;
                    session.sessionIpLocked = sessionIpLocked || false;
                    await session.save();

                    return res.status(200).json(user.toAuthJSON({
                        session: session._id
                    }));
                }

                res.status(401).json({errors: 'Invalid username or password'});
            })(req, res, next);
        });
    return router;
};