<template>
    <div class="hello">
        <div class="dashboard">
            <NetworkWidget />
            <WalletWidget />
            <SeedWidget />
        </div>

        <div class="action-card nq-card">
            <div>
                <RouterLink to="new-transaction">
                    Send
                </RouterLink>
            </div>
            <div>
                Receive
            </div>
            <div>
                <RouterLink to="/contacts">
                    Contacts
                </RouterLink>
            </div>
            <div>
                <RouterLink to="/wallet/add">
                    Add wallet
                </RouterLink>
            </div>
        </div>

        <div class="recent-tx nq-card">
            <div class="nq-card-header">
                <h1 class="nq-h1">
                    Recent transactions
                </h1>
            </div>
            <div class="nq-card-body">
                <TransactionList :transactions="getOurTransactions(getMempool)" />
                <span v-if="getWalletTransactions.length === 0">No transactions</span>
                <TransactionList :transactions="getWalletTransactions" />
            </div>
        </div>
    </div>
</template>

<script>
import NetworkWidget from 'components/dashboard/NetworkWidget.vue'
import WalletWidget from 'components/dashboard/WalletWidget.vue'
import SeedWidget from 'components/dashboard/SeedWidget.vue'
import TransactionList from 'components/transaction/TransactionList.vue'
import {mapState, mapGetters} from 'vuex'
import store from 'store'
import {WALLET_LIST_TRANSACTIONS_REQUEST} from 'store/actions/wallet'
import {NETWORK_MEMPOOL_REQUEST} from 'store/actions/nimiq'

export default {
    name: 'Dashboard',
    metaInfo: {
        title: 'Dashboard'
    },
    components: {
        NetworkWidget,
        WalletWidget,
        SeedWidget,
        TransactionList
    },
    computed: mapGetters(['getWalletTransactions', 'getMempool']),
    created() {
        store.dispatch(WALLET_LIST_TRANSACTIONS_REQUEST)
        store.dispatch(NETWORK_MEMPOOL_REQUEST)
    },
    methods: {
        getOurTransactions: function (transactions) {
            if (store.state.wallet.wallets && store.state.wallet.wallets.length > 0) {
                let ourWallets = store.state.wallet.wallets.slice().map(function (w) {
                    return w.address
                })
                if(ourWallets.length > 0 && transactions.length > 0) {
                    return transactions.slice().filter(function (item) {
                        return ( ourWallets.indexOf(item.fromAddress) > -1 || ourWallets.indexOf(item.toAddress) > -1) ? item : false
                    })
                }
            }
        },
    }
}
</script>
<style scoped>
    .action-card {
        display: flex;
        flex-wrap: wrap;
        max-width: none;
    }

    .action-card div {
        padding: 5px 15px;
    }
</style>