<template>
    <div class="nq-card">
        <div class="nq-card-body">
            <div class="Subhead">
                <h1 class="nq-h1">Change password</h1>
            </div>
            <label>Old password</label>
            <input type="password" v-model="changePassword.old">

            <label>New password</label>
            <input type="password" required="required" v-model="changePassword.password">

            <label>Confirm password</label>
            <input type="password" v-model="changePassword.confirmPassword">


            <p>
                <button class="nq-button-s" type="submit" @click="updatePassword">Update password</button>
            </p>
            <p class="text-small">
                Looking for two-factor authentication? You can find it in
                <router-link to="/settings/user/security">Security</router-link>
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
    import {userApi} from "../../../utils/api/user";

    export default {

        created() {

        },

        data() {
            return {
                changePassword: {
                    old: '',
                    password: '',
                    confirmPassword: ''
                }
            };
        },
        filters: {},
        methods: {
            updatePassword: function () {
                userApi.changePassword(this.changePassword).then(() => {
                    this.$notify({
                        title: 'Password changed',
                    });
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
                        });
                    }
                })
            }
        },
    };
</script>

<style scoped>
    input[type="password"] {
        text-align: left;
        margin-bottom: 10px;
    }
</style>
