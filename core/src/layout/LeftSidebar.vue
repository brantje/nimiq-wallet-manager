<template>
    <div class="sidenav scrollbar-themed">
        <div class="nq-card" v-for="wallet in sortWallets(getWallets)">
            <div class="nq-card-body" @click="loadWallet(wallet.address)">
                <div class="identicon">
                    <Identicon :address="wallet.address" size="64" class="img-responsive"></Identicon>
                </div>
                <div class="account-data">
                    <span class="nq-label">{{ wallet.label }} </span>
                    <div class="nq-text-s">
                        {{ wallet.address }}
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="nq-h3 pull-right">{{ wallet.balance | lunaToCoins }} NIM</div>
                <div class="clearfix"></div>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
    import {lunaToCoins} from 'filters/lunaToCoins'
    import Identicon from "components/Identicon.vue"

    export default {
        computed: mapGetters(['getWallets']),
        created() {
            store.dispatch(WALLET_LIST_REQUEST)
        },
        data() {
            return {};
        },
        filters: {
            lunaToCoins
        },
        methods: {
            loadWallet: function (address) {
                this.$router.push('/wallet/' + address)
            },
            sortWallets: function (wallets) {
                return wallets.sort((a, b) => {
                    let orderA = a.order;
                    let orderB = b.order;
                    return orderA - orderB
                })
            }
        },
        components: {
            Identicon
        }
    };
</script>

<style scoped>
    .nq-card{
        animation: slideInDown 0.5s;
        cursor: pointer;
    }
</style>
