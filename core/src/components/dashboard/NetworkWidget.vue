<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">Network information</h1>
        </div>
        <div class="nq-card-body">
            <div class="body-row">
                <span class="nq-label">Consensus</span>
                <span class="nq-text-s pull-right" v-if="getNetworkStats.consensus">Established</span>
                <span class="nq-text-s pull-right" v-else>Lost</span>
            </div>
            <div class="body-row">
                <span class="nq-label">Blockchain height</span>
                <span class="nq-text-s pull-right">{{ getNetworkStats.height }}</span>
            </div>
            <div class="body-row">
                <span class="nq-label">Global hashrate</span>
                <span class="nq-text-s pull-right">{{ getNetworkStats.hashrate | humanHash }}</span>
            </div>
            <div class="body-row">
                <span class="nq-label">Difficulty</span>
                <span class="nq-text-s pull-right">{{ getNetworkStats.difficulty | toFixed }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {NETWORK_STATS_REQUEST} from 'store/actions/nimiq'
    import {humanHash} from 'filters/humanHash'

    export default {
        name: 'NetworkWidget',
        methods: {},
        computed: mapGetters(['getNetworkStats']),
        created() {
            store.dispatch(NETWORK_STATS_REQUEST)
        },
        filters: {
            humanHash,
            toFixed: (n) => {
                return parseFloat(n).toFixed(3)
            }
        }
    }
</script>

<style scoped>

</style>