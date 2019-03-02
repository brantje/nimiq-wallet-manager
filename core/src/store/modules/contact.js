import {
    CONTACT_LIST_ERROR, CONTACT_LIST_REQUEST, CONTACT_LIST_SUCCESS
} from '../actions/contact'
import {contactApi} from 'utils/api/contact'

import Vue from 'vue'
import {AUTH_LOGOUT} from 'store/actions/auth'

const state = {
    contacts: [],
}

const getters = {
    getContacts: state => state.contacts,
}

const inflight = {
    CONTACT_LIST_REQUEST: false
}

const actions = {
    [CONTACT_LIST_REQUEST]: ({commit, dispatch}) => {
        if (inflight[CONTACT_LIST_REQUEST]) {
            return
        }
        inflight[CONTACT_LIST_REQUEST] = true
        commit(CONTACT_LIST_REQUEST)
        contactApi.list()
            .then(resp => {
                inflight[CONTACT_LIST_REQUEST] = false
                commit(CONTACT_LIST_SUCCESS, resp)
            })
            .catch(resp => {
                inflight[CONTACT_LIST_REQUEST] = false
                commit(CONTACT_LIST_ERROR)
                // if resp is unauthorized, logout, to
                // console.log(resp)
                // dispatch(AUTH_LOGOUT)
            })
    },
}

const mutations = {
    [CONTACT_LIST_REQUEST]: (state) => {

    },
    [CONTACT_LIST_SUCCESS]: (state, resp) => {
        state.contacts = resp.data
    },
    [CONTACT_LIST_ERROR]: () => {

    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}