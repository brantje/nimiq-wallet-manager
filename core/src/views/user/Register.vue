<template>
    <div class="flex-container">
        <div class="content-container nq-style scrollbar-themed">

            <div class="centered-container">
                <div class="text-center">
                    <div class="logo"></div>
                    <h1>Nimiq Wallet Manager</h1>
                </div>
                <div class="nq-card">

                    <div class="form" v-if="!success">

                        <div class="errors nq-red-bg" v-if="errors.length > 0">
                            <div v-for="error in errors">
                                {{ error.msg }}
                            </div>
                        </div>
                        <h2 class="nq-h2">Register</h2>
                        <form method="post" @submit.prevent="register">
                            <div class="nq-label">Username:</div>
                            <input type="text" name="username" v-model="username">
                            <div class="nq-label">E-mail:</div>
                            <input type="text" name="email" v-model="email">
                            <div class="nq-label">Password:</div>
                            <input type="password" class="password" v-model="password">
                            <div class="nq-label">Repeat password:</div>
                            <input type="password" class="password" v-model="password_repeat">
                            <button class="nq-button-s">Register</button>
                        </form>
                        <router-link to="/login"><a>Already have an account? Login</a></router-link>
                    </div>

                    <div class="form" v-if="success">
                        Registration success, you can <a href="/login">login</a> now.
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {AUTH_REGISTER} from 'store/actions/auth'

    export default {
        name: "Login",
        metaInfo: {
            title: 'Register'
        },
        data() {
            return {
                success: false,
                username: '',
                email: '',
                password: '',
                password_repeat: '',
                errors: []
            };
        },
        methods: {
            register: function () {
                this.error = false;
                const newUser = {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    password_repeat: this.password_repeat
                };
                this.$store.dispatch(AUTH_REGISTER, newUser).then((r) => {
                    this.success = true;
                }).catch((e) => {
                    console.error(e.response.data);
                    if (e.response.data.hasOwnProperty('errors')) {
                        this.errors = e.response.data.errors
                    }
                })
            }
        },
        components: {}
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