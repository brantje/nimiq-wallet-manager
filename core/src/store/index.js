import Vue from 'vue'
import Vuex from 'vuex'
import user from 'store/modules/user'
import auth from 'store/modules/auth'
import nimiq from 'store/modules/nimiq'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        user,
        auth,
        nimiq,
    },
    strict: debug,
})