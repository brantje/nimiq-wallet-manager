const state = {hasNoNetwork: false}

const getters = {
    hasNoNetwork: state => state.hasNoNetwork,
}

const actions = {
    setAppOffline: ({commit, dispatch}) => {
        commit('setAppOffline')
    },
    setAppOnline: ({commit, dispatch}) => {
        commit('setAppOnline')
    },
}

const mutations = {
    'setAppOffline': (state) => {
        state.hasNoNetwork = true
    },
    'setAppOnline': (state) => {
        state.hasNoNetwork = false
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}