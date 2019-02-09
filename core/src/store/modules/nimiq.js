import {
    NETWORK_MEMPOOL_ERROR, NETWORK_MEMPOOL_REQUEST, NETWORK_MEMPOOL_SUCCESS,
    NETWORK_STATS_ERROR, NETWORK_STATS_REQUEST, NETWORK_STATS_SUCCESS,
    PEER_LIST_ERROR, PEER_LIST_REQUEST, PEER_LIST_SUCCESS
} from '../actions/nimiq'
import {nimiqApi} from 'utils/api/nimiq'

import Vue from 'vue'
import {AUTH_LOGOUT} from 'store/actions/auth'

const state = {
    mempool: [],
    peerList: [],
    stats: {
       network:{

       }
    }
}

const getters = {
    getMempool: state => state.mempool,
    getPeerList: state => state.peerList,
    getNetworkStats: state => state.stats
}

const inflight = {
    NETWORK_MEMPOOL_REQUEST: false,
    NETWORK_STATS_REQUEST: false,
    PEER_LIST_REQUEST: false,
}

const actions = {
    [NETWORK_MEMPOOL_REQUEST]: ({commit, dispatch}) => {
        if (inflight[NETWORK_MEMPOOL_REQUEST]) {
            return;
        }
        inflight[NETWORK_MEMPOOL_REQUEST] = true;
        commit(NETWORK_MEMPOOL_REQUEST)
        nimiqApi.getMempool()
            .then(resp => {
                inflight[NETWORK_MEMPOOL_REQUEST] = false;
                commit(NETWORK_MEMPOOL_SUCCESS, resp)
            })
            .catch(resp => {
                inflight[NETWORK_MEMPOOL_REQUEST] = false;
                commit(NETWORK_MEMPOOL_ERROR)
                // if resp is unauthorized, logout, to
                console.log(resp)
                // dispatch(AUTH_LOGOUT)
            })
    },
    [NETWORK_STATS_REQUEST]: ({commit, dispatch}) => {
        if (inflight[NETWORK_STATS_REQUEST]) {
            return;
        }
        commit(NETWORK_STATS_REQUEST)
        inflight[NETWORK_STATS_REQUEST] = true;
        nimiqApi.getNetworkStats()
            .then(resp => {
                inflight[NETWORK_STATS_REQUEST] = false;
                commit(NETWORK_STATS_SUCCESS, resp)
            })
            .catch(resp => {
                inflight[NETWORK_STATS_REQUEST] = false;
                commit(NETWORK_STATS_ERROR)
                // if resp is unauthorized, logout, to
                console.log(resp)
                // dispatch(AUTH_LOGOUT)
            })
    },
    [PEER_LIST_REQUEST]: ({commit, dispatch}) => {
        if (inflight[PEER_LIST_REQUEST]) {
            return;
        }
        inflight[PEER_LIST_REQUEST] = true;
        commit(NETWORK_STATS_REQUEST)
        nimiqApi.getStats()
            .then(resp => {
                inflight[PEER_LIST_REQUEST] = false;
                commit(PEER_LIST_SUCCESS, resp)
            })
            .catch(resp => {
                inflight[PEER_LIST_REQUEST] = false;
                commit(PEER_LIST_ERROR)
                // if resp is unauthorized, logout, to
                console.log(resp)
                // dispatch(AUTH_LOGOUT)
            })
    },
}

const mutations = {
    [NETWORK_MEMPOOL_REQUEST]: (state) => {

    },
    [NETWORK_MEMPOOL_SUCCESS]: (state, resp) => {
        state.mempool = resp.data
    },
    [NETWORK_MEMPOOL_ERROR]: () => {

    },
    [NETWORK_STATS_REQUEST]: (state) => {

    },
    [NETWORK_STATS_SUCCESS]: (state, resp) => {
        state.stats = resp.data
    },
    [NETWORK_STATS_ERROR]: () => {

    },
    [PEER_LIST_REQUEST]: (state) => {

    },
    [PEER_LIST_SUCCESS]: (state, resp) => {
        state.peerList = resp.data
    },
    [PEER_LIST_ERROR]: (state) => {

    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}