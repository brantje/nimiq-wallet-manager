<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">Enter your wallet pass phrase</h1>
        </div>
        <div class="nq-card-body">
            <input type="password" v-model="passPhrase" placeholder="••••••••" />
        </div>
        <div class="nq-card-footer">
            <ok-btn @click="verifyPassPhrase" :options="options" btnColor="green" v-if="passPhrase">Confirm transaction</ok-btn>
            <cancel-btn @click="handleDismiss()" :options="options">Cancel</cancel-btn>
        </div>
    </div>
</template>

<script>
    import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'; // Include mixin
    import OkBtn from 'components/dialog/Ok-btn.vue';
    import CancelBtn from 'components/dialog/Cancel-btn.vue';
    import {walletApi} from "utils/api/wallet";

    export default {
        mixins: [DialogMixin],
        data: function () {
            return {
                passPhrase: ''
            }
        },
        computed: {

        },
        created() {

        },
        methods: {
            verifyPassPhrase: function () {
                console.log(this.options.wallet)
                walletApi.getPrivateKey(this.options.wallet).then(() => {

                });
                // this.proceed(contact.address);
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