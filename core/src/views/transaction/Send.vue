<template>
    <div>
        <div class="nq-card">
            <div class="nq-card-header">
                <h1 class="nq-h1">
                    Send transaction
                </h1>
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
                                                   class="img-responsive"
                                        />
                                    </div>
                                    <div class="account-data">
                                        <span class="material-icons pull-right">keyboard_arrow_down</span>
                                        <span class="nq-label">{{ newTx.sendFrom.label }} </span>
                                        <div class="nq-text-s">
                                            {{ newTx.sendFrom.address }}
                                        </div>
                                    </div>
                                    <div class="clearfix" />
                                </div>
                                <div class="dropdown-container nq-card" :class="{'shown': dropdownShown}">
                                    <div v-for="wallet in getWallets" :key="wallet.address" class="wallet"
                                         @click="selectAccount(wallet)"
                                    >
                                        <div class="identicon">
                                            <Identicon :address="wallet.address" size="64"
                                                       class="img-responsive"
                                            />
                                        </div>
                                        <div class="account-data">
                                            <span class="nq-label">{{ wallet.label }} </span>
                                            <div class="nq-text-s">
                                                {{ wallet.address }}
                                            </div>
                                            <div class="nq-h3 pull-right">
                                                {{ wallet.balance | lunaToCoins }} NIM
                                            </div>
                                        </div>
                                        <div class="clearfix" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span class="pull-right nq-button-s" @click="showContactDialog">
                            Contacts
                        </span>
                        <label class="nq-h3">Send to</label>
                        <div class="account-row">
                            <div>
                                <div class="identicon">
                                    <Identicon :address="newTx.sendTo.address" size="64"
                                               class="img-responsive"
                                    />
                                </div>
                                <div class="account-data">
                                    <div class="nq-text-s">
                                        <AddressInput :address="inputToAddress" placeholder="Enter recipient address"
                                                      @changed="setAddress"
                                        />
                                    </div>
                                </div>
                                <div class="clearfix" />
                            </div>
                        </div>

                        <div class="input">
                            <label class="nq-h3">Amount</label>
                            <div class="input-group">
                                <input v-model="newTx.value" class="form-control" min="0" placeholder="0.00"
                                       type="number" step="0.00001"
                                >
                                <div class="suffix">
                                    NIM
                                </div>
                                <div class="nq-button-s" @click="setMaxValue">
                                    MAX
                                </div>
                            </div>
                            <div v-if="newTx.sendFrom.balance < (newTx.value + newTx.fee)" class="error nq-red-bg">
                                Not enough balance
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <h5 class="text-center pointer" @click="advancedSettingsShown =! advancedSettingsShown">
                            Advanced settings
                            <div class="adv_icon">
                                <span v-if="!advancedSettingsShown" class="material-icons">
                                    keyboard_arrow_down
                                </span>
                                <span v-if="advancedSettingsShown" class="material-icons">
                                    keyboard_arrow_up
                                </span>
                            </div>
                        </h5>
                        <div v-if="advancedSettingsShown" class="advanced">
                            <div class="input">
                                <label class="nq-h3">Message</label>
                                <div>
                                    <input v-model="newTx.extraData" type="text">
                                </div>
                            </div>
                            <div class="input">
                                <label class="nq-h3">Fee</label>
                                <div class="x-fee-labels">
                                    <div free="">
                                        free
                                    </div>
                                    <div low="">
                                        standard
                                    </div>
                                    <div high="">
                                        express
                                    </div>
                                </div>
                                <input v-model="newTx.fee" class="form-control" min="0" placeholder="Enter nim amount"
                                       type="range" step="69" max="276"
                                >
                                <div class="text-center">
                                    {{ newTx.fee | lunaToCoins(5) }} NIM
                                </div>
                            </div>
                        </div>
                    </div>
                    <button v-if="validTx" type="button" class="nq-button-s green pull-right"
                            @click="sendTransaction"
                    >
                        Send
                    </button>
                    <button type="button" class="nq-button-s red">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {AUTH_REQUEST, AUTH_ERROR} from 'store/actions/auth'
