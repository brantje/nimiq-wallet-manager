const jwt = require('express-jwt');
const JsonWebToken = require('jsonwebtoken');

const getTokenFromHeaders = (req) => {
    const {headers: {authorization}} = req;

    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const getBearerToken = function(header, callback) {
    if(header) {
        token = header.split(" ");
        if(token.length == 2) {
            return callback(null, token[1]);
        } else {
            return callback("Malformed bearer token", null);
        }
    } else {
        return callback("Missing authorization header", null);
    }
};

const validateToken = function(request, response, next) {
    getBearerToken(request.headers["authorization"], function(error, token) {
        if(error) {
            return response.status(401).send({ "success": false, "message": error });
        }
        JsonWebToken.verify(token, process.env.JWT_SECRET, function(error, decodedToken) {
            if(error) {
                return response.status(401).send({ "success": false, "error": "Invalid authorization token" });
            }
            // console.log(decodedToken)
            if(decodedToken.authorized) {
                request.payload = decodedToken;
                next();
            } else {
                if(decodedToken.hasOwnProperty('two_factor_enabled') && decodedToken['two_factor_enabled']) {
                    return response.status(401).send({"success": false, "error": "2FA is required"});
                } else {
                    request.payload = decodedToken;
                    next();
                }
            }
        });
    });
};


const auth = {
    required: validateToken,
    optional: jwt({
        secret: process.env.JWT_SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
    "2fa-login": jwt({
        secret: process.env.JWT_SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: true,
    }),
};

module.exports = auth;