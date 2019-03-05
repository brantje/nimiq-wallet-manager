<template>
    <div>
        <div class="nq-card">
            <div class="nq-card-body">
                <FormWizard ref="wizard" title="Add wallet" subtitle="" color="#1f2348" step-size="xs"
                            @on-complete="onComplete" @on-error="handleError"
                >
                    <TabContent title="Choose wallet type">
                        <div>
                            <p><b>Choose wallet type to add</b></p>
                        </div>
                        <div>
                            <label>
                                <input v-model="addType" type="radio" name="addType" value="address" @click="nextStep">
                                Add wallet by address (sending tx not possible)
                            </label>
                        </div>
                        <div>
                            <label>
                                <input v-model="addType" type="radio" name="addType" value="recoveryWords" @click="nextStep">
                                Import wallet by Recovery Words
                            </label>
                        </div>
                        <!--<div>-->
                        <!--<label>-->
                        <!--<input type="radio" name="addType" v-model="addType" value="imageWallet">-->
                        <!--Import wallet by ImageWallet-->
                        <!--</label>-->
                        <!--</div>-->
                        <div>
                            <label>
                                <input v-model="addType" type="radio" name="addType" value="generateNew" @click="nextStep">
                                Generate new wallet
                            </label>
                        </div>
                        <p>
                            <small>The wallet private key will be encrypted before it's send to the server.<br />More
                                info can be found <a
                                    href="https://github.com/brantje/nimiq-wallet-manager/wiki/How-is-the-private-key-of-the-wallet-stored%3F"
                                    rel="nofollow noreferrer noopener"
                                >here</a>
                                <!--nofollow noreferrer noopener: Prevents tab napping and information leakage. -->
                            </small>
                        </p>
                    </TabContent>

                    <TabContent title="Additional Info" :before-change="validateStep2">
                        <div v-if="addType === 'address'">
                            <div>
                                <p>
                                    <b>Enter the wallet address you want to add</b>
                                </p>
                            </div>
                            <div>
                                <input v-model="walletAddressInput" type="text"
                                       placeholder="NQ.. .... .... .... .... ...."
                                />
                            </div>
                        </div>
                        <div v-if="addType === 'generateNew'">
                            <div>
                                <h1>Choose Your Account Avatar</h1>
                                <p>The Avatar will be 'unique' to this Account. You can not change it later.</p>
                            </div>
                            <div>
                                <div class="identicon-container">
                                    <div v-for="item in newWallets" :key="item.address" class="x-identicon" :class="{'initial-position': !firstStepPassed}" @click="setWallet(item, true)">
                                        <Identicon :address="item.address" size="128"></Identicon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="addType === 'recoveryWords'">
                            <div>
                                <h1>Account Recovery</h1>
                                <p>Please enter your 24 Account Recovery Words.</p>
                                <input v-model="recoveryWords" type="text" placeholder="Enter your recovery words" />
                            </div>
                        </div>
                    </TabContent>

                    <TabContent title="Name it" :before-change="validateStep3">
                        <div>
                            <p>
                                <b>Make your wallet personal by giving it a name</b>
                            </p>
                        </div>
                        <div>
                            <input v-model="wallet.label" type="text" />
                        </div>
                    </TabContent>
                    <TabContent v-if="addType !== 'address'" title="Pass phrase">
                        <div>
                            <h1>Set a Pass Phrase</h1>
                            <p>
                                Please enter a Pass Phrase to secure your wallet.<br /><br />

                                The Pass Phrase is not an alternative for your 24 Recovery Words and it cannot be
                                changed or reset!
                            </p>
                        </div>
                        <div>
                            <input v-model="passPhrase" type="password" />
                        </div>
                    </TabContent>
                    <TabContent v-if="addType !== 'address'" title="Confirm pass phrase" :before-change="validatePassPhrase">
                        <div>
                            <h1>Confirm Pass Phrase</h1>
                            <p>Please confirm your Pass Phrase.</p>
                        </div>
                        <div>
                            <input v-model="passPhraseConfirm" type="password" />
                        </div>
                    </TabContent>
                    <TabContent title="Confirmation">
                        <div>
                            <h1>Your wallet is almost ready</h1>
                            <p>
                                Below you can find the details, if everything look fine click finish
                            </p>
                            <div>
                                <div class="identicon">
                                    <Identicon :address="wallet.address" size="64" class="img-responsive"></Identicon>
                                </div>
                                <div class="account-data">
                                    <span class="nq-label">{{ wallet.label }} </span>
                                    <div class="nq-text-s">
                                        {{ wallet.address }}
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </TabContent>
                </FormWizard>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import store from 'store'
import {ADD_WALLET_REQUEST, ADD_WALLET_ERROR} from 'store/actions/wallet'
import Identicon from 'components/Identicon.vue'
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {encrypt} from '../../utils/encryption'

