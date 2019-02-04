<template>
  <div class="hello">
    <div class="dashboard">
      <NetworkWidget></NetworkWidget>
      <WalletWidget></WalletWidget>
      <SeedWidget></SeedWidget>
    </div>

    <div class="recent-tx nq-card">
      <div class="nq-card-header">
        <h1 class="nq-h1">Recent transactions</h1>
      </div>
      <div class="nq-card-body">
        <TransactionList></TransactionList>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkWidget from "components/dashboard/NetworkWidget.vue";
import WalletWidget from "components/dashboard/WalletWidget.vue";
import SeedWidget from "components/dashboard/SeedWidget.vue";
import TransactionList from "components/transaction/TransactionList.vue";

export default {
  name: "Dashboard",
  data() {
    return {
      msg: "Welcome to Crypto Info"
    };
  },
  components: {
    NetworkWidget,
    WalletWidget,
    SeedWidget,
    TransactionList
  }
};
</script>
