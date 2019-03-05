<template>
    <div class="sidenav scrollbar-themed">
        <div class="nq-card">
            <div class="nq-card-body">
                Personal settings
                <ul>
                    <li>
                        <RouterLink to="/settings/user/account">
                            Account
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/settings/user/security">
                            Security
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/settings/user/sessions">
                            Sessions
                        </RouterLink>
                    </li>
                </ul>

                <!--Admin settings-->
                <!--<ul>-->
                <!--<li>Users</li>-->
                <!--<li>Nimiq</li>-->
                <!--</ul>-->
            </div>
        </div>
    </div>
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

<style scoped>
    .nq-card{
        animation: slideInDown 0.5s;
        cursor: pointer;
    }
</style>
