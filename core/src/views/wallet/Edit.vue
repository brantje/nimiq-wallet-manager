<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">{{ messageTitle }}</h1>
        </div>
        <div class="nq-card-body">
            <div class="identicon">
                <Identicon :address="wallet.address" size="64" class="img-responsive"></Identicon>
            </div>
            <div class="account-data">
                <span class="nq-label"><input type="text" v-model="wallet.label" placeholder="Enter a name "> </span>
                <div class="nq-text-s">
                    <input type="text" v-model="wallet.address" disabled />
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="nq-card-footer">
            <ok-btn @click="saveWallet" :options="options" btnColor="green" v-if="wallet.label">Save</ok-btn>
            <cancel-btn @click="handleDismiss()" :options="options">Dismiss</cancel-btn>
        </div>
    </div>
</template>

<script>
    import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'; // Include mixin
    import OkBtn from 'components/dialog/Ok-btn.vue';
    import CancelBtn from 'components/dialog/Cancel-btn.vue';
    import Identicon from 'components/Identicon.vue'
    import {walletApi} from 'utils/api/wallet'

    export default {
        mixins: [DialogMixin],
        data: function () {
            return {

            }
        },
        computed: {
            wallet: function () {
                if (this.options.wallet) {
                    this.inputAddress = this.options.wallet.address
                    return Object.assign({}, this.options.wallet)
                }
                return {
                    _id: null,
                    label: '',
                    address: ''
                }
            }
        },

        methods: {
            saveWallet() {
                walletApi.update(this.wallet).then(() => {
                    this.$notify({
                        title: 'Wallet saved',
                    });
                    this.proceed(); // included in DialogMixin
                }).catch(() => {
                    this.$notify({
                        type: 'error',
                        title: 'Please fill in all fields',
                    });
                });
            },
            handleDismiss() {
                this.cancel(); // included in DialogMixin
            }
        },
        components: {
            CancelBtn,
            OkBtn,
            Identicon
        }
    };
</script>
