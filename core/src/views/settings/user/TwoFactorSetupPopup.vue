<template>
    <div class="nq-card">
        <div class="nq-card-body nq-style">
            <div class="pull-left margin-right-2">
                <qrcode-vue :value="twoFactorSecret.uri" :size="128" level="Q"></qrcode-vue>
            </div>
            <div class="pull-left">
                <label>Enter the verification code</label>
                <input type="text" v-model="otp" />
                <button class="nq-button-s" @click="verifyOtp">Verify</button>
            </div>
        </div>
        <div class="clearfix"></div>
        <div class="nq-card-footer">
            <cancel-btn @click="handleDismiss()" :options="options">Close</cancel-btn>
        </div>
    </div>
</template>

<script>
    import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'; // Include mixin
    import OkBtn from 'components/dialog/Ok-btn.vue';
    import CancelBtn from 'components/dialog/Cancel-btn.vue';
    import {userApi} from "utils/api/user"
    import {mapGetters} from 'vuex'
    import store from 'store'
    import QrcodeVue from 'qrcode.vue';


    export default {
        mixins: [DialogMixin],
        data: function () {
            return {
                twoFactorSecret: {
                    uri: ''
                },
                otp: ''
            }
        },
        created() {
            userApi.twofactor.getSecret().then((r) => {
                this.twoFactorSecret.uri = decodeURIComponent(r.data.secret.uri)
            })
        },
        methods: {
            verifyOtp: function() {
                let p = this;
                userApi.twofactor.verifySecret(this.otp).then(function () {
                    p.$notify({
                        title: 'OTP Verified',
                    });
                    p.otp = ''
                    p.proceed()
                }).catch(function (){
                    p.$notify({
                        type: 'error',
                        title: 'Invalid OTP',
                    });
                })
            },
            handleDismiss() {
                this.cancel(); // included in DialogMixin
            }
        },
        filters:{},
        components: {
            CancelBtn,
            OkBtn,
            QrcodeVue
        }
    };
</script>
<style scoped>

</style>