<template>
    <div class="flex-container">
        <div class="content-container nq-style scrollbar-themed">
            <div class="centered-container">
                <div class="text-center">
                    <div class="logo" />
                    <h1>Nimiq Wallet Manager</h1>
                </div>
                <div class="nq-card">
                    <div class="form">
                        <h2 class="nq-h2">
                            Login
                        </h2>
                        <div v-if="error" class="nq-red-bg errors">
                            Invalid username or password!
                        </div>
                        <form @submit.prevent="login">
                            <div class="nq-label">
                                Username:
                            </div>
                            <input v-model="username" type="text" name="username" required>
                            <div class="nq-label">
                                Password:
                            </div>
                            <input v-model="password" type="password" class="password" name="password" required>
                            <div @click="advancedSettingsShown = !advancedSettingsShown">
                                <span class="nq-text-s">Login options</span>
                                <span class="adv_icon">
                                    <span v-if="!advancedSettingsShown" class="material-icons">keyboard_arrow_down</span>
                                    <span v-if="advancedSettingsShown" class="material-icons">keyboard_arrow_up</span>
                                </span>
                            </div>
                            <div v-if="advancedSettingsShown">
                                <div>
                                    <p>
                                        <label>
                                            <input v-model="sessionIpLocked" type="checkbox">Lock this session to my IP
                                        </label>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <label>
                                            <input v-model="endAllPreviousSessions" type="checkbox">End all previous sessions
                                        </label>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        Session lifetime:
                                        <select v-model="sessionDuration">
                                            <option value="300">
                                                5 min
                                            </option>
                                            <option value="3600">
                                                1 hour
                                            </option>
                                            <option value="21600">
                                                6 hour
                                            </option>
                                            <option value="86500">
                                                1 day
                                            </option>
                                            <option value="604800">
                                                1 week
                                            </option>
                                            <option value="2419200">
                                                1 month
                                            </option>
                                            <option value="31536000">
                                                1 year
                                            </option>
                                        </select>
                                    </p>
                                </div>
                            </div>
                            <button class="nq-button-s margin-top-2" type="submit">
                                Login
                            </button>
                        </form>
                        <RouterLink to="/register">
                            <a>No account? Register here</a>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {AUTH_REQUEST, AUTH_ERROR} from 'store/actions/auth'

export default {
    name: 'Login',
    metaInfo: {
        title: 'Login'
    },
    components: {},
    data() {
        return {
            advancedSettingsShown: false,
            sessionIpLocked: false,
            endAllPreviousSessions: false,
            sessionDuration: 86500,
            username: '',
            password: '',
            error: false
        }
    },
    methods: {
        login: function () {
            this.error = false
            const {username, password, sessionDuration, endAllPreviousSessions, sessionIpLocked} = this
            this.$store.dispatch(AUTH_REQUEST, {username, password, sessionDuration, endAllPreviousSessions, sessionIpLocked }).then(() => {
                console.log('Logged in!')
                this.$router.push('/')
            }).catch(e => {
                console.log(e)
                if (e === AUTH_ERROR) {
                    this.error = true
                }
            })
        }
    }

}
</script>
<style scoped>
    .nq-card {
        width: 380px;
    }

    .adv_icon{
        cursor: pointer;
        position: relative;
    }
    .adv_icon .material-icons{
        position: absolute;
        top: 3px;
    }
    .centered-container {
        margin-top: 50px;
        height: auto;
    }
    input[type="password"]{
        text-align: left;
    }
</style>
