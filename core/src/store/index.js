import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from 'store/modules/user'
import auth from 'store/modules/auth'
import nimiq from 'store/modules/nimiq'
import wallet from 'store/modules/wallet'
import contact from 'store/modules/contact'
import socket from 'store/modules/socket.io'
import menu from 'store/modules/menu'
import appState from 'store/modules/appNetwork'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        user,
        auth,
        nimiq,
        wallet,
        contact,
        socket,
        menu,
        appState
    },
    plugins: [createPersistedState()],
    actions: {
        SOCKET_CONNECT: function () {
            console.log(34)
        },
        SOCKET_MESSAGE: function (state, message) {
            console.log(state, message)
        }
    },
    strict: debug,
})