<template>
    <div>
        <div class="nq-card">
            <div class="nq-card-body">
                <form-wizard title="Add wallet" subtitle="" color="#1f2348" stepSize="xs" @on-complete="onComplete"
                             ref="wizard" @on-error="handleError">
                    <tab-content title="Choose wallet type">
                        <div>
                            <p><b>Choose wallet type to add</b></p>
                        </div>
                        <div>
                            <label><input type="radio" name="addType" v-model="addType" value="address">Add wallet by
                                address (sending tx not possible)</label>
                        </div>
                        <div>
                            <label><input type="radio" name="addType" v-model="addType" value="recoveryWords">Import
                                wallet by Recovery Words</label>
                        </div>
                        <div>
                            <label><input type="radio" name="addType" v-model="addType" value="imageWallet">Import
                                wallet by ImageWallet</label>
                        </div>
                        <div>
                            <label><input type="radio" name="addType" v-model="addType" value="generateNew">Generate new
                                wallet</label>
                        </div>
                        <p>
                            <small>The wallet private key will be encrypted before it's send to the server.<br/>More
                                info can be found <a
                                        href="https://github.com/brantje/nimiq-wallet-manager/wiki/How-is-the-private-key-of-the-wallet-stored%3F"
                                        rel="nofollow noreferrer noopener">here</a>
                                <!--nofollow noreferrer noopener: Prevents tab napping and information leakage. -->
                            </small>
                        </p>
                    </tab-content>

                    <tab-content title="Additional Info" :before-change="validateStep2">
                        <div v-if="addType === 'address'">
                            <div>
                                <p>
                                    <b>Enter the wallet address you want to add</b>
                                </p>
                            </div>
                            <div>
                                <input type="text" v-model="walletAddressInput"
                                       placeholder="NQ.. .... .... .... .... ...."/>
                            </div>
                        </div>
                        <div v-if="addType === 'generateNew'">
                            <div>
                                <h1>Choose Your Account Avatar</h1>
                                <p>The Avatar will be 'unique' to this Account. You can not change it later.</p>
                            </div>
                            <div>
                                <div class="identicon-container">
                                    <div class="x-identicon" v-for="wallet in newWallets" @click="setWallet(wallet)">
                                        <Identicon :address="wallet.address" size="128"></Identicon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="addType === 'recoveryWords'">
                            <div>
                                <h1>Account Recovery</h1>
                                <p>Please enter your 24 Account Recovery Words.</p>
                                <input type="text" v-model="recoveryWords" placeholder="Enter your recovery words"/>
                            </div>
                        </div>
                    </tab-content>

                    <tab-content title="Last step">
                        <div>
                            <p>
                                <b>Make your wallet personal by giving it a name</b>
                            </p>
                        </div>
                        <div>
                            <input type="text" v-model="wallet.label"/>
                        </div>
                    </tab-content>
                    <tab-content title="Last step">
                        <div>
                            <h1>Set a Pass Phrase</h1>
                            <p>Please enter a Pass Phrase to secure your wallet.<br/><br/>

                                The Pass Phrase is not an alternative for your 24 Recovery Words and it cannot be
                                changed or reset!
                            </p>
                        </div>
                        <div>
                            <input type="text" v-model="passPhrase"/>
                        </div>
                    </tab-content>
                </form-wizard>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import store from 'store'
    import {ADD_WALLET_REQUEST, ADD_WALLET_ERROR} from 'store/actions/wallet'
    import Identicon from "components/Identicon.vue"
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'

    export default {
        name: "AddWallet",
        metaInfo: {
            title: 'Add wallet'
        },
//        computed: mapGetters(['getWalletTransactions']),
        data() {
            return {
                newWallets: [],
                addType: '',
                recoveryWords: '',
                passPhrase: '',
                walletAddressInput: '',
                wallet: {
                    label: '',
                    address: '',
                    privateKey: '',
                    legacy: false
                },
            };
        },
        created() {
            for (let i = 0; i < 7; i++) {
                let entropy = Nimiq.Entropy.generate();
                let master = entropy.toExtendedPrivateKey('');
                let wallet = master.derivePath("m/44'/242'/0'/0'");
                this.newWallets.push({
                    address: wallet.toAddress().toUserFriendlyAddress(),
                    privateKey: master.privateKey.toHex(),
                    legacy: Nimiq.MnemonicUtils.MnemonicType.BIP39
                })
            }
        },
        methods: {
            async onComplete() {
                let wallet = await this.wallet
                console.log(wallet)
                //@TODO encrypt the private key
                return;
                this.$store.dispatch(ADD_WALLET_REQUEST, wallet).then(() => {
                    this.$router.push('/')
                }).catch(e => {
                    if (e === ADD_WALLET_ERROR) {
                        this.$notify({
                            type: 'error',
                            title: 'Something went wrong while saving the wallet',
                        });
                    }
                })

            },
            handleError: function (errorMsg) {
                if (errorMsg) {
                    this.$notify({
                        type: 'error',
                        title: errorMsg,
                    });
                }
            },
            setWallet: function (wallet) {
                this.wallet.address = wallet.address
                this.wallet.privateKey = wallet.privateKey
                this.wallet.legacy = wallet.legacy || 0
                this.$refs.wizard.changeTab(1, 2)
            },
            validateStep2: function () {
                return new Promise((resolve, reject) => {
                    let result;
                    switch (this.addType) {
                        case 'address':
                            result = this.validateAddress()
                            break;
                        case 'recoveryWords':
                            result = this.validateRecoveryWords()
                            break;

                        case 'imageWallet':

                            break;
                    }
                    console.log(result)
                    if (result && result.hasOwnProperty('address') && result.hasOwnProperty('privateKey')) {
                        this.setWallet(result)
                        resolve(true)
                        return;
                    }
                    reject('An error occurred while validating the wallet.')
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
                let string = this.recoveryWords.split(',').join(' ');
                let mnemonicType = Nimiq.MnemonicUtils.getMnemonicType(string)
                let entropy, wallet;
                if (mnemonicType === Nimiq.MnemonicUtils.MnemonicType.BIP39) {
                    console.log('BIP39 key')
                    entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(string)
                    let master = entropy.toExtendedPrivateKey('');
                    let mastrW0 = master.derivePath("m/44'/242'/0'/0'")
                    wallet = {
                        address: mastrW0.toAddress().toUserFriendlyAddress(),
                        privateKey: master.toHex(),
                        legacy: Nimiq.MnemonicUtils.MnemonicType.BIP39
                    }
                }
                if (mnemonicType === Nimiq.MnemonicUtils.MnemonicType.LEGACY) {
                    console.log('Legacy key')
                    const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(string);
                    const buffer = entropy.serialize();
                    const privateKey = new Nimiq.PrivateKey(buffer);
                    const keyPair = Nimiq.KeyPair.derive(privateKey);
                    const _wallet = new Nimiq.Wallet(keyPair);
                    wallet = {
                        address: _wallet.address.toUserFriendlyAddress(),
                        privateKey: _wallet.keyPair.privateKey.toHex(),
                        legacy: Nimiq.MnemonicUtils.MnemonicType.LEGACY,
                    }
                }
                return wallet;
            }
        },
        components: {
            Identicon,
            FormWizard,
            TabContent
        }
    };
</script>
<style scoped>
    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
    }

</style>
<style>
    .wizard-nav.wizard-nav-pills, .wizard-progress-with-circle, .vue-form-wizard .category {
        display: none;
    }

    .vue-form-wizard .wizard-tab-content {
        padding: 0;
    }
</style>
