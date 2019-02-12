<template>
    <div>
        <div class="nq-card">
            <div class="nq-card-body">
                <form-wizard title="Add wallet" subtitle="" color="#1f2348" stepSize="xs" @on-complete="onComplete">
                    <tab-content title="Choose wallet type">
                        <div>
                            <p><b>Choose wallet type to add</b></p>
                        </div>
                        <div>
                            <label><input type="radio" name="addType" v-model="addType" value="address">Add wallet by address (sending tx not possible)</label>
                        </div>
                        <div>
                            <label><input type="radio" name="addType" v-model="addType" value="recoveryWords">Import wallet by Recovery Words</label>
                        </div>
                        <div>
                            <label><input type="radio" name="addType" v-model="addType" value="generateNew">Generate new wallet</label>
                        </div>
                        <p>
                            <small>The wallet private key will be encrypted before it's send to the server.<br/>More info can be found <a
                                    href="https://github.com/brantje/nimiq-wallet-manager/wiki/How-is-the-private-key-of-the-wallet-stored%3F"
                                    rel="nofollow noreferrer noopener">here</a>
                                <!--nofollow noreferrer noopener: Prevents tab napping and information leakage. -->
                            </small>
                        </p>
                    </tab-content>

                    <tab-content title="Additional Info">
                        <div v-if="addType === 'address'">
                            <div>
                                <p>
                                    <b>Enter the wallet address you want to add</b>
                                </p>
                            </div>
                            <div>
                                <input type="text" v-model="wallet.address"
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
                                    <div class="x-identicon" v-for="wallet in newWallets" click="setWallet(wallet)">
                                        <Identicon :address="wallet.address" size="128"></Identicon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="addType === 'recoveryWords'">
                            <div>
                                <h1>Account Recovery</h1>
                                <p>Please enter your 24 Account Recovery Words.</p>
                                <input type="text" v-model="wallet.privateKey" placeholder="Enter your recovery words"/>
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
        created() {

        },
        data() {
            return {
                newWallets: [],
                addType: '',
                wallet: {
                    label: '',
                    address: '',
                    privateKey: '',
                },
            };
        },
        created() {
          for(let i = 0; i < 7; i++){
              let entropy = window.Nimiq.Entropy.generate();
              let master = entropy.toExtendedPrivateKey('');
              let wallet = master.derivePath("m/44'/242'/0'/0'");
              this.newWallets.push({
                  address: wallet.toAddress().toUserFriendlyAddress(),
                  privateKey: master.privateKey.serialize()
              })
          }
        },
        methods: {
            async onComplete() {
                let wallet = await this.wallet
                this.$store.dispatch(ADD_WALLET_REQUEST, wallet).then(() => {
                    this.$router.push('/')
                }).catch(e => {
                    if (e === ADD_WALLET_ERROR) {
                        // Something went wrong
                    }
                })

            },
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
