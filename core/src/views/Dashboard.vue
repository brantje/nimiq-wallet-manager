<template>
    <div class="hello">
        <div class="dashboard">
            <NetworkWidget></NetworkWidget>
            <WalletWidget></WalletWidget>
            <SeedWidget></SeedWidget>
        </div>

        <div class="action-card nq-card">
            <div>
                Send
            </div>
            <div>
                Receive
            </div>
            <div>
                <router-link to="/contacts">Contacts</router-link>
            </div>
            <div>
                <router-link to="/wallet/add">Add wallet</router-link>
            </div>
        </div>

        <div class="recent-tx nq-card">
            <div class="nq-card-header">
                <h1 class="nq-h1">Recent transactions</h1>
            </div>
            <div class="nq-card-body">
                <TransactionList :transactions="getMempool"></TransactionList>
                <TransactionList :transactions="getWalletTransactions"></TransactionList>
            </div>
        </div>
    </div>
</template>

<script>
    import NetworkWidget from "components/dashboard/NetworkWidget.vue";
    import WalletWidget from "components/dashboard/WalletWidget.vue";
    import SeedWidget from "components/dashboard/SeedWidget.vue";
    import TransactionList from "components/transaction/TransactionList.vue";
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {WALLET_LIST_TRANSACTIONS_REQUEST} from 'store/actions/wallet'
    import {NETWORK_MEMPOOL_REQUEST} from 'store/actions/nimiq'

    export default {
        name: "Dashboard",
        metaInfo: {
            title: 'Dashboard'
        },
        computed: mapGetters(['getWalletTransactions', 'getMempool']),
        created() {
            store.dispatch(WALLET_LIST_TRANSACTIONS_REQUEST)
            store.dispatch(NETWORK_MEMPOOL_REQUEST)
        },
        data() {
            return {};
        },
        components: {
            NetworkWidget,
            WalletWidget,
            SeedWidget,
            TransactionList
        }
    };
</script>
<style scoped>
    .action-card {
        display: flex;
        max-width: none;
    }

    .action-card div {
        padding: 5px 15px;
    }
</style>