<template>
    <div class="flex-container">
        <sidebar></sidebar>
        <div class="content-container nq-style scrollbar-themed">
            <router-view></router-view>
        </div>
    </div>
</template>


<script>
    import Sidebar from './layout/Sidebar.vue';

    export default {

        name: 'app',

        data() {

            return {}

        },

        components: {
            Sidebar,
        },
    }
</script>
