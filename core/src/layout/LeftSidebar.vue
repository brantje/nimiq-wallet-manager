<template>
    <div class="sidenav left scrollbar-themed" :class="{'shown': getMenuShown }">
        <div v-if="getWallets.length === 0" class="nq-card">
            <div class="nq-card-body">
                No wallets yet! <br>
                Why not <RouterLink to="/wallet/add">
                    add
                </RouterLink> one?
            </div>
        </div>
        <div v-for="wallet in sortWallets(getWallets)" :key="wallet.address" class="nq-card">
            <div class="nq-card-body" @click="loadWallet(wallet.address)">
                <div class="identicon">
                    <Identicon :address="wallet.address" size="64" class="img-responsive" />
                </div>
                <div class="account-data">
                    <span class="nq-label">{{ wallet.label }} </span>
                    <div class="nq-text-s">
                        {{ wallet.address }}
                    </div>
                    <div class="clearfix" />
                </div>
                <div class="nq-h3 pull-right">
                    {{ wallet.balance | lunaToCoins }} NIM
                </div>
                <div class="clearfix" />
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import store from 'store'
import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
import {lunaToCoins} from 'filters/lunaToCoins'
import Identicon from 'components/Identicon.vue'

export default {
    name: 'LeftSidebar',
    filters: {
        lunaToCoins
    },
    components: {
        Identicon
    },
    data() {
        return {}
    },
    computed: mapGetters(['getWallets', 'getMenuShown']),
    created() {
        store.dispatch(WALLET_LIST_REQUEST)
    },
    methods: {
        loadWallet: function (address) {
            this.$router.push('/wallet/' + address)
        },
        sortWallets: function (wallets) {
            return wallets.slice().sort((a, b) => {
                let orderA = a.order
                let orderB = b.order
                return orderA - orderB
            })
        }
    }
}
</script>

<style scoped>
    .nq-card{
        animation: slideInDown 0.5s;
        cursor: pointer;
    }
</style>
