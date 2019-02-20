<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">Transaction info</h1>
        </div>
        <div class="nq-card-body nq-style">
            <div class="tx-info-head">
                <div class="nq-label">Hash</div>
                <div class="nq-text-s">{{ tx.hash }}</div>
            </div>
            <div class="tx-info-detail">
                <div>
                    <label class="nq-label">
                        Sender
                    </label>
                    <span class="nq-text-s pull-right">
                    {{ tx.fromAddress | getAddressLabel}}
                </span>
                </div>
                <div>
                    <label class="nq-label">
                        Recipient
                    </label>

                    <span class="nq-text-s pull-right">
                    {{ tx.toAddress | getAddressLabel}}
                </span>
                </div>
                <div>
                    <label class="nq-label">
                        Date
                    </label>

                    <span class="nq-text-s pull-right">
                    {{ tx.timestamp | formatDate('long') }}
                </span>
                </div>
                <div>
                    <label class="nq-label">
                        Value
                    </label>

                    <span class="nq-text-s pull-right">
                    {{ tx.value }}
                </span>
                </div>
                <div>
                    <label class="nq-label">
                        Fee
                    </label>

                    <span class="nq-text-s pull-right">
                    {{ tx.fee }}
                </span>
                </div>
                <div>
                    <label class="nq-label">
                        Confirmations
                    </label>

                    <span class="nq-text-s pull-right">
                    {{ tx.confirmations }} (#{{ tx.blockNumber }})
                </span>
                </div>
                <div v-if="tx.data">
                    <label class="nq-label">
                        Message
                    </label>

                    <span class="nq-text-s pull-right">
                    {{ tx.data }}
                </span>
                </div>
            </div>
        </div>
        <div class="nq-card-footer">
            <cancel-btn @click="handleDismiss()" :options="options">Close</cancel-btn>
        </div>
    </div>
</template>

<script>
    import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'; // Include mixin
    import OkBtn from 'components/dialog/Ok-btn.vue';
    import CancelBtn from 'components/dialog/Cancel-btn.vue';
    import {walletApi} from "utils/api/wallet";
    import {decrypt} from "utils/encryption"
    import {mapGetters} from 'vuex'
    import store from 'store'
    import {NETWORK_STATS_REQUEST} from 'store/actions/nimiq'
    import {getAddressLabel} from 'filters/getAddressLabel';
    import {formatDate} from 'filters/formatDate';


    export default {
        mixins: [DialogMixin],
        data: function () {
            return {
                tx: {}
            }
        },
        created() {
            this.tx = this.options.transaction;
        },
        methods: {

            handleDismiss() {
                this.cancel(); // included in DialogMixin
            }
        },
        filters:{
            getAddressLabel,
            formatDate
        },
        components: {
            CancelBtn,
            OkBtn
        }
    };
</script>
<style scoped>
    .tx-info-head {
        margin-bottom: 15px;
    }

    .tx-info-detail {
        display: flex;
        flex-direction: column;
    }
</style>