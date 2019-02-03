'use strict'

import Vue from 'vue'
// import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/main.scss'
import "./scss/icon-addon.scss";
import "./scss/fonts.scss";
import "./scss/layout.scss";
import "./scss/loading.scss";
import "./scss/inputs.scss";
import "./scss/dashboard.scss";
import "./scss/scrollbar.scss";
import "./scss/transaction.scss";
import App from './components/App.vue'

new Vue({
    el: 'app',
    created: function () {
        console.log('created')
    },
    components: {App},
    methods: {}
})