import { PEER_LIST_REQUEST, NETWORK_STATS_REQUEST } from 'store/actions/nimiq'


const actions = {
    SOCKET_connect(state) {
        state.connect = true;
    },
    CONSENSUS_ESTABLISHED({ commit, dispatch}) {
        dispatch(NETWORK_STATS_REQUEST)
    },
    SOCKET_BLOCKCHAIN_HEAD_CHANGED({ commit, dispatch}) {
        dispatch(NETWORK_STATS_REQUEST)
    },
    SOCKET_MEMPOOL_TRANSACTION_ADDED(state, message) {
        console.log('tx added:', message)
    },
};

const mutations = {}

const state = {
    connect: false,
    messages: [],
};

export default {
    state,
    mutations,
    actions
};