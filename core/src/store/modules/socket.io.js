import {PEER_LIST_REQUEST, NETWORK_STATS_REQUEST, MEMPOOL_ADD_TRANSACTION} from 'store/actions/nimiq'


const actions = {
    SOCKET_connect(state) {
        state.connect = true;
    },
    CONSENSUS_ESTABLISHED({commit, dispatch}) {
        dispatch(NETWORK_STATS_REQUEST)
    },
    SOCKET_BLOCKCHAIN_HEAD_CHANGED({dispatch}) {
        dispatch(NETWORK_STATS_REQUEST)
    },
    SOCKET_MEMPOOL_TRANSACTION_ADDED({dispatch}, tx) {
        dispatch(MEMPOOL_ADD_TRANSACTION, tx)
    },
    SOCKET_PEER_JOINED({dispatch}) {
        dispatch(PEER_LIST_REQUEST)
    },
    SOCKET_PEER_LEFT({dispatch}) {
        dispatch(PEER_LIST_REQUEST)
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