<template>

    <div class="nq-card">
        <div class="nq-card-body">
            <h1 class="nq-h1">Sessions</h1>
            <div class="session-devices">
                <div class="session-details margin-top-2" v-for="session in getSessions">
                    <div class="pull-left margin-right-2">
                        <span class="material-icons">computer</span>
                        <!--<span class="material-icons">phone_android</span>-->
                    </div>
                    <div class="session pull-left">
                        <strong>
                            <span v-if="session.location.city">{{ session.location.city }}</span>
                            <span v-else>Unknown location</span>
                            <span>{{ session.ip }}</span>
                        </strong>

                        <div>
                            <small class="nq-text-s">
                                Last accessed on
                                <time>{{ session.lastActive | formatDate('long') }}</time>
                                <br />
                                Expires
                                <time>{{ session.expires | formatDate('long') }}</time>

                            </small>
                        </div>
                        <div>
                            <small class="nq-text-s">
                                {{ session.browser.browser }} {{ session.browser.version }} on {{ session.browser.platform }}
                            </small>
                        </div>
                    </div>
                    <div class="pull-right">
                        <button class="nq-button-s red" :data-session="session._id" v-confirm="{ok: destroySession, message: 'Are you sure you want to end this session?'}">Revoke</button>
                    </div>
                    <div class="clearfix"></div>
                </div>

            </div>

        </div>
    </div>


</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {formatDate} from "filters/formatDate";
    import {SESSION_LIST_REQUEST} from 'store/actions/user'
    import {userApi} from 'utils/api/user';

    export default {
        created() {
            store.dispatch(SESSION_LIST_REQUEST)
        },
        metaInfo: {
            title: 'Sessions'
        },
        computed: mapGetters(['getSessions']),
        data() {
            return {};
        },
        filters: {
            formatDate
        },
        methods: {
            destroySession: function (dialog) {
                let button = dialog.node
                let session = button.dataset.session
                userApi.destroySession({_id: session}).then(() =>{
                    this.$notify({
                        title: 'Session deleted',
                    });
                    store.dispatch(SESSION_LIST_REQUEST)
                })
            }
        },
        components: {}
    };
</script>

<style scoped>
    .session-details strong {
        display: block;
    }
    .nq-card {
        margin: 2rem auto;
        /*max-width: none;*/
    }
</style>
