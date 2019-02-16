<template>
    <div class="nq-card walletDetail">
        <h3 class="nq-label">Wallets</h3>
        <router-link to="/wallet/add"><button class="nq-button-s">Add wallet</button></router-link>
        <div class="wallet-list" v-for="wallet in getWallets">
            <div class="wallet">
                <div>
                    <Identicon :address="wallet.address" size="50" class="img-responsive"></Identicon>
                </div>
                <div class="nq-label">{{ wallet.label }}</div>
                <div class="nq-text-s">{{ wallet.address }}</div>
                <div class="nq-text-s">{{ wallet.balance | lunaToCoins}} NIM</div>
                <div class="actions">
                    <button class="nq-button-s red" @click="deleteWallet(wallet)">Delete</button>
                    <button class="nq-button-s" @click="editWallet(wallet)">Edit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import store from 'store'
    import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
    import Identicon from "components/Identicon.vue"
    import {walletApi} from 'utils/api/wallet'
    import {lunaToCoins} from 'filters/lunaToCoins'

    export default {
        name: "Wallets",
        metaInfo: {
            title: 'My wallets'
        },
        computed: mapGetters(['getWallets']),
        created() {
            store.dispatch(WALLET_LIST_REQUEST)
        },
        data() {
            return {};
        },
        methods: {
            deleteWallet: function (wallet) {
                let that = this;
                this.$dialog
                    .confirm('Please confirm to continue', {
                        type: 'hard',
                        verification: wallet.label,
                        verificationHelp: 'Type the wallets name  "[+:verification]" to confirm deletion',
                    })
                    .then(function (dialog) {
                        walletApi.delete(wallet).then(() => {
                            store.dispatch(WALLET_LIST_REQUEST)
                            that.$notify({
                                title: 'Wallet deleted',
                            });
                        }).catch((e) => {
                            that.$notify({
                                type: 'error',
                                title: 'Error during deleting wallet',
                            });
                        })
                    })
                    .catch(function () {

                    });
            },
            editWallet: function (contact) {
                this.$dialog.alert('', {
                    view: 'AddContactDialog', // can be set globally too
                    html: true,
                    animation: 'fade',
                    backdropClose: true,
                    contact: contact,
                    message: {
                        title: 'Edit wallet'
                    }
                }).then(() => store.dispatch(WALLET_LIST_REQUEST)).catch(() => {})
            }
        },
        filters: {
            lunaToCoins,
        },
        components: {
            Identicon
        }
    };
</script>
<style scoped>
    .wallet-list .wallet{
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