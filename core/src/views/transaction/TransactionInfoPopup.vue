<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">
                Transaction info
            </h1>
        </div>
        <div class="nq-card-body nq-style">
            <div class="tx-info-head">
                <div class="nq-label">
                    Hash
                </div>
                <div class="nq-text-s">
                    {{ tx.hash }}
                </div>
            </div>
            <div class="tx-info-detail">
                <div>
                    <label class="nq-label">
                        Sender
                    </label>
                    <span class="nq-text-s">
                        <Address :address="tx.fromAddress"></Address>
                    </span>
                </div>
                <div>
                    <label class="nq-label">
                        Recipient
                    </label>

                    <span class="nq-text-s">
                        <Address :address="tx.toAddress"></Address>
                    </span>
                </div>
                <div>
                    <label class="nq-label">
                        Date
                    </label>

                    <span class="nq-text-s">
                        {{ tx.timestamp | formatDate('long') }}
                    </span>
                </div>
                <div>
                    <label class="nq-label">
                        Value
                    </label>

                    <span class="nq-text-s">
                        {{ tx.value | lunaToCoins }} NIM
                    </span>
                </div>
                <div>
                    <label class="nq-label">
                        Fee
                    </label>

                    <span class="nq-text-s">
                        {{ tx.fee | lunaToCoins(5) }} NIM
                    </span>
                </div>
                <div>
                    <label class="nq-label">
                        Confirmations
                    </label>

                    <span class="nq-text-s">
                        {{ tx.confirmations }} (#{{ tx.blockNumber }})
                    </span>
                </div>
                <div v-if="tx.data">
                    <label class="nq-label">
                        Message
                    </label>

                    <span class="nq-text-s">
                        {{ tx.data }}
                    </span>
                </div>
            </div>
        </div>
        <div class="nq-card-footer">
            <CancelBtn :options="options" @click="handleDismiss()">
                Close
            </CancelBtn>
        </div>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js' // Include mixin
import CancelBtn from 'components/dialog/Cancel-btn.vue'
import Address from 'components/Address.vue'
import {walletApi} from 'utils/api/wallet'
import {decrypt} from 'utils/encryption'
import {mapGetters} from 'vuex'
import store from 'store'
import {NETWORK_STATS_REQUEST} from 'store/actions/nimiq'
import {getAddressLabel} from 'filters/getAddressLabel'
import {formatDate} from 'filters/formatDate'
import {lunaToCoins} from '../../filters/lunaToCoins'


export default {
    filters:{
        getAddressLabel,
        formatDate,
        lunaToCoins
    },
    components: {
        CancelBtn,
        Address
    },
    mixins: [DialogMixin],
    data: function () {
        return {
            tx: {}
        }
    },
    created() {
        this.tx = this.options.transaction
    },
    methods: {

        handleDismiss() {
            this.cancel() // included in DialogMixin
        }
    }
}
</script>
<style scoped>
    .tx-info-head {
        margin-bottom: 15px;
    }

    .tx-info-detail {
        display: flex;
        flex-direction: column;
    }
    .tx-info-detail > div {
        display: flex;
    }
    .tx-info-detail > div label{
        width: 150px;
    }
</style>