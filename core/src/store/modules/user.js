
import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import {userApi} from 'utils/api'
import axios from 'axios'

import Vue from 'vue'
import { AUTH_LOGOUT } from 'store/actions/auth'

const state = { status: '', profile: {} }

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.username,
}

const actions = {
    [USER_REQUEST]: ({commit, dispatch}) => {
        commit(USER_REQUEST)
        userApi.current()
            .then(resp => {
                commit(USER_SUCCESS, resp)
            })
            .catch(resp => {
                commit(USER_ERROR)
                // if resp is unauthorized, logout, to
                dispatch(AUTH_LOGOUT)
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
    [USER_ERROR]: (state) => {
        state.status = 'error'
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