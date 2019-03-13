<template>
    <div>
        <Header v-if="isProfileLoaded" />
        <div v-if="!isOnline" class="warn">
            No network!
        </div>
        <div class="flex-container">
            <RouterView v-if="isProfileLoaded" name="leftSidebar" />
            <div class="content-container nq-style scrollbar-themed">
                <!-- Scrollbar not working on firefox -->
                <notifications position="top center" classes="notification" width="350" />
                <RouterView :key="$route.fullPath" />
            </div>
            <RightSidebar v-if="isProfileLoaded" />
        </div>
    </div>
</template>

<script>
import Header from 'layout/Header.vue'
import RightSidebar from 'layout/RightSidebar.vue'
import {USER_REQUEST} from 'store/actions/user'
import {AUTH_LOGOUT} from 'store/actions/auth'
import {CONTACT_LIST_REQUEST} from 'store/actions/contact'
import store from 'store'
import {mapState, mapGetters} from 'vuex'
import router from 'router'
import axios from 'axios'

export default {
    name: 'App',
    metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Index',
        // all titles will be injected into this template
        titleTemplate: '%s | Nimiq Wallet Manager'
    },
    components: {
        Header,
        // LeftSidebar,
        RightSidebar
    },
    data() {
        return {
            user: false,
            navOnline: window.navigator.onLine
        }
    },
    computed: mapGetters(['isProfileLoaded', 'isAuthenticated', 'getUserStatus', 'getToken', 'hasNoNetwork']),
    watch: {
        isAuthenticated: (newValue, oldValue) => {
            if (newValue === false && oldValue === true) {
                router.push({name: 'Login'})
            }
        },
        getUserStatus: function (newValue, oldValue) {

            if (newValue === 403) {
            }
            if (newValue === 'success') {
                this.$socket.io.opts.query = {
                    'token': window.btoa(store.state.auth.token)
                }
                this.$socket.open()
            }
        },
        $route: function () {
            store.commit('hideMenu')
        }
    },
    created: function() {
        let socket = this.$socket
        axios.interceptors.response.use(false, (error) => {
            if(error.response.hasOwnProperty('status')) {
                if (error.response.status === 401) {
                    router.push({path: 'authorize'})
                }
                if (error.response.status === 403) {
                    store.commit(AUTH_LOGOUT)
                    socket.disconnect()
                    router.push({path: 'login'})
                }

                if(error.response.status.toString().charAt(0) === '5' && !this.hasNoNetwork){
                    this.$notify({ clean: true })
                    this.$notify({
                        type: 'error',
                        duration: 5000,
                        title: 'Error while communicating with the server. Please try again later',
                    })
                }
            }
            return Promise.reject(error)
        })

        if (this.isAuthenticated) {
            store.dispatch(USER_REQUEST)
            store.dispatch(CONTACT_LIST_REQUEST)
        }
    }
}
</script>

<style lang="scss">
    .nq-card-body {
        padding: 2rem;
    }
    .warn{
        @media screen and (max-width: 768px){
            padding-top: 84px;
        }
        padding: 15px;
        text-align: center;
        font-size: 2.0rem;
        font-weight: bold;
        margin: 0;
        color: #fff;
        background-color: var(--nimiq-orange);
    }
</style>