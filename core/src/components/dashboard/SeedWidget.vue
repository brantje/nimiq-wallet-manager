<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">
                Seed information
            </h1>
        </div>
        <div class="nq-card-body">
            <div class="body-row">
                <span class="nq-label">Peers connected</span>
                <span class="nq-text-s pull-right">{{ getNetworkStats.network.peerCount }}</span>
            </div>
            <div class="body-row">
                <span class="nq-label">Network in</span>
                <span class="nq-text-s pull-right">{{ getNetworkStats.network.bytesReceived | formatBytes }}</span>
            </div>
            <div class="body-row">
                <span class="nq-label">Network out</span>
                <span class="nq-text-s pull-right">{{ getNetworkStats.network.bytesSent | formatBytes }}</span>
            </div>
            <div class="body-row">
                <RouterLink to="seed-info">
                    More info
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import store from 'store'
import {NETWORK_STATS_REQUEST} from 'store/actions/nimiq'
import {formatBytes} from 'filters/formatBytes'

export default {
    name: 'SeedWidget',
    filters: {
        formatBytes
    },
    computed: mapGetters(['getNetworkStats']),
    created() {
        store.dispatch(NETWORK_STATS_REQUEST)
    }

}
</script>

<style scoped lang="scss">
    .nq-card{
        @media screen and (max-width: 768px){
            order: 2;
        }
    }
</style>
