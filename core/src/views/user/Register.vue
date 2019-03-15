<template>
    <div class="flex-container">
        <div class="content-container nq-style scrollbar-themed">
            <div class="centered-container">
                <div class="text-center">
                    <div class="logo-inline">
                        <img src="/img/nimiq-logo.svg">
                    </div>
                    <h1>Nimiq Wallet Manager</h1>
                </div>
                <div class="nq-card">
                    <div v-if="!success" class="form">
                        <div v-if="errors.length > 0" class="errors nq-red-bg">
                            <div v-for="error in errors" :key="error.msg">
                                {{ error.msg }}
                            </div>
                        </div>
                        <h2 class="nq-h2">
                            Register
                        </h2>
                        <form method="post" @submit.prevent="register">
                            <div class="nq-label">
                                Username:
                            </div>
                            <input v-model="username" type="text" name="username">
                            <div class="nq-label">
                                E-mail:
                            </div>
                            <input v-model="email" type="text" name="email">
                            <div class="nq-label">
                                Password:
                            </div>
                            <input v-model="password" type="password" class="password">
                            <div class="nq-label">
                                Repeat password:
                            </div>
                            <input v-model="password_repeat" type="password" class="password">
                            <button class="nq-button-s">
                                Register
                            </button>
                        </form>
                        <RouterLink to="/login">
                            <a>Already have an account? Login</a>
                        </RouterLink>
                    </div>

                    <div v-if="success" class="form">
                        Registration success, you can <RouterLink to="/login">
                            login
                        </RouterLink> now.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {AUTH_REGISTER} from 'store/actions/auth'

export default {
    name: 'Login',
    metaInfo: {
        title: 'Register'
    },
    components: {},
    data() {
        return {
            success: false,
            username: '',
            email: '',
            password: '',
            password_repeat: '',
            errors: []
        }
    },
    methods: {
        register: function () {
            this.error = false
            const newUser = {
                username: this.username,
                email: this.email,
                password: this.password,
                password_repeat: this.password_repeat
            }
            this.$store.dispatch(AUTH_REGISTER, newUser).then((r) => {
                this.success = true
            }).catch((e) => {
                console.error(e.response.data)
                if (e.response.data.hasOwnProperty('errors')) {
                    this.errors = e.response.data.errors
                }
            })
        }
    }
}
</script>
<style scoped lang="scss">
    .nq-card {
        max-width: 480px;
    }

    .content-container{
        height: auto;
    }
    input[type="password"]{
        text-align: left;
    }
    .centered-container {
        margin-top: 50px;
        height: auto;
    }
    .logo-inline{
        svg {
            width: 64px;
            height: 64px
        }
        width: 64px;
        height: 64px;
        display: inline-block;
    }
    .logo-inline + h1{
        margin-top: 0;
    }
</style>