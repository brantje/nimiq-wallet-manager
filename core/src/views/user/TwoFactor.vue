<template>
    <div class="flex-container">
        <div class="content-container nq-style scrollbar-themed">
            <div class="centered-container">
                <div class="text-center">
                    <div class="logo"></div>
                    <h1>Nimiq Wallet Manager</h1>
                </div>
                <div class="nq-card">
                    <div class="form">
                        <h2 class="nq-h2">
                            Enter OTP
                        </h2>
                        <form @submit.prevent="verifyOtp">
                            <input v-model="otp" type="text" name="username" required>
                            <button class="nq-button-s" @click="verifyOtp">
                                Verify
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {userApi} from 'utils/api/user'
import axios from 'axios'
import store from 'store'
import {USER_REQUEST} from 'store/actions/user'

export default {
    name: 'TwoFactor',
    metaInfo: {
        title: 'Authorize'
    },
    components: {},
    data() {
        return {
            otp: '',
        }
    },
    methods: {
        verifyOtp: function () {
            let p = this
            userApi.twofactor.verifyOtp(this.otp).then(function (r) {
                let token = r.data.token
                localStorage.setItem('user-token', token)

                axios.defaults.headers.common['Authorization'] = 'Token ' + token
                store.dispatch(USER_REQUEST)
                p.$router.push('/')
            }).catch(function (e) {
                console.log(e)
            })
        },
    }

}
</script>
<style scoped>
    .nq-card {
        width: 380px;
    }

    .centered-container {
        margin-top: 50px;
        height: auto;
    }
</style>
