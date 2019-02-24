const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../../auth');
const Users = mongoose.model('Users');
const TwoFactor = require('node-2fa');
const JsonWebToken = require('jsonwebtoken');

module.exports = function (NimiqHelper) {

    /**
     * @api {get} /users/generate-secret Generate 2FA secret
     * @apiDescription Generate a secret for 2A authentication
     * @apiVersion 1.0.0
     * @apiGroup UserGroup
     * @apiName generate2FaSecret
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
 *        "success": true
 *     }
     */
    router.get("/generate-secret", auth.required, async function (req, res) {
        const {payload: {id, username}} = req;
        let data = TwoFactor.generateSecret({
            name: 'Nimiq Wallet Manager'
        });

        const user = await Users.findOne({_id: id});

        if (user) {
            user.settings =  {...user.settings, tmp_two_factor_secret: data.secret};
            user.save().then(() => {
                res.send({
                    "secret": data
                });
            })
        }
        // return res.status(404);
    });

    /**
     * @api {post} /users/verify-totp Verify 2FA secret
     * @apiDescription Verify a secret for 2A authentication
     * @apiVersion 1.0.0
     * @apiGroup UserGroup
     * @apiName verify2FaSecret
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
 *        "success": true
 *     }
     */
    router.post("/verify-totp", auth['2fa-login'], async function (req, res) {
        const {payload: {id}} = req;
        const user = await Users.findById(id);
        getBearerToken(req.headers["authorization"], function (error, token) {
            if (error) {
                return res.status(401).send({"success": false, "message": error});
            }
            if (!req.body.otp) {
                return res.status(401).send({"success": false, "message": "An `otp` is required"});
            }
            JsonWebToken.verify(token, process.env.JWT_SECRET, function (error, decodedToken) {
                if (TwoFactor.verifyToken(user['2fa_secret'], req.body.otp)) {
                    decodedToken.authorized = true;
                    var token = JsonWebToken.sign(decodedToken, process.env.JWT_SECRET, {});
                    return res.send({"token": token});
                } else {
                    return res.status(401).send({"success": false, "message": "Invalid one-time password"});
                }
            });
        });
    });


    /**
     * @api {post} /users/save-totp Save 2FA secret
     * @apiDescription Save a secret for 2A authentication
     * @apiVersion 1.0.0
     * @apiGroup UserGroup
     * @apiName save2FaSecret
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
 *        "success": true
 *     }
     */
    router.post("/setup-verify", auth.required, async function (req, res) {
        const {payload: {username, id}, body} = req;

        const user = await Users.findOne({_id: id});
        if(user) {
            let secret = user.settings.tmp_two_factor_secret || user.settings.two_factor_secret
            if (TwoFactor.verifyToken(secret, body.otp)) {
                let settings = {...user.settings};
                settings.two_factor_secret = secret;
                settings.two_factor_enabled = true;
                delete settings.tmp_two_factor_secret;
                user.settings = settings;
                await user.save();
                return res.json({success: true});
            }
        }

        return res.status(422).send({success: false});
    });


    /**
     * @api {post} /users/destoy-otp Destroy 2FA secret
     * @apiDescription This disabled 2FA during login
     * @apiVersion 1.0.0
     * @apiGroup UserGroup
     * @apiName destroy2FaSecret
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
 *        "success": true
 *     }
     */
    router.post("/destoy-otp", auth.required, async function (req, res) {
        const {payload: {username, id}, body: {data}} = req;
        let user = await Users.findById(id);
        user['two_factor_enabled'] = false;
        user['2fa_secret'] = '';
        await user.save();

        return res.json({success: true});
    });

    return router;
};