<template>
    <div>
        <div class="nq-card">
            <div class="nq-card-header">
                <h1 class="nq-h1">Send transaction</h1>
            </div>
            <div class="nq-card-body">
                <form role="form">
                    <div class="form-group">
                        <div class="account-dropdown">
                            <label class="nq-h3">Send from</label>
                            <div>
                                <div class="selected-account" @click="dropdownShown = !dropdownShown">
                                    <div class="identicon">
                                        <Identicon :address="newTx.sendFrom.address" size="64"
                                                   class="img-responsive"></Identicon>
                                    </div>
                                    <div class="account-data">
                                        <span class="material-icons pull-right">keyboard_arrow_down</span>
                                        <span class="nq-label">{{ newTx.sendFrom.label }} </span>
                                        <div class="nq-text-s">
                                            {{ newTx.sendFrom.address }}
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div class="dropdown-container nq-card" :class="{'shown': dropdownShown}">
                                    <div v-for="wallet in getWallets" class="wallet" @click="selectAccount(wallet)">
                                        <div class="identicon">
                                            <Identicon :address="wallet.address" size="64"
                                                       class="img-responsive"></Identicon>
                                        </div>
                                        <div class="account-data">
                                            <span class="nq-label">{{ wallet.label }} </span>
                                            <div class="nq-text-s">
                                                {{ wallet.address }}
                                            </div>
                                            <div class="nq-h3 pull-right">{{ wallet.balance | lunaToCoins }} NIM</div>

                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span class="pull-right" @click="showContactDialog">Contacts</span>
                        <label class="nq-h3">Send to</label>
                        <div class="account-row">
                            <div>
                                <div class="identicon">
                                    <Identicon :address="newTx.sendTo.address" size="64"
                                               class="img-responsive"></Identicon>
                                </div>
                                <div class="account-data">
                                    <div class="nq-text-s">
                                        <input type="text" placeholder="Enter recipient address"
                                               v-model="inputToAddress">
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>

                        <div class="input">
                            <label class="nq-h3">Amount</label>
                            <input class="form-control" min="0" v-model="newTx.value" placeholder="0.00"
                                   type="number" step="0.00001">
                        </div>
                    </div>
                    <div class="form-group">
                        <h5 class="text-center pointer" @click="advancedSettingsShown =! advancedSettingsShown">
                            Advanced settings
                            <div class="adv_icon">
                                <span class="material-icons" v-if="!advancedSettingsShown">keyboard_arrow_down</span>
                                <span class="material-icons" v-if="advancedSettingsShown">keyboard_arrow_up</span>
                            </div>
                        </h5>
                        <div class="advanced" v-if="advancedSettingsShown">
                            <div class="input">
                                <label class="nq-h3">Message</label>
                                <div>
                                    <input type="text" v-model="newTx.extraData"/>
                                </div>
                            </div>
                            <div class="input">
                                <label class="nq-h3">Fee</label>
                                <div class="x-fee-labels">
                                    <div free="">free&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    <div low="">standard</div>
                                    <div high="">express</div>
                                </div>
                                <input class="form-control" min="0" v-model="newTx.fee" placeholder="Enter nim amount"
                                       type="range" step="69" max="276">
                                <div class="text-center">{{ newTx.fee | lunaToCoins(5) }} NIM</div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="nq-button-s green pull-right" v-if="newTx.sendTo.address"
                            @click="sendTransaction">Send
                    </button>
                    <button type="button" class="nq-button-s red">Cancel</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import {AUTH_REQUEST, AUTH_ERROR} from 'store/actions/auth'
    import Identicon from "components/Identicon.vue"
    import NqIcon from "components/NqIcon.vue"
    import {mapGetters} from 'vuex'
    import store from 'store'
    import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
    import {lunaToCoins} from "filters/lunaToCoins";
    import {nimiqApi} from 'utils/api/nimiq'

    export default {
        name: "SendTransaction",
        metaInfo: {
            title: 'Send transaction'
        },
        computed: mapGetters(['getWallets']),
        created() {
            store.dispatch(WALLET_LIST_REQUEST)
        },
        watch: {
            getWallets: function (wallets) {
                if (wallets.length > 0) {
                    let firstWallet = wallets.slice().shift();
                    this.newTx.sendFrom = firstWallet;
                }
            },
            inputToAddress: function (inputAddress) {
                let address;
                try {
                    address = Nimiq.Address.fromString(inputAddress)
                } catch (e) {
                    this.newTx.sendTo.address = ''
                }
                if (address) {
                    this.newTx.sendTo.address = address.toUserFriendlyAddress();
                }
            }
        },
        data() {
            return {
                inputToAddress: '',
                dropdownShown: false,
                advancedSettingsShown: false,
                error: '',
                newTx: {
                    sendFrom: {
                        balance: 0
                    },
                    sendTo: {},
                    value: 0,
                    extraData: '',
                    fee: 138
                }
            };
        },
        methods: {
            selectAccount: function (account) {
                this.dropdownShown = false
                this.newTx.sendFrom = account
            },
            showContactDialog: function () {
                this.$dialog.alert('', {
                    view: 'ContactPopupDialog',
                    customClass: 'big-dialog'
                }).then(({data}) => {
                    this.inputToAddress = data
                }).catch(() => {
                })
            },
            sendTransaction: function () {
                this.$dialog.alert('', {
                    view: 'ConfirmTransactionPopup',
                    transaction: this.newTx,
                }).then((data) => {
                    nimiqApi.sendTransaction({tx: data.data.serialize()}).then(() => {
                        this.$notify({
                            title: 'Transaction send',
                        });
                        this.$router.push('/')
                    })
                }).catch((e) => {
                    this.$notify({
                        type: 'error',
                        title: 'Error:'+ e,
                    });
                })
            }
        },
        filters: {
            lunaToCoins
        },
        components: {
            Identicon,
            NqIcon
        },

    };
</script>
<style scoped>
    .nq-card {
        width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .nq-icon.arrow-down {
        float: right;
        height: 16px;
        width: 16px;
        margin-top: 20px;
    }

    .account-dropdown {
        position: relative;
        z-index: 9;
    }

    .dropdown-container {
        display: none;
        width: 470px;
        position: absolute;
        top: 70px;
        animation: fadeOut 0.5s;
    }

    .selected-account {
        cursor: pointer;
    }

    .dropdown-container.shown {
        display: block;
        animation: fadeIn 0.5s;
    }

    .dropdown-container .wallet {
        padding: 2rem;
        cursor: pointer;
    }

    .selected-account .nq-text-s, .wallet .account-data .nq-text-s {
        white-space: nowrap;
        overflow: hidden;
        max-width: 300px;
        text-overflow: ellipsis;
    }

    .dropdown-container .wallet:hover {
        background-color: rgba(128, 128, 128, 0.1);
    }

    .x-fee-labels {
        display: flex;
        justify-content: space-between;
    }

    .x-fee-labels span {
        width: 100%;
        display: block;
        text-align: center;
    }
    .adv_icon{
        display: inline-block;
        position: relative;
    }
    .adv_icon span{
        position: absolute;
        top: -18px;
    }
    .form-control {
        width: 100%;
    }
</style>