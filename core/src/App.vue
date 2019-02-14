<template>
    <div>
        <Header v-if="isProfileLoaded"/>
        <div class="flex-container">
            <LeftSidebar v-if="isProfileLoaded"/>
            <div class="content-container nq-style scrollbar-themed"> <!-- Scrollbar not working on firefox -->
                <notifications  position="top center" classes="notification" />
                <router-view :key="$route.fullPath"></router-view>
            </div>
            <RightSidebar v-if="isProfileLoaded"/>
        </div>
    </div>
</template>

<script>
    import Header from "layout/Header.vue"
    import LeftSidebar from "layout/LeftSidebar.vue"
    import RightSidebar from "layout/RightSidebar.vue"
    import { USER_REQUEST } from 'store/actions/user'
    import store from 'store'
    import { mapState, mapGetters } from 'vuex'
    import router from 'router'

    export default {
        name: "app",
        metaInfo: {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: 'Index',
            // all titles will be injected into this template
            titleTemplate: '%s | Nimiq Wallet Manager'
        },
        data() {
            return {
                user: false
            };
        },
        computed: mapGetters(['isProfileLoaded', 'isAuthenticated']),
        created(){
            if(this.isAuthenticated){
                store.dispatch(USER_REQUEST)
            }
        },
        watch: {
            isAuthenticated: (newValue, oldValue) => {
                if(newValue === false && oldValue === true){
                    router.push({name: 'Login'});
                }
            }
        },
        components: {
            Header,
            LeftSidebar,
            RightSidebar
        }
    };
</script>

<style>
    .nq-card-body{
        padding: 2rem;
    }
</style>