<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">Wallet information</h1>
        </div>
        <div class="nq-card-body">
            <div class="body-row">
                <span class="nq-label">Total balance</span>
                <span class="nq-text-s pull-right">{{ totalBalance | lunaToCoins}} NIM</span>
            </div>
            <div class="body-row">
                <span class="nq-label">Number of wallets</span>
                <span class="nq-text-s pull-right">{{ getWallets.length }}</span>
            </div>
            <div class="body-row">
                <span class="nq-label">Avg balance</span>
                <span class="nq-text-s pull-right">{{ avgBalance | lunaToCoins }} NIM</span>
            </div>

        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
    import {lunaToCoins} from 'filters/lunaToCoins'
    export default {
        name: "WalletWidget",
        computed: mapGetters(['getWallets']),
        created() {
            store.dispatch(WALLET_LIST_REQUEST)
        },
        data() {
            return {
                totalBalance: 0,
                avgBalance: 0
            };
        },
        filters: {
            lunaToCoins
        },
        watch: {
            getWallets: function (wallets) {
                if(wallets) {
                    this.totalBalance = wallets.reduce((e) => {
                        if(e && e.hasOwnProperty('balance')) {
                            return e.balance
                        }
                    });
                    this.avgBalance = (this.totalBalance / wallets.length);
                }

            }
        },
        methods: {}
    };
</script>

<style scoped>
</style>