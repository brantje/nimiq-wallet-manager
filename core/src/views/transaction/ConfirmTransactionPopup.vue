<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">Enter your wallet pass phrase</h1>
        </div>
        <div class="nq-card-body">
            <input type="password" v-model="passPhrase" placeholder="••••••••"/>
        </div>
        <div class="nq-card-footer">
            <ok-btn @click="verifyPassPhrase" :options="options" btnColor="green" v-if="passPhrase">
                Confirm transaction
            </ok-btn>
            <cancel-btn @click="handleDismiss()" :options="options">Cancel</cancel-btn>
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


    export default {
        mixins: [DialogMixin],
        data: function () {
            return {
                passPhrase: ''
            }
        },
        computed: mapGetters(['getNetworkStats']),
        methods: {
            verifyPassPhrase: function () {
                walletApi.getPrivateKey(this.options.transaction.sendFrom.address).then(async (response) => {
                    let privateKey;
                    let {transaction} = this.options;
                    try {
                        privateKey = await decrypt(response.data.seed, this.passPhrase);
                    } catch (e) {
                        this.$notify({
                            type: 'error',
                            duration: -1,
                            title: 'Invalid pass phrase',
                        });
                        return;
                    }

                    let height = store.state.nimiq.stats.height;
                    let buf = Nimiq.BufferUtils.fromHex(privateKey);
                    let key = new Nimiq.PrivateKey(buf);
                    let keyPair = Nimiq.KeyPair.derive(key);
                    let wallet = new Nimiq.Wallet(keyPair);
                    const tx = wallet.createTransaction(
                        Nimiq.Address.fromUserFriendlyAddress(transaction.sendTo.address),
                        Nimiq.Policy.coinsToLunas(transaction.value),
                        transaction.fee,
                        height
                    );
                    key, keyPair, wallet = undefined;
                    this.proceed(tx);

                });
            },
            handleDismiss() {
                this.cancel(); // included in DialogMixin
            }
        },
        components: {
            CancelBtn,
            OkBtn
        }
    };
</script>
<style scoped>

</style>