import Vue from "vue";
import Router from "vue-router";
import Dashboard from "views/Dashboard.vue";
import Login from "views/user/Login.vue";
import Register from "views/user/Register.vue";
import WalletDetail from "views/wallet/Detail.vue";
import AddWallet from "views/wallet/Add.vue";
import ContactList from "views/contacts/List.vue";
import store from "store";
import Meta from 'vue-meta'

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next()
        return
    }
    next('/')
}

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next()
        return
    }
    next('/login')
}

Vue.use(Router);
Vue.use(Meta);
export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: Dashboard,
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/wallet/add",
            name: "AddWallet",
            component: AddWallet,
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/wallet/:address",
            name: "WalletDetail",
            component: WalletDetail,
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/contacts",
            name: "ContactList",
            component: ContactList,
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/login",
            name: "Login",
            component: Login,
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: "/register",
            name: "Register",
            component: Register,
            beforeEnter: ifNotAuthenticated,
        }
    ]
});