<template>
    <div>
        <div class="dashboard">
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
                        <span class="nq-text-s pull-right">{{ getNetworkStats.network.bytesReceived | formatBytes
                        }}</span>
                    </div>
                    <div class="body-row">
                        <span class="nq-label">Network out</span>
                        <span class="nq-text-s pull-right">{{ getNetworkStats.network.bytesSent | formatBytes }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="nq-card">
            <div class="nq-card-header">
                <h1 class="nq-h1">
                    Peer list
                </h1>
            </div>
            <div class="nq-card-body">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Address State</th>
                                <th>Connection State</th>
                                <th>TX</th>
                                <th>RX</th>
                                <th>Score</th>
                                <th>Ping</th>
                            </tr>
                        </thead>
                        <tr v-for="peer in getPeerList" :key="peer.id" class="row">
                            <td class="peer-address">
                                {{ peer.address | getHostname }}
                            </td>
                            <td>
                                {{ peer.addressState | getPeerState('address') }}
                            </td>
                            <td>
                                {{ peer.connectionState | getPeerState('connection') }}
                            </td>
                            <td>
                                {{ (peer.tx || 0) | formatBytes }}
                            </td>
                            <td>
                                {{ (peer.rx || 0) | formatBytes }}
                            </td>
                            <td>
                                {{ peer.score || 0 }}
                            </td>
                            <td>
                                {{ peer.latency || 0 }} ms
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import store from 'store'
import {PEER_LIST_REQUEST, NETWORK_STATS_REQUEST} from 'store/actions/nimiq'
import {formatBytes} from 'filters/formatBytes'
import {getHostname} from 'filters/getHostname'
import {getPeerState} from 'filters/getPeerState'

export default {
    name: 'SeedWidget',
    filters: {
        formatBytes,
        getHostname,
        getPeerState
    },
    computed: mapGetters(['getNetworkStats', 'getPeerList']),
    created() {
        store.dispatch(PEER_LIST_REQUEST)
        store.dispatch(NETWORK_STATS_REQUEST)
        this.sockets.subscribe('NETWORK_PEERS_CHANGED', () => {
            store.dispatch(PEER_LIST_REQUEST)
        })
    },
    destroyed(){
        this.sockets.unsubscribe('NETWORK_PEERS_CHANGED')
    }

}
</script>

<style scoped lang="scss">
    .nq-card {
        max-width: none;
        .table-container {
            overflow: auto;
        }
    }

    .table {
        thead {
            tr {
                th {
                    font-weight: bold;
                    text-align: left;
                }
            }
        }
        width: 100%;
        td {
            &.peer-address {
                max-width: 20%;
            }
        }

    }
</style>
