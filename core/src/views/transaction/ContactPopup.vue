<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">Select contact</h1>
        </div>
        <div class="nq-card-body">
            <div class="contact-list" v-for="contact in contacts">
                <div class="contact" @click="selectContact(contact)">
                    <div>
                        <Identicon :address="contact.address" size="50" class="img-responsive"></Identicon>
                    </div>
                    <div class="nq-label">{{ contact.label }}</div>
                    <div class="nq-text-s">{{ contact.address }}</div>
                </div>
            </div>
        </div>
        <div class="nq-card-footer">
            <!--<ok-btn @click="saveWallet" :options="options" btnColor="green" v-if="wallet.label">Save</ok-btn>-->
            <cancel-btn @click="handleDismiss()" :options="options">Cancel</cancel-btn>
        </div>
    </div>
</template>

<script>
    import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'; // Include mixin
    import OkBtn from 'components/dialog/Ok-btn.vue';
    import CancelBtn from 'components/dialog/Cancel-btn.vue';
    import Identicon from 'components/Identicon.vue'
    import {mapGetters} from 'vuex'
    import store from 'store'
    import {CONTACT_LIST_REQUEST} from 'store/actions/contact'

    export default {
        mixins: [DialogMixin],
        data: function () {
            return {

            }
        },
        computed: {
            contacts: function () {
                return [...store.state.wallet.wallets, ...store.state.contact.contacts]
            }
        },
        created() {
            store.dispatch(CONTACT_LIST_REQUEST)
        },
        methods: {
            selectContact: function (contact) {
                this.proceed(contact.address);
            },
            handleDismiss() {
                this.cancel(); // included in DialogMixin
            }
        },
        components: {
            CancelBtn,
            OkBtn,
            Identicon
        }
    };
</script>
<style scoped>
    .contact{
        cursor: pointer;
    }
</style>