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

    export default {
        name: "Dashboard",
        metaInfo: {
            title: 'Dashboard'
        },
        computed: mapGetters(['getWalletTransactions']),
        created() {
            store.dispatch(WALLET_LIST_TRANSACTIONS_REQUEST)
        },
        data() {
            return {
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
