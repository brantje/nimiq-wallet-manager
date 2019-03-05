<template>
    <div class="nq-card walletDetail">
        <h1 class="nq-h1">
            Wallets
        </h1>
        <RouterLink to="/wallet/add">
            <button class="nq-button-s">
                Add wallet
            </button>
        </RouterLink>
        <Draggable v-model="wallets" :options="{group:'people'}" @start="drag=true" @end="drag=false">
            <div v-for="wallet in wallets" :key="wallet.address" class="wallet-list">
                <div class="wallet">
                    <div>
                        <Identicon :address="wallet.address" size="50" class="img-responsive" />
                    </div>
                    <div class="nq-label">
                        {{ wallet.label }}
                    </div>
                    <div class="nq-text-s">
                        {{ wallet.address }}
                    </div>
                    <div class="nq-text-s">
                        {{ wallet.balance | lunaToCoins }} NIM
                    </div>
                    <div class="actions">
                        <button class="nq-button-s red" @click="deleteWallet(wallet)">
                            Delete
                        </button>
                        <button class="nq-button-s" @click="editWallet(wallet)">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </Draggable>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import store from 'store'
import {WALLET_LIST_REQUEST, UPDATE_WALLET_LIST} from 'store/actions/wallet'
import Identicon from 'components/Identicon.vue'
import {walletApi} from 'utils/api/wallet'
import {lunaToCoins} from 'filters/lunaToCoins'
import draggable from 'vuedraggable'

export default {
    name: 'Wallets',
    metaInfo: {
        title: 'My wallets'
    },
    filters: {
        lunaToCoins,
    },
    components: {
        Identicon,
        draggable
    },
    data() {
        return {}
    },
    computed: {
        wallets: {
            get: function () {
                return store.state.wallet.wallets.slice()
            },
            set: function (value) {
                let wallets = JSON.parse(JSON.stringify(value))
                let i = 1
                for(let wallet of wallets){
                    wallet.order = i
                    walletApi.update(wallet).catch(() => { console.log('Error updating wallet order') })
                    i++
                }
                store.dispatch(UPDATE_WALLET_LIST, wallets)
                this.$notify({
                    title: 'Wallet order saved',
                })
            }
        }
    },
    created() {
        store.dispatch(WALLET_LIST_REQUEST)
    },
    methods: {
        deleteWallet: function (wallet) {
            this.$dialog
                    .confirm('Please confirm to continue', {
                        type: 'hard',
                        verification: wallet.label,
                        verificationHelp: 'Type the wallets name  "[+:verification]" to confirm deletion',
                    })
                    .then((dialog) => {
                        walletApi.delete(wallet).then(() => {
                            store.dispatch(WALLET_LIST_REQUEST)
                            this.$notify({
                                title: 'Wallet deleted',
                            })
                        }).catch((e) => {
                            this.$notify({
                                type: 'error',
                                title: 'Error during deleting wallet',
                            })
                        })
                    })
                    .catch(function () {

                    })
        },
        editWallet: function (wallet) {
            this.$dialog.alert('', {
                view: 'EditWalletDialog',
                html: true,
                animation: 'fade',
                backdropClose: true,
                wallet: wallet,
                message: {
                    title: 'Edit wallet'
                }
            }).then(() => store.dispatch(WALLET_LIST_REQUEST)).catch(() => {
            })
        }
    }
}
</script>
<style scoped>
    .wallet-list .wallet {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .wallet-list .wallet .actions {
        margin-top: 12px;
    }

    .wallet-list .wallet div:first-child {
        width: 10%;
        min-width: 55px;
        cursor: move;
    }

    .wallet-list .wallet div:nth-child(2) {
        width: 20%
    }

    .wallet-list .wallet div:nth-child(3) {
        width: 40%
    }

    .wallet-list .wallet div:nth-child(4) {
        width: 15%
    }

    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
        padding: 20px 15px;
    }
</style>