export default {
    name: 'AddWallet',
    metaInfo: {
        title: 'Add wallet'
    },
    components: {
        Identicon,
        FormWizard,
        TabContent
    },
    //        computed: mapGetters(['getWalletTransactions']),
    data() {
        return {
            newWallets: [],
            addType: '',
            firstStepPassed: false,
            recoveryWords: '',
            passPhrase: '',
            passPhraseConfirm: '',
            walletAddressInput: '',
            wallet: {
                label: '',
                address: '',
                privateKey: '',
                legacy: false
            },
        }
    },
    async created() {
        for (let i = 0; i < 7; i++) {
            let wallet = await Nimiq.Wallet.generate()
            let privateKey = wallet.keyPair.privateKey.toHex()
            let publicAddress = wallet.address.toUserFriendlyAddress()
            this.newWallets.push({
                address: publicAddress,
                privateKey: privateKey
            })
        }
    },
    methods: {
        async onComplete() {
            let wallet = await this.wallet
            if (wallet.privateKey) {
                let encrypted = await encrypt(wallet.privateKey, this.passPhrase)
                wallet.encryptedPrivateKey = encrypted
                delete wallet.privateKey
            }
            this.$store.dispatch(ADD_WALLET_REQUEST, wallet).then(() => {
                this.$notify({
                    title: 'Wallet added',
                })
                this.$router.push('/')
            }).catch(e => {
                if (e === ADD_WALLET_ERROR) {
                    this.$notify({
                        type: 'error',
                        title: 'Something went wrong while saving the wallet',
                    })
                }
            })

        },
        nextStep: function () {
            this.$refs.wizard.nextTab()
            this.firstStepPassed = false
            setTimeout(() => this.firstStepPassed = true, 50)
        },
        handleError: function (errorMsg) {
            if (errorMsg) {
                this.$notify({
                    type: 'error',
                    title: errorMsg,
                })
            }
        },
        setWallet: function (wallet, goNext = false) {
            this.wallet.address = wallet.address
            this.wallet.privateKey = wallet.privateKey
            this.wallet.legacy = wallet.legacy || 0
            if(goNext){
                this.$refs.wizard.changeTab(1,2)
            }
        },
        validateStep2: function () {
            return new Promise((resolve, reject) => {
                let result
                switch (this.addType) {
                case 'address':
                    result = this.validateAddress()
                    break
                case 'recoveryWords':
                    result = this.validateRecoveryWords()
                    break

                case 'imageWallet':

                    break
                }
                if (result &&
                        result.hasOwnProperty('address') &&
                        result.hasOwnProperty('privateKey')) {
                    this.setWallet(result)
                    resolve(true)
                    return
                }
                reject('An error occurred while validating the wallet.')
            })
        },
        validateStep3: function () {
            return new Promise((resolve, reject) => {
                if(!this.wallet.label){
                    return reject('Please give your wallet a name')
                }
                resolve(true)
            })
        },
        validatePassPhrase: function () {
            return new Promise((resolve, reject) => {
                if(this.passPhrase === this.passPhraseConfirm){
                    resolve(true)
                }
                return reject('The pass phrase doesn\'t match')

            })
        },
        validateAddress: function () {
            let address = Nimiq.Address.fromUserFriendlyAddress(this.walletAddressInput)
            return {address: address.toUserFriendlyAddress(), privateKey: ''}
        },
        validateRecoveryWords: function () {
            if (!this.recoveryWords || this.recoveryWords.trim() === '') {
                throw Error('Please enter your recovery words')
            }
            let string = this.recoveryWords.split(',').join(' ')
            let mnemonicType = Nimiq.MnemonicUtils.getMnemonicType(string)
            let entropy, wallet
            if (mnemonicType === Nimiq.MnemonicUtils.MnemonicType.BIP39) {
                console.log('BIP39 key')
                entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(string)
                let master = entropy.toExtendedPrivateKey('')
                let mastrW0 = master.derivePath('m/44\'/242\'/0\'/0\'')
                wallet = {
                    address: mastrW0.toAddress().toUserFriendlyAddress(),
                    privateKey: master.toHex(),
                    legacy: Nimiq.MnemonicUtils.MnemonicType.BIP39
                }
            }
            if (mnemonicType === Nimiq.MnemonicUtils.MnemonicType.LEGACY) {
                console.log('Legacy key')
                const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(string)
                const buffer = entropy.serialize()
                const privateKey = new Nimiq.PrivateKey(buffer)
                const keyPair = Nimiq.KeyPair.derive(privateKey)
                const _wallet = new Nimiq.Wallet(keyPair)
                wallet = {
                    address: _wallet.address.toUserFriendlyAddress(),
                    privateKey: _wallet.keyPair.privateKey.toHex(),
                    legacy: Nimiq.MnemonicUtils.MnemonicType.LEGACY,
                }
            }
            return wallet
        }
    }
}
</script>
<style scoped>
    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
    }

    .initial-position{
        transform: translate(0, 0) !important;
    }
</style>
<style>
    .wizard-nav.wizard-nav-pills, .wizard-progress-with-circle, .vue-form-wizard .category, .vue-form-wizard .wizard-header {
        display: none;
    }
    .vue-form-wizard .wizard-tab-content .wizard-tab-container {
        display: block;
        animation: fadeIn 0.5s;
        width: 100%;
    }
    .vue-form-wizard .wizard-card-footer{
        padding: 0;
        margin-top: 2rem;
    }
    .vue-form-wizard .wizard-tab-content {
        padding: 0;
        display: flex;
    }
    input[type="password"]{
        text-align: left;
    }
</style>
