<template>
    <div>
        <div class="nq-card walletDetail">
            <div class="loading" v-if="!getActiveWallet.address"></div>
            <div class="identicon">
                <Identicon :address="getActiveWallet.address" size="128" class="img-responsive"></Identicon>
            </div>
            <div class="col-xs-8">
                <h3>{{ getActiveWallet.label }}</h3>
                <h4>{{ getActiveWallet.address}}</h4>
                <div class="balance">
                    Balance:
                    <div class="amount">
                        {{ getActiveWallet.balance | lunaToCoins }} NIM
                    </div>
                </div>

            </div>
        </div>
        <div>
            <div class="nq-card">
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
                loading: false
            };
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
    .loading {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><clipPath id="hexClip"><path clip-rule="evenodd" d="M16 4.29h32l16 27.71l-16 27.71h-32l-16 -27.71zM20.62 12.29h22.76l11.38 19.71l-11.38 19.71h-22.76l-11.38 -19.71z"/></clipPath></defs><path fill-rule="evenodd" d="M16 4.29h32l16 27.71l-16 27.71h-32l-16 -27.71zM20.62 12.29h22.76l11.38 19.71l-11.38 19.71h-22.76l-11.38 -19.71z" fill="white" opacity="0.2"/><g clip-path="url(#hexClip)"><circle id="circle" cx="32" cy="32" r="16" fill="none" stroke-width="32" stroke="#1f2348" stroke-dasharray="101 101" transform="rotate(-120 32 32)"/><animate href="#circle" id="circleanimate" attributeName="stroke-dashoffset" from="0" to="-202" dur="3s" repeatCount="indefinite"/></g></svg>');
        height: 50px;
        width: 50px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
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