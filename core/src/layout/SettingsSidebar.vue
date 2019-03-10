<template>
    <div class="sidenav left scrollbar-themed" :class="{'shown': getMenuShown }">
        <div class="nq-card">
            <div class="nq-card-header">
                <h1 class="nq-h1">
                    Personal settings
                </h1>
            </div>
            <div class="menu nq-style">
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
    filters: {},
    components: {},
    data() {
        return {}
    },
    computed: mapGetters(['getMenuShown']),
    created() {

    },
    methods: {}
}
</script>

<style scoped lang="scss">
    .nq-card {
        animation: slideInDown 0.5s;
        cursor: pointer;
    }
    .nq-card-header{
        text-align: center;
        background-color: rgba(31,35,72,.07);
    }
    .menu{
        ul {
            list-style: none;
            margin: 0;
            padding: 0;
            border-left: 1px solid rgba(31,35,72,.07);
            li {
                margin: 0;
                a {
                    &.router-link-active{
                        background-color: #fff;
                        color: #24292e;
                        cursor: default;
                        font-weight: 600;
                        border-left: 2px solid var(--nimiq-blue);
                        padding: 8px 8px;
                    }
                    display: block;
                    padding: 8px 10px;
                    border-bottom: 1px solid #e1e4e8;
                }
            }
        }
    }
</style>
