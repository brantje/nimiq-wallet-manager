import Vue from "vue";
import Router from "vue-router";
import Dashboard from "views/Dashboard.vue";
import Login from "views/user/Login.vue";
import Register from "views/user/Register.vue";
import store from "store";

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