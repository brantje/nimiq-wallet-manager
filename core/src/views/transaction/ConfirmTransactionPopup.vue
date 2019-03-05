<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">
                Enter your wallet pass phrase
            </h1>
        </div>
        <div class="nq-card-body">
            <input v-model="passPhrase" type="password" placeholder="••••••••">
        </div>
        <div class="nq-card-footer">
            <OkBtn v-if="passPhrase" :options="options" btn-color="green" @click="verifyPassPhrase">
                Confirm transaction
            </OkBtn>
            <CancelBtn :options="options" @click="handleDismiss()">
                Cancel
            </CancelBtn>
        </div>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js' // Include mixin
import OkBtn from 'components/dialog/Ok-btn.vue'
import CancelBtn from 'components/dialog/Cancel-btn.vue'
import {walletApi} from 'utils/api/wallet'
import {decrypt} from 'utils/encryption'
import {mapGetters} from 'vuex'
import store from 'store'
import {NETWORK_STATS_REQUEST} from 'store/actions/nimiq'


export default {
    components: {
        CancelBtn,
        OkBtn
    },
    mixins: [DialogMixin],
    data: function () {
        return {
            passPhrase: ''
        }
    },
    computed: mapGetters(['getNetworkStats']),

    created() {
        store.dispatch(NETWORK_STATS_REQUEST)
    },
    methods: {
        verifyPassPhrase: function () {
            walletApi.getPrivateKey(this.options.transaction.sendFrom.address).then(async (response) => {
                let privateKey
                let rawTx = this.options.transaction
                try {
                    privateKey = await decrypt(response.data.seed, this.passPhrase)
                } catch (e) {
                    this.$notify({
                        type: 'error',
                        title: 'Invalid pass phrase',
                    })
                    return
                }

                let height = store.state.nimiq.stats.height
                let buf = Nimiq.BufferUtils.fromHex(privateKey)
                let key = new Nimiq.PrivateKey(buf)
                let keyPair = Nimiq.KeyPair.derive(key)
                let wallet = new Nimiq.Wallet(keyPair)

                const extraData = Nimiq.BufferUtils.fromAscii(rawTx.extraData)

                const transaction = new Nimiq.ExtendedTransaction(
                    wallet.address,       // sender address
                    Nimiq.Account.Type.BASIC,   // and account type
                    Nimiq.Address.fromUserFriendlyAddress(rawTx.sendTo.address),
                    Nimiq.Account.Type.BASIC,   // <- recipient -^
                    Nimiq.Policy.coinsToLunas(rawTx.value),
                    0,                          // fee
                    height,
                    Nimiq.Transaction.Flag.NONE,
                    extraData                   // the message
                )

                // sign transaction with the key pair of our wallet
                const signature = Nimiq.Signature.create(
                    keyPair.privateKey,
                    keyPair.publicKey,
                    transaction.serializeContent()
                )
                const proof = Nimiq.SignatureProof.singleSig(keyPair.publicKey, signature)
                transaction.proof = proof.serialize()
                if(transaction.sender.toUserFriendlyAddress() !== this.options.transaction.sendFrom.address){
                    this.$notify({
                        type: 'error',
                        title: 'A fatal error occured ',
                    })
                }
                this.proceed(transaction)

            })
        },
        handleDismiss() {
            this.cancel() // included in DialogMixin
        }
    }
}
</script>
<style scoped>

</style>