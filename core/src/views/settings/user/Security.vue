<template>
    <div class="sidenav scrollbar-themed">
        <div class="nq-card">
            <div class="nq-card-body">
                <div class="nq-card-header">
                    <h1 class="nq-h1 pull-left">Two-factor authentication</h1>

                    <div class="pull-right">
                        <div class="btn-states btn-two-factor-state">
                            <span v-if="getProfile.settings && getProfile.settings.two_factor_enabled">
                                <button class="nq-button-s">Enabled</button>
                                <button class="nq-button-s red">Disable</button>
                            </span>
                            <span v-if="getProfile.settings && !getProfile.settings.two_factor_enabled">
                                <button class="nq-button-s">Disabled</button>
                                <button class="nq-button-s green" @click="setupTwoFacfor">Enable</button>
                            </span>
                        </div>
                    </div>
                </div>

                <p class="mb-3">
                    Two-factor authentication adds an additional layer of security to your account by requiring more
                    than just a password to log in. <a
                        href="https://help.github.com/articles/about-two-factor-authentication/">Learn more</a>.
                </p>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {USER_REQUEST} from 'store/actions/user'

    export default {
        created() {
            store.dispatch(USER_REQUEST)
        },
        computed: mapGetters(['getProfile']),

        data() {
            return {};
        },
        filters: {},
        methods: {
            setupTwoFacfor: function () {
                this.$dialog.alert('', {
                    view: 'TwoFactorSetupPopup',
                    customClass: 'big-dialog'
                }).then(() => {

                }).catch(() => {
                })
            }
        },
        components: {}
    };
</script>

<style scoped>
    .btn-states:hover .nq-button-s:last-child {
        display: inline-block;
    }

    .btn-states:hover .nq-button-s:first-child {
        display: none;
    }

    .btn-states .nq-button-s:last-child {
        display: none;
    }

</style>
