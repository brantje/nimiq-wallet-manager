import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT, AUTH_REGISTER, AUTH_REGISTER_ERROR, AUTH_REGISTER_SUCCESS } from 'store/actions/auth'
import { USER_REQUEST } from 'store/actions/user'
import {userApi} from 'utils/api/user'
import axios from 'axios'
const state = { token: localStorage.getItem('user-token') || '', status: '', hasLoadedOnce: false }

const getters = {
    isAuthenticated: (state) => {
        return state.token !== 'undefined' && state.token !== '';

    },
    authStatus: state => state.status,
}

const actions = {
    [AUTH_REQUEST]: ({commit, dispatch}, user) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST)

            userApi.login(user)
                .then(resp => {
                    localStorage.setItem('user-token', resp.data.token)
                    axios.defaults.headers.common['Authorization'] = 'Token ' + resp.data.token
                    commit(AUTH_SUCCESS, resp.data)
                    dispatch(USER_REQUEST)
                    resolve(resp)
                })
                .catch(err => {
                    commit(AUTH_ERROR, err);
                    localStorage.removeItem('user-token');
                    reject(AUTH_ERROR);
                })
        })
    },
    [AUTH_REGISTER]: ({commit, dispatch}, user) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_REGISTER)

            userApi.register(user)
                .then(resp => {
                    // Here set the header of your ajax library to the token value.
                    // example with axios
                    commit(AUTH_REGISTER_SUCCESS, resp)
                    // dispatch(USER_REQUEST)
                    resolve(resp)
                })
                .catch(err => {
                    commit(AUTH_REGISTER_ERROR, err);
                    reject(err);
                })
        })
    },
    [AUTH_LOGOUT]: ({commit, dispatch}) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_LOGOUT)
            localStorage.removeItem('user-token')
            resolve()
        })
    }
}

const mutations = {
    [AUTH_REQUEST]: (state) => {
        state.status = 'loading'
    },
    [AUTH_SUCCESS]: (state, resp) => {
        state.status = 'success'
        state.token = resp.token
        state.hasLoadedOnce = true
    },
    [AUTH_ERROR]: (state) => {
        state.status = 'error'
        state.hasLoadedOnce = true
    },
    [AUTH_LOGOUT]: (state) => {
        state.token = ''
    },
    [AUTH_REGISTER]: (state) => {
        state.token = ''
    },
    [AUTH_REGISTER_ERROR]: (state) => {
        state.token = ''
    },
    [AUTH_REGISTER_SUCCESS]: (state) => {
        state.token = ''
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}