import Identicon from 'components/Identicon.vue'
import AddressInput from 'components/AddressInput.vue'
//import NqIcon from 'components/NqIcon.vue'
import {mapGetters} from 'vuex'
import store from 'store'
import {WALLET_LIST_REQUEST} from 'store/actions/wallet'
import {lunaToCoins} from 'filters/lunaToCoins'
import {nimiqApi} from 'utils/api/nimiq'

export default {
    name: 'SendTransaction',
    metaInfo: {
        title: 'Send transaction'
    },
    filters: {
        lunaToCoins
    },
    components: {
        Identicon,
        AddressInput
    },
    data() {
        return {
            validTx: false,
            inputToAddress: '',
            dropdownShown: false,
            advancedSettingsShown: false,
            error: '',
            newTx: {
                sendFrom: {
                    balance: 0
                },
                sendTo: {
                    address: ''
                },
                value: 0,
                extraData: '',
                fee: 0
            }
        }
    },
    computed: mapGetters(['getWallets']),
    watch: {
        getWallets: function (wallets) {
            if (wallets.length > 0) {
                this.newTx.sendFrom = wallets.slice().shift()
            }
        },
        inputToAddress: function (inputAddress) {
            let address
            try {
                address = Nimiq.Address.fromString(inputAddress)
            } catch (e) {
                this.newTx.sendTo.address = ''
            }
            if (address) {
                this.newTx.sendTo.address = address.toUserFriendlyAddress()
            }
        },
        newTx: {
            deep: true,
            handler: function () {
                this.validTx = this.canSend()
            }
        }
    },
    created() {
        store.dispatch(WALLET_LIST_REQUEST)
    },

    methods: {
        setAddress: function (address) {
            this.inputToAddress = address
        },
        canSend: function () {
            let hasSender = (this.newTx.sendFrom.address)
            let hasEnoughBalance = (this.newTx.sendFrom.balance >= (Nimiq.Policy.coinsToLunas(this.newTx.value) + this.newTx.fee))
            let hasRecipient = (this.newTx.sendTo.address)
            let senderIsNotReceipient = (this.newTx.sendTo.address !== this.newTx.sendFrom.address)
            let amountIsBiggerThanZero = (this.newTx.value > 0)
            return (hasSender
                    && hasEnoughBalance
                    && hasRecipient
                    && senderIsNotReceipient
                    && amountIsBiggerThanZero
            )
        },
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
        setMaxValue: function () {
            this.newTx.value = Nimiq.Policy.lunasToCoins(this.newTx.sendFrom.balance - this.newTx.fee)
        },
        sendTransaction: function () {
            this.$dialog.alert('', {
                view: 'ConfirmTransactionPopup',
                transaction: this.newTx,
            }).then((data) => {
                nimiqApi.sendTransaction({tx: data.data.serialize()}).then(() => {
                    this.$notify({
                        title: 'Transaction send',
                    })
                    this.$router.push('/')
                })
            }).catch((e) => {
                this.$notify({
                    type: 'error',
                    title: 'Error:' + e,
                })
            })
        }
    },

}
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

    .adv_icon {
        display: inline-block;
        position: relative;
    }

    .adv_icon span {
        position: absolute;
        top: -18px;
    }

    .error {
        padding: 5px;
    }

    .form-control {
        width: 100%;
    }

    .nq-button-s {
        padding: 0.5rem 1.5rem;
    }

    .input-group {
        position: relative;
    }
    .input-group:hover .nq-button-s {
        opacity: 1;
    }
    .input-group:hover .suffix {
        opacity: 0;
    }

    .input-group .suffix{
        opacity: 1;
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 1.5rem;
    }
    .input-group .nq-button-s {
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
         display: none; /*<- Crashes Chrome on hover*/
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    input[type=number] {
        -moz-appearance:textfield; /* Firefox */
    }
</style>