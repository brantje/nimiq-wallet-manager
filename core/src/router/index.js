import Vue from "vue";
import Router from "vue-router";
import Dashboard from "views/Dashboard.vue";
import Login from "views/user/Login.vue";
import Register from "views/user/Register.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: Dashboard
        },
        {
            path: "/login",
            name: "Login",
            component: Login
        },
        {
            path: "/register",
            name: "Register",
            component: Register
        }
    ]
});