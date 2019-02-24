import Vue from "vue";
import Router from "vue-router";
import LeftSidebar from "layout/LeftSidebar.vue"
import SettingsSidebar from "layout/SettingsSidebar.vue"
import Dashboard from "views/Dashboard.vue";
import Login from "views/user/Login.vue";
import Register from "views/user/Register.vue";
import WalletDetail from "views/wallet/Detail.vue";
import AddWallet from "views/wallet/Add.vue";
import WalletList from "views/wallet/List.vue";
import ContactList from "views/contacts/List.vue";
import SendTransaction from 'views/transaction/Send.vue';
import SettingsDisplay from 'views/settings/SettingsDisplay.vue'
import AccountSettings from 'views/settings/user/Account.vue'
import AccountSecuritySettings from 'views/settings/user/Security.vue'
import AccountSessionSettings from 'views/settings/user/Sessions.vue'
import store from "store";
import Meta from 'vue-meta';

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
            // component: Dashboard,
            components: {
                leftSidebar: LeftSidebar,
                default: Dashboard
            },
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/wallet/add",
            name: "AddWallet",
            // component: AddWallet,
            components: {
                leftSidebar: LeftSidebar,
                default: AddWallet
            },
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/wallet/:address",
            name: "WalletDetail",
            // component: WalletDetail,
            components: {
                leftSidebar: LeftSidebar,
                default: WalletDetail
            },
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/wallets",
            name: "WalletList",
            // component: WalletList,
            components: {
                leftSidebar: LeftSidebar,
                default: WalletList
            },
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/new-transaction",
            name: "SendTransaction",
            // component: SendTransaction,
            components: {
                leftSidebar: LeftSidebar,
                default: SendTransaction
            },
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/contacts",
            name: "ContactList",
            // component: ContactList,
            components: {
                leftSidebar: LeftSidebar,
                default: ContactList
            },
            beforeEnter: ifAuthenticated,
        },
        {
            path: "/settings/user",
            name: "Settings",
            // component: ContactList,
            components: {
                leftSidebar: SettingsSidebar,
                default: SettingsDisplay
            },
            children: [
                {
                    name: 'account',
                    path: 'account',
                    components: {
                        default: AccountSettings,
                    }
                },
                {
                    name: 'security',
                    path: 'security',
                    components: {
                        default: AccountSecuritySettings,
                    }
                },
                {
                    name: 'sessions',
                    path: 'sessions',
                    components: {
                        default: AccountSessionSettings
                    }
                },
            ],
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