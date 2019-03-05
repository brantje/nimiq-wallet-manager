<template>
    <div>
        <div class="nq-card walletDetail">
            <div v-if="loading" class="loading-container">
                <div class="loading" />
            </div>
            <div v-if="!loading" class="identicon">
                <Identicon :address="getActiveWallet.address" size="128" class="img-responsive" />
            </div>
            <div v-if="!loading">
                <h3 class="nq-label">
                    {{ getActiveWallet.label }}
                </h3>
                <h4><Address :address="getActiveWallet.address" display-address="true" /></h4>
                <div class="nq-label">
                    Balance:
                </div>
                <div class="nq-h3">
                    {{ getActiveWallet.balance | lunaToCoins }} NIM
                </div>
            </div>
        </div>
        <div>
            <div v-if="!loading" class="nq-card">
                <TransactionList :transactions="getWalletTransactions(getMempool)" />
                <TransactionList :transactions="getActiveWallet.transactions" />
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import TransactionList from 'components/transaction/TransactionList.vue'
import Identicon from 'components/Identicon.vue'
import Address from 'components/Address.vue'
import {lunaToCoins} from 'filters/lunaToCoins'

import store from 'store'
import {GET_WALLET_REQUEST} from 'store/actions/wallet'

export default {
    name: 'Dashboard',
    metaInfo: {
        title: 'Wallet detail'
    },
    filters: {
        lunaToCoins
    },
    components: {
        TransactionList,
        Identicon,
        Address
    },
    data() {
        return {
            loading: true,
            wallet: ''
        }
    },
    computed: mapGetters(['getActiveWallet', 'getMempool']),
    watch: {
        getActiveWallet: function () {
            this.loading = false
        }
    },
    created() {
        store.dispatch(GET_WALLET_REQUEST, this.$route.params.address)
        this.sockets.subscribe('BLOCKCHAIN_HEAD_CHANGED', (data) => {
            if( this.$route.params.address) {
                store.dispatch(GET_WALLET_REQUEST, this.$route.params.address)
            }
        })
        this.wallet = this.$route.params.address
    },

    methods: {
        getWalletTransactions:  (transactions) => {
            if (store.state.wallet.wallets && store.state.wallet.wallets.length > 0) {
                return transactions.slice().filter(function (item) {
                    return ( store.state.wallet.activeWallet.address === item.fromAddress || store.state.wallet.activeWallet.address === item.toAddress) ? item : false
                })
            }
        },
    }
}
</script>

<style scoped>


    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
        padding: 20px 15px;

    }

    .walletDetail {
        display: flex;

    }

    @media screen and (max-width: 768px) {
        .walletDetail .identicon {
            width: 90vw !important;
        }
    }

    .walletDetail .identicon {
        width: 20vw;
    }

    .x-transactions-list {
    }
</style>