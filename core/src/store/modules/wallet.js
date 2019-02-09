import {
    WALLET_LIST_ERROR, WALLET_LIST_REQUEST, WALLET_LIST_SUCCESS
} from '../actions/wallet'
import {walletApi} from 'utils/api/wallet'

import Vue from 'vue'
import {AUTH_LOGOUT} from 'store/actions/auth'

const state = {
    wallets: []
}

const getters = {
    getWallets: state => state.wallets
}

const inflight = {
    WALLET_LIST_REQUEST: false,
}

const actions = {
    [WALLET_LIST_REQUEST]: ({commit, dispatch}) => {
        if (inflight[WALLET_LIST_REQUEST]) {
            return;
        }
        inflight[WALLET_LIST_REQUEST] = true;
        commit(WALLET_LIST_REQUEST)
        walletApi.list()
            .then(resp => {
                inflight[WALLET_LIST_REQUEST] = false;
                commit(WALLET_LIST_SUCCESS, resp)
            })
            .catch(resp => {
                inflight[WALLET_LIST_REQUEST] = false;
                commit(WALLET_LIST_ERROR)
                // if resp is unauthorized, logout, to
                console.log(resp)
                // dispatch(AUTH_LOGOUT)
            })
    }
}

const mutations = {
    [WALLET_LIST_REQUEST]: (state) => {

    },
    [WALLET_LIST_SUCCESS]: (state, resp) => {
        state.wallets = resp.data
    },
    [WALLET_LIST_ERROR]: () => {

    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}