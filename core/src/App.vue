<template>
    <div>
        <Header v-if="isAuthenticated"/>
        <div class="flex-container">
            <Sidebar v-if="isAuthenticated"/>
            <div class="content-container nq-style scrollbar-themed"> <!-- Scrollbar not working on firefox -->
                <router-view :key="$route.fullPath"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Header from "layout/Header.vue"
    import Sidebar from "layout/Sidebar.vue"
    import { USER_REQUEST } from 'store/actions/user'
    import { mapState, mapGetters } from 'vuex'

    export default {
        name: "app",

        data() {
            return {
                user: false
            };
        },
        computed: mapGetters(['isAuthenticated']),
        components: {
            Header,
            Sidebar
        }
    };
</script>
