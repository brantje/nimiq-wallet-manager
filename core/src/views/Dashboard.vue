<template>
    <div class="hello">
        <div class="dashboard">
            <NetworkWidget></NetworkWidget>
            <WalletWidget></WalletWidget>
            <SeedWidget></SeedWidget>
        </div>

        <div class="action-card nq-card">
            <div>
                <router-link to="new-transaction">Send</router-link>
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
                <TransactionList :transactions="getOurTransactions(getMempool)"></TransactionList>
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
        methods: {
            getOurTransactions: function (transactions) {
                if (store.state.wallet.wallets && store.state.wallet.wallets.length > 0) {
                    let ourWallets = store.state.wallet.wallets.slice().map(function (w) {
                        return w.address;
                    });
                    if(ourWallets.length > 0 && transactions.length > 0) {
                        return transactions.slice().filter(function (item) {
                            return ( ourWallets.indexOf(item.fromAddress) > -1 || ourWallets.indexOf(item.toAddress)) ? item : false
                        })
                    }
                }
            },
        },
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