<template>
    <div class="x-transactions-list">
        <div class="x-transaction" v-for="transaction in sortTransactions(transactions)" v-if="transactions.length > 0"
             @click="showTxInfo(transaction)">
            <div class="timestamp">
                <span v-if="transaction.timestamp">
                    {{ transaction.timestamp | formatDate}}
                </span>
                <span v-else>Pending...</span>
            </div>
            <div class="x-identicon">
                <Identicon :address="transaction.fromAddress" size="64"></Identicon>
            </div>
            <div class="x-label" sender="">
                {{ transaction.fromAddress | getAddressLabel }}
            </div>
            <div class="x-arrow">
                <i class="nq-icon arrow-right"></i>
            </div>
            <div class="x-identicon">
                <Identicon :address="transaction.toAddress" size="64"></Identicon>
            </div>
            <div class="x-label" recipient="">
                {{ transaction.toAddress | getAddressLabel }}
            </div>
            <div class="x-amount"
                 :class="{'incoming': (isOurs(transaction.toAddress)  && !isOurs(transaction.fromAddress)),
                                'outgoing': (!isOurs(transaction.toAddress) && isOurs(transaction.fromAddress))
                }">
                <div class="x-currency-nim " style="display: inline;">
                    <span v-if="isOurs(transaction.toAddress) && !isOurs(transaction.fromAddress)">+</span>
                    <span v-if="!isOurs(transaction.toAddress) && isOurs(transaction.fromAddress)">-</span>
                    {{ transaction.value | lunaToCoins}} NIM
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
    import store from 'store'
    import {lunaToCoins} from 'filters/lunaToCoins'
    import {formatDate} from 'filters/formatDate'
    import Identicon from "components/Identicon.vue"
    import {getAddressLabel} from 'filters/getAddressLabel';

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
            },
            sortTransactions: function (wallets) {
                if (wallets) {
                    return wallets.slice().sort((a, b) => {
                        if (!a.hasOwnProperty('timestamp')) {
                            return -1
                        }
                        if (!b.hasOwnProperty('timestamp')) {
                            return 1
                        }
                        let orderA = a.timestamp;
                        let orderB = b.timestamp;
                        return orderB - orderA
                    })
                }
            },
            showTxInfo: function (transaction) {
                this.$dialog.alert('', {
                    view: 'TransactionInfoPopup',
                    transaction: transaction,
                    customClass: 'big-dialog'
                })
            }
        },
        computed: mapGetters(['getWallets']),
        created() {
            store.dispatch(WALLET_LIST_REQUEST)
        },
        filters: {
            lunaToCoins,
            formatDate,
            getAddressLabel
        },
        components: {
            Identicon
        }

    }
</script>

<style scoped>
    .x-transaction {
        cursor: pointer;
    }

    .nq-icon.arrow-right {
        display: block !important;
        margin: 0 auto;
    }
</style>