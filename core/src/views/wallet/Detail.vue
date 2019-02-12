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
        computed: mapGetters(['getActiveWallet']),
        created() {
            store.dispatch(GET_WALLET_REQUEST, this.$route.params.address)
        },
        data() {
            return {
                loading: true
            };
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
    .loading-container{
        margin: 0 auto;
    }
    .loading {
        background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cdefs%3E%3CclipPath%20id%3D%22hexClip%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22M16%204.29h32l16%2027.71l-16%2027.71h-32l-16%20-27.71zM20.62%2012.29h22.76l11.38%2019.71l-11.38%2019.71h-22.76l-11.38%20-19.71z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M16%204.29h32l16%2027.71l-16%2027.71h-32l-16%20-27.71zM20.62%2012.29h22.76l11.38%2019.71l-11.38%2019.71h-22.76l-11.38%20-19.71z%22%20fill%3D%22white%22%20opacity%3D%220.2%22%2F%3E%3Cg%20clip-path%3D%22url(%23hexClip)%22%3E%3Ccircle%20id%3D%22circle%22%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2216%22%20fill%3D%22none%22%20stroke-width%3D%2232%22%20stroke%3D%22%231f2348%22%20stroke-dasharray%3D%22101%20101%22%20transform%3D%22rotate(-120%2032%2032)%22%2F%3E%3Canimate%20href%3D%22%23circle%22%20id%3D%22circleanimate%22%20attributeName%3D%22stroke-dashoffset%22%20from%3D%220%22%20to%3D%22-202%22%20dur%3D%223s%22%20repeatCount%3D%22indefinite%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
        height: 50px;
        width: 50px;
    }

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