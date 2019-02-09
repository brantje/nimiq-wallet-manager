import Vue from 'vue'
import Vuex from 'vuex'
import user from 'store/modules/user'
import auth from 'store/modules/auth'
import nimiq from 'store/modules/nimiq'
import wallet from 'store/modules/wallet'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        user,
        auth,
        nimiq,
        wallet
    },
    strict: debug,
})