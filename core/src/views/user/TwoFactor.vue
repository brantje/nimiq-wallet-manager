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
                        <h2 class="nq-h2">Enter OTP</h2>
                        <div class="nq-red-bg errors" v-if="error">
                            Invalid username or password!
                        </div>
                        <form @submit.prevent="login">
                            <div class="nq-label">Username:</div>
                            <input v-model="username" type="text" name="username" required>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {AUTH_REQUEST, AUTH_ERROR} from 'store/actions/auth'

    export default {
        name: "Login",
        metaInfo: {
            title: 'Login'
        },
        data() {
            return {
                username: '',
                password: '',
                error: false
            };
        },
        components: {},
        methods: {
            login: function () {
                this.error = false;
                const {username, password} = this;
                this.$store.dispatch(AUTH_REQUEST, {username, password}).then(() => {
                    console.log('Logged in!');
                    this.$router.push('/')
                }).catch(e => {
                    console.log(e);
                    if(e === AUTH_ERROR){
                        this.error = true;
                    }
                })
            }
        }

    };
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
