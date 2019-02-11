<template>
    <div class="nq-card walletDetail">
        <h3 class="nq-label">Contact list</h3>

        {{ getContacts }}
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import store from 'store'
    import {CONTACT_LIST_REQUEST} from 'store/actions/contact'

    export default {
        name: "Contacts",
        metaInfo: {
            title: 'Contacts'
        },
        computed: mapGetters(['getContacts']),
        created() {
            store.dispatch(CONTACT_LIST_REQUEST)
        },
        data() {
            return {};
        },
    };
</script>
<style scoped>
    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
        padding: 20px 15px;
    }
</style>