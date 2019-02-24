
import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import {userApi} from 'utils/api/user'
import axios from 'axios'

import Vue from 'vue'
import { AUTH_LOGOUT } from 'store/actions/auth'

const state = { status: '', profile: {} }

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.username,
    getUserStatus: state => state.status
}

const actions = {
    [USER_REQUEST]: ({commit, dispatch}) => {
        commit(USER_REQUEST)
        userApi.current()
            .then(resp => {
                commit(USER_SUCCESS, resp)
            })
            .catch(e => {
                // if resp is unauthorized, logout, to
                if(e.response.status === 403) {
                    commit(USER_ERROR, 403)
                    dispatch(AUTH_LOGOUT)
                }
                if(e.response.status === 401){
                    commit(USER_ERROR, 401)
                }
            })
    },
}

const mutations = {
    [USER_REQUEST]: (state) => {
        state.status = 'loading'
    },
    [USER_SUCCESS]: (state, resp) => {
        state.status = 'success'
        Vue.set(state, 'profile', resp.data)
    },
    [USER_ERROR]: (state, err) => {
        state.status = err || 'error'
    },
    [AUTH_LOGOUT]: (state) => {
        state.profile = {}
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}