<template>
    <div>
        <div class="nq-card walletDetail">
            <div class="loading-container" v-if="loading">
                <div class="loading"></div>
            </div>
            <div class="identicon" v-if="!loading">
                <Identicon :address="getActiveWallet.address" size="128" class="img-responsive"></Identicon>
            </div>
            <div v-if="!loading">
                <h3 class="nq-label">{{ getActiveWallet.label }}</h3>
                <h4>{{ getActiveWallet.address}}</h4>
                <div class="nq-label">
                    Balance:
                </div>
                <div class="nq-h3">
                    {{ getActiveWallet.balance | lunaToCoins }} NIM
                </div>

            </div>
        </div>
        <div>
            <div class="nq-card" v-if="!loading">
                <TransactionList :transactions="getWalletTransactions(getMempool)"></TransactionList>
                <TransactionList :transactions="getActiveWallet.transactions"></TransactionList>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import TransactionList from "components/transaction/TransactionList.vue";
    import Identicon from "components/Identicon.vue"
    import {lunaToCoins} from 'filters/lunaToCoins'

    import store from 'store'
    import {GET_WALLET_REQUEST} from 'store/actions/wallet'

    export default {
        name: "Dashboard",
        metaInfo: {
            title: 'Wallet detail'
        },
        computed: mapGetters(['getActiveWallet', 'getMempool']),
        created() {
            store.dispatch(GET_WALLET_REQUEST, this.$route.params.address)
            this.wallet = this.$route.params.address
        },
        data() {
            return {
                loading: true,
                wallet: ''
            };
        },
        methods: {
            getWalletTransactions:  (transactions) => {
                if (store.state.wallet.wallets && store.state.wallet.wallets.length > 0) {
                    return transactions.slice().filter(function (item) {
                        return ( store.state.wallet.activeWallet.address === item.fromAddress || store.state.wallet.activeWallet.address === item.toAddress) ? item : false
                    })
                }
            },
        },
        watch: {
            getActiveWallet: function () {
                this.loading = false
            }
        },
        filters: {
            lunaToCoins
        },
        components: {
            TransactionList,
            Identicon
        }
    };
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