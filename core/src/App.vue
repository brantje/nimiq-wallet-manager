<template>
    <div>
        <Header v-if="isProfileLoaded" />
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
import {CONTACT_LIST_REQUEST} from 'store/actions/contact'
import store from 'store'
import {mapState, mapGetters} from 'vuex'
import router from 'router'

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
            user: false
        }
    },
    computed: mapGetters(['isProfileLoaded', 'isAuthenticated', 'getUserStatus', 'getToken']),
    watch: {
        isAuthenticated: (newValue, oldValue) => {
            if (newValue === false && oldValue === true) {
                router.push({name: 'Login'})
            }
        },
        getUserStatus: function (newValue, oldValue) {
            if (newValue === 401) {
                router.push({path: 'authorize'})
            }
            if (newValue === 403) {
                router.push({path: 'login'})
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
    created() {
        if (this.isAuthenticated) {
            store.dispatch(USER_REQUEST)
            store.dispatch(CONTACT_LIST_REQUEST)
        }
    }
}
</script>

<style>
    .nq-card-body {
        padding: 2rem;
    }
</style>