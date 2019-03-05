<template>
    <div class="nq-card">
        <div class="nq-card-body">
            <div class="Subhead">
                <h1 class="nq-h1">
                    Change password
                </h1>
            </div>
            <label>Old password</label>
            <input v-model="changePassword.old" type="password">

            <label>New password</label>
            <input v-model="changePassword.password" type="password" required="required">

            <label>Confirm password</label>
            <input v-model="changePassword.confirmPassword" type="password">


            <p>
                <button class="nq-button-s" type="submit" @click="updatePassword">
                    Update password
                </button>
            </p>
            <p class="text-small">
                Looking for two-factor authentication? You can find it in
                <RouterLink to="/settings/user/security">
                    Security
                </RouterLink>
                .
            </p>

            <!--<div>-->
            <!--<h2 class="Subhead-heading">Change username</h2>-->
            <!--</div>-->
            <!--<button class="nq-button-s">Change my username</button>-->
        </div>
    </div>
</template>

<script>
import {userApi} from '../../../utils/api/user'

export default {
    filters: {},
    data() {
        return {
            changePassword: {
                old: '',
                password: '',
                confirmPassword: ''
            }
        }
    },

    created() {

    },
    metaInfo: {
        title: 'Account'
    },
    methods: {
        updatePassword: function () {
            userApi.changePassword(this.changePassword).then(() => {
                this.$notify({
                    title: 'Password changed',
                })
                this.changePassword = {
                    old: '',
                    password: '',
                    confirmPassword: ''
                }
            }).catch((e) => {
                if (e.response.data.hasOwnProperty('error')) {
                    this.$notify({
                        type: 'error',
                        title: e.response.data.error,
                    })
                }
            })
        }
    },
}
</script>

<style scoped>
    input[type="password"] {
        text-align: left;
        margin-bottom: 10px;
    }
    .nq-card {
        margin: 2rem auto;
        /*max-width: none;*/
    }
</style>
