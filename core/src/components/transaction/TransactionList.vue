<template>
    <div class="x-transactions-list">
        <div class="x-transaction" v-for="transaction in transactions">
            <div class="timestamp">
                {{ transaction.timestamp | formatDate}}
            </div>
            <div class="x-identicon">
                <div class="identicon" address="tx.fromAddress" size="64" ng-if="tx.fromAddress"></div>
            </div>
            <div class="x-label" sender="">
                {{ transaction.fromAddress }}
            </div>
            <div class="x-arrow">
                <i class="mdi mdi-arrow-forward mdi-2x"></i>
            </div>
            <div class="x-identicon">
                <div class="identicon" address="tx.toAddress" size="64" ng-if="tx.toAddress"></div>
            </div>
            <div class="x-label" recipient="">
                {{ transaction.toAddress }}
            </div>
            <div class="x-amount"
                 v-bind:class="{'incoming': (isOurs(transaction.toAddress)  && !isOurs(transaction.fromAddress)),
                                'outgoing': (!isOurs(transaction.toAddress) && isOurs(transaction.fromAddress))
                }">
                <div class="x-currency-nim " style="display: inline;">
                    <span v-if="isOurs(transaction.toAddress) && !isOurs(transaction.fromAddress)">+</span>
                    <span v-if="!isOurs(transaction.toAddress) && isOurs(transaction.fromAddress)">-</span>
                    {{ transaction.value | lunaToCoins}}
                </div>
            </div>
        </div>
        <!--<div class="x-transaction">-->
        <!--<div class="timestamp">-->
        <!--23 Aug-->

        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.fromAddress" size="64" ng-if="tx.fromAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" sender="">-->
        <!--NQ55 V8DC EFJK H2H8 H1G6 8Q35 3YTN Y2XG D6FK-->
        <!--</div>-->
        <!--<div class="x-arrow">-->
        <!--<i class="mdi mdi-arrow-forward mdi-2x"></i>-->
        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.toAddress" size="64" ng-if="tx.toAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" recipient="">-->
        <!--NQ44 MD1D 08GP H289 Q790 DMXP XQ92 E61K CJU3-->
        <!--</div>-->
        <!--<div class="x-amount outgoing">-->
        <!--<div class="x-currency-nim " style="display: inline;">-->
        <!-- - -->
        <!--123.5 NIM-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="x-transaction">-->
        <!--<div class="timestamp">-->
        <!--23 Aug-->

        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.fromAddress" size="64" ng-if="tx.fromAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" sender="">-->
        <!--NQ55 V8DC EFJK H2H8 H1G6 8Q35 3YTN Y2XG D6FK-->
        <!--</div>-->
        <!--<div class="x-arrow">-->
        <!--<i class="mdi mdi-arrow-forward mdi-2x"></i>-->
        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.toAddress" size="64" ng-if="tx.toAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" recipient="">-->
        <!--NQ44 MD1D 08GP H289 Q790 DMXP XQ92 E61K CJU3-->
        <!--</div>-->
        <!--<div class="x-amount outgoing">-->
        <!--<div class="x-currency-nim " style="display: inline;">-->
        <!-- - -->
        <!--123.5 NIM-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="x-transaction">-->
        <!--<div class="timestamp">-->
        <!--23 Aug-->

        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.fromAddress" size="64" ng-if="tx.fromAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" sender="">-->
        <!--NQ55 V8DC EFJK H2H8 H1G6 8Q35 3YTN Y2XG D6FK-->
        <!--</div>-->
        <!--<div class="x-arrow">-->
        <!--<i class="mdi mdi-arrow-forward mdi-2x"></i>-->
        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.toAddress" size="64" ng-if="tx.toAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" recipient="">-->
        <!--NQ44 MD1D 08GP H289 Q790 DMXP XQ92 E61K CJU3-->
        <!--</div>-->
        <!--<div class="x-amount outgoing">-->
        <!--<div class="x-currency-nim " style="display: inline;">-->
        <!-- - -->
        <!--123.5 NIM-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="x-transaction">-->
        <!--<div class="timestamp">-->
        <!--23 Aug-->

        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.fromAddress" size="64" ng-if="tx.fromAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" sender="">-->
        <!--NQ55 V8DC EFJK H2H8 H1G6 8Q35 3YTN Y2XG D6FK-->
        <!--</div>-->
        <!--<div class="x-arrow">-->
        <!--<i class="mdi mdi-arrow-forward mdi-2x"></i>-->
        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.toAddress" size="64" ng-if="tx.toAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" recipient="">-->
        <!--NQ44 MD1D 08GP H289 Q790 DMXP XQ92 E61K CJU3-->
        <!--</div>-->
        <!--<div class="x-amount outgoing">-->
        <!--<div class="x-currency-nim " style="display: inline;">-->
        <!-- - -->
        <!--123.5 NIM-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="x-transaction">-->
        <!--<div class="timestamp">-->
        <!--23 Aug-->

        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.fromAddress" size="64" ng-if="tx.fromAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" sender="">-->
        <!--NQ55 V8DC EFJK H2H8 H1G6 8Q35 3YTN Y2XG D6FK-->
        <!--</div>-->
        <!--<div class="x-arrow">-->
        <!--<i class="mdi mdi-arrow-forward mdi-2x"></i>-->
        <!--</div>-->
        <!--<div class="x-identicon">-->
        <!--<div class="identicon" address="tx.toAddress" size="64" ng-if="tx.toAddress"></div>-->
        <!--</div>-->
        <!--<div class="x-label" recipient="">-->
        <!--NQ44 MD1D 08GP H289 Q790 DMXP XQ92 E61K CJU3-->
        <!--</div>-->
        <!--<div class="x-amount outgoing">-->
        <!--<div class="x-currency-nim " style="display: inline;">-->
        <!-- - -->
        <!--123.5 NIM-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
    import store from 'store'
    import {lunaToCoins} from 'filters/lunaToCoins'
    import {formatDate} from 'filters/formatDate'

    export default {
        name: 'TransactionList',
        props: ['transactions'],
        methods: {
            isOurs: function (address) {
                if (this.getWallets) {
                    let ourWallets = this.getWallets.map(function (w) {
                        return w.address;
                    });
                    return ourWallets.indexOf(address) >= 0;
                }
            }
        },
        computed: mapGetters(['getWallets']),
        created() {
            store.dispatch(WALLET_LIST_REQUEST)
        },
        filters: {
            lunaToCoins,
            formatDate
        },

    }
</script>

<style scoped>

</style>