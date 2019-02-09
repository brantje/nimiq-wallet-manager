<template>
    <div>
        <div class="nq-card walletDetail">
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
            title: 'Dashboard'
        },
        computed: mapGetters(['getActiveWallet']),
        created() {
            store.dispatch(GET_WALLET_REQUEST, this.$route.params.address)
        },
        data() {
            return {};
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
        width: calc(100% - 30px);
        max-width: none;
        padding: 20px 15px;

    }
    .walletDetail{
        display: flex;

    }
    @media screen and (max-width: 768px){
        .walletDetail .identicon {
            width: 90vw !important;
        }
    }
    .walletDetail .identicon{
        width: 20vw;
    }
    .x-transactions-list {
    }
</style>