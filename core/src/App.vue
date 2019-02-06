<template>
    <div>
        <Header v-if="user"/>
        <div class="flex-container">
            <Sidebar v-if="user"/>
            <div class="content-container nq-style scrollbar-themed"> <!-- Scrollbar not working on firefox -->
                <router-view :key="$route.fullPath"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Header from "layout/Header.vue"
    import Sidebar from "layout/Sidebar.vue";

    export default {
        name: "app",

        data() {
            return {
                user: false
            };
        },

        components: {
            Header,
            Sidebar
        }
    };
</script>
