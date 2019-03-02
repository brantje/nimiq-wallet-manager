import axios from 'axios'

const userApi = {
    login: ({username, password, sessionDuration, endAllPreviousSessions, sessionIpLocked}) => {
        return axios({
            url: '/api/v1/core/user/login', data: {
                username: username,
                password: password,
                sessionDuration: sessionDuration,
                endAllPreviousSessions: endAllPreviousSessions,
                sessionIpLocked: sessionIpLocked
            },
            method: 'POST'
        })
    },
    register: (newUser) => {
        return axios({url: '/api/v1/core/user/register', data: newUser, method: 'POST'})
    },
    current: () => {
        return axios({url: '/api/v1/core/user/current', method: 'GET'})
    },
    changePassword: (data) => {
        return axios({url: '/api/v1/core/user/password', method: 'PUT', data: data})
    },
    getSessions: () => {
        return axios({url: '/api/v1/core/user/sessions', method: 'GET'})
    },
    destroySession: (session) => {
        return axios({url: '/api/v1/core/user/sessions/'+ session._id, method: 'DELETE'})
    },
    twofactor: {
        getSecret: () => {
            return axios({url: '/api/v1/core/user/two-factor/generate-secret', method: 'GET'})
        },
        verifySecret: (otp) => {
            return axios({url: '/api/v1/core/user/two-factor/setup-verify', method: 'POST', data: {otp: otp}})
        },
        verifyOtp: (otp) => {
            return axios({url: '/api/v1/core/user/two-factor/verify-totp', method: 'POST', data: {otp: otp}})
        },
        disableTFA: (otp) => {
            return axios({url: '/api/v1/core/user/two-factor', method: 'DELETE'})
        }
    }
}

export {userApi}