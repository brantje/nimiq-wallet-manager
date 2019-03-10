import {PEER_LIST_REQUEST, NETWORK_STATS_REQUEST, MEMPOOL_ADD_TRANSACTION, MEMPOOL_CLEAR, NETWORK_MEMPOOL_REQUEST} from 'store/actions/nimiq'
import {WALLET_LIST_TRANSACTIONS_REQUEST, WALLET_LIST_REQUEST} from 'store/actions/wallet'


const actions = {
    SOCKET_connect(state) {
        state.connect = true
    },
    SOCKET_CONSENSUS_ESTABLISHED({dispatch}) {
        dispatch(NETWORK_STATS_REQUEST)
    },
    SOCKET_BLOCKCHAIN_HEAD_CHANGED({dispatch}, {refresh}) {
        dispatch(NETWORK_STATS_REQUEST)
        dispatch(NETWORK_MEMPOOL_REQUEST)
        if(refresh) {
            dispatch(WALLET_LIST_TRANSACTIONS_REQUEST)
            dispatch(WALLET_LIST_REQUEST)
        }
    },
    SOCKET_MEMPOOL_TRANSACTION_ADDED({dispatch}, tx) {
        dispatch(MEMPOOL_ADD_TRANSACTION, tx)
    },
    SOCKET_MEMPOOL_TRANSACTIONS_READY({dispatch}) {
        dispatch(MEMPOOL_CLEAR)
    },
    SOCKET_NETWORK_PEERS_CHANGED({dispatch}) {
        dispatch(PEER_LIST_REQUEST)
    }
}

const mutations = {}

const state = {
    connect: false,
    messages: [],
}

export default {
    state,
    mutations,
    actions
}