<template>
    <RouterView />
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import store from 'store'
import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
import {lunaToCoins} from 'filters/lunaToCoins'
import Identicon from 'components/Identicon.vue'

export default {
    filters: {

    },
    components: {

    },
    data() {
        return {}
    },

    created() {

    },
    methods: {

    }
}
</script>

