'use strict' // eslint-disable-line

import Vue from "vue";
import "@nimiq/style/nimiq-style.min.css";
import "@nimiq/style/nimiq-style-icons.min.css";
import "assets/scss/main.scss";
import "assets/scss/icon-addon.scss";
import "assets/scss/fonts.scss";
import "assets/scss/layout.scss";
import "assets/scss/loading.scss";
import "assets/scss/inputs.scss";
import "assets/scss/dashboard.scss";
import "assets/scss/scrollbar.scss";
import "assets/scss/transaction.scss";
import store from './store';
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
