import {
    WALLET_LIST_ERROR, WALLET_LIST_REQUEST, WALLET_LIST_SUCCESS,
    WALLET_LIST_TRANSACTIONS_ERROR, WALLET_LIST_TRANSACTIONS_REQUEST, WALLET_LIST_TRANSACTIONS_SUCCESS,
    GET_WALLET_SUCCESS, GET_WALLET_REQUEST, GET_WALLET_ERROR,
    ADD_WALLET_ERROR, ADD_WALLET_REQUEST, ADD_WALLET_SUCCESS
} from '../actions/wallet'
import {walletApi} from 'utils/api/wallet'

import Vue from 'vue'
import {AUTH_LOGOUT} from 'store/actions/auth'

const state = {
    wallets: [],
    transactions: [],
    activeWallet: {}
}

const getters = {
    getWallets: state => state.wallets,
    getWalletTransactions: state => state.transactions,
    getActiveWallet: state => state.activeWallet
}

const inflight = {
    WALLET_LIST_REQUEST: false,
    WALLET_LIST_TRANSACTIONS_REQUEST: false,
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
    },
    [WALLET_LIST_TRANSACTIONS_REQUEST]: ({commit, dispatch}) => {
        if (inflight[WALLET_LIST_TRANSACTIONS_REQUEST]) {
            return;
        }
        inflight[WALLET_LIST_TRANSACTIONS_REQUEST] = true;
        commit(WALLET_LIST_TRANSACTIONS_REQUEST)
        walletApi.recentTransactions()
            .then(resp => {
                inflight[WALLET_LIST_TRANSACTIONS_REQUEST] = false;
                commit(WALLET_LIST_TRANSACTIONS_SUCCESS, resp)
            })
            .catch(resp => {
                inflight[WALLET_LIST_TRANSACTIONS_REQUEST] = false;
                commit(WALLET_LIST_TRANSACTIONS_ERROR)
                // if resp is unauthorized, logout, to
                console.log(resp)
                // dispatch(AUTH_LOGOUT)
            })
    },

    [GET_WALLET_REQUEST]: ({commit, dispatch}, address) => {
        if (inflight[GET_WALLET_REQUEST]) {
            return;
        }
        inflight[GET_WALLET_REQUEST] = true;
        commit(GET_WALLET_REQUEST)
        walletApi.get(address)
            .then(resp => {
                inflight[GET_WALLET_REQUEST] = false;
                commit(GET_WALLET_SUCCESS, resp)
            })
            .catch(resp => {
                inflight[GET_WALLET_REQUEST] = false;
                commit(GET_WALLET_ERROR)
                // if resp is unauthorized, logout, to
                console.log(resp)
                // dispatch(AUTH_LOGOUT)
            })
    },
    [ADD_WALLET_REQUEST]: ({commit, dispatch}, wallet) => {
        return new Promise((resolve, reject) => {
            commit(ADD_WALLET_REQUEST)
            walletApi.create(wallet)
                .then(resp => {
                    commit(ADD_WALLET_SUCCESS, resp.data)
                    resolve(resp)
                })
                .catch(err => {
                    commit(ADD_WALLET_ERROR, err)
                    reject(ADD_WALLET_ERROR, err)
                })
        })
    },
}

const mutations = {
    [WALLET_LIST_REQUEST]: (state) => {

    },
    [WALLET_LIST_SUCCESS]: (state, resp) => {
        state.wallets = resp.data
    },
    [WALLET_LIST_ERROR]: () => {

    },
    [WALLET_LIST_TRANSACTIONS_REQUEST]: (state) => {

    },
    [WALLET_LIST_TRANSACTIONS_SUCCESS]: (state, resp) => {
        state.transactions = resp.data
    },
    [WALLET_LIST_TRANSACTIONS_ERROR]: () => {

    },
    [GET_WALLET_REQUEST]: (state) => {

    },
    [GET_WALLET_SUCCESS]: (state, resp) => {
        state.activeWallet = resp.data
    },
    [GET_WALLET_ERROR]: () => {

    },
    [ADD_WALLET_REQUEST]: (state) => {

    },
    [ADD_WALLET_SUCCESS]: (state, resp) => {

    },
    [ADD_WALLET_ERROR]: () => {

    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}