module.exports = function featurePolicy() {

    function buildHeaderString(policies) {
        let headerString = Object.keys(policies).map(policyName => {
            if (policies[policyName] === true || policies[policyName].length === 0) {
                return policyName
            }
            return `${policyName} ${policies[policyName].join(' ')}`
        }).join('; ')
        return headerString
    }

    return function featurePolicy(req, res, next) {
        const csp = {}
        /*eslint-disable */
        csp.NONE = '\'none\''
        csp.SELF = '\'self\''
        csp.INLINE = '\'unsafe-inline\''
        csp.EVAL = '\'unsafe-eval\''
        /*eslint-enable */
        const headers = {
            'Content-Security-Policy': {
                'default-src': [csp.SELF, process.env.DOMAIN_NAME],
                'connect-src': [csp.SELF, 'wss://' + process.env.DOMAIN_NAME, 'https://cdn.nimiq.com'],
                'script-src': [csp.SELF, csp.NONCE, csp.EVAL, 'https://cdn.nimiq.com', 'script src \'nonce-469261a9b2a9dd894a48\''],
                'style-src': [csp.SELF, '\'unsafe-inline\''],
                'font-src': [csp.SELF],
                'img-src': ['data:', csp.SELF],
                'worker-src': [csp.SELF, 'blob:'],
                'block-all-mixed-content': true
            },
            'Feature-Policy': {
                'geolocation': [csp.NONE],
                'midi': [csp.NONE],
                'microphone': [csp.NONE],
                'camera': [csp.NONE],
                'magnetometer': [csp.NONE],
                'gyroscope': [csp.NONE],
                'speaker': [csp.NONE],
                'fullscreen': [csp.SELF],
                'payment': [csp.NONE]
            },
            'Referrer-Policy': 'same-origin',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'X-Frame-Options': 'SAMEORIGIN',
            'Access-Control-Allow-Origin': process.env.DOMAIN_NAME,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE'
        }

        if (process.env.USE_SSL === 'true' && process.env.USE_HSTS === 'true') {
            let maxAge = process.env.HSTS_MAX_AGE || 15552000
            headers['Strict-Transport-Security'] = 'max-age=' + maxAge
        }

        for (let header in headers) {
            if (headers.hasOwnProperty(header)) {
                let config
                if (typeof headers[header] === 'string') {
                    config = headers[header]
                } else if (Array.isArray(headers[header])) {
                    config = headers[header].join('; ')
                } else {
                    config = buildHeaderString(headers[header])
                }
                res.setHeader(header, config)
            }
        }
        next()
    }
}
