const state = { menuShown: false }

const getters = {
    getMenuShown: state => state.menuShown,
}

const actions = {
    toggleMenu: ({commit, dispatch}) => {
        commit('toggleMenu')
    },
    hideMenu: ({commit, dispatch}) => {
        commit('hideMenu')
    },
}

const mutations = {
    'toggleMenu': (state) => {
        state.menuShown = !state.menuShown
    },
    'hideMenu': (state) => {
        state.menuShown = false
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}