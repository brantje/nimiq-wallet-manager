<template>
    <div class="nq-card walletDetail">
        <h3 class="nq-label">Contact list</h3>
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

    export default {
        name: "Contacts",
        metaInfo: {
            title: 'Contacts'
        },
//        computed: mapGetters(['getWalletTransactions']),
        created() {

        },
        data() {
            return {};
        },
        components: {}
    };
</script>
<style scoped>
    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
        padding: 20px 15px;
    }
</style>