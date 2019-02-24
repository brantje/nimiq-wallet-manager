<template>

    <div class="nq-card">
        <div class="nq-card-body">
            <h1 class="nq-h1">Sessions</h1>
            <div class="session-devices">
                <div class="session-details">
                    <div class="pull-left margin-right-2">
                        <span class="material-icons">computer</span>
                        <!--<span class="material-icons">phone_android</span>-->
                    </div>
                    <div class="session pull-left">
                        <strong>
                            Meppel
                            <span>77.174.148.46</span>
                        </strong>
                        <small class="text-gray d-block">
                            Last accessed on
                            <time>Feb 17, 2019</time>
                        </small>

                        <small class="text-gray">
                            <span class="mr-1">Seen in</span> <span class="tooltipped tooltipped-s"
                                                                    aria-label="Netherlands">NL</span>
                        </small>
                    </div>
                    <div class="pull-right">
                        <button class="nq-button-s red">Revoke</button>
                    </div>
                </div>

                <div class="clearfix"></div>
            </div>

        </div>
    </div>


</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
    import {lunaToCoins} from 'filters/lunaToCoins'
    import Identicon from "components/Identicon.vue"

    export default {

        created() {

        },
        data() {
            return {};
        },
        filters: {},
        methods: {},
        components: {}
    };
</script>

<style scoped>
.session-details strong{
    display: block;
}
</style>
