<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">
                Select contact
            </h1>
        </div>
        <div class="nq-card-body">
            <div v-for="contact in contacts" :key="contact._id" class="contact-list">
                <div class="contact" @click="selectContact(contact)">
                    <div>
                        <Identicon :address="contact.address" size="50" class="img-responsive"></Identicon>
                    </div>
                    <div class="nq-label">
                        {{ contact.label }}
                    </div>
                    <div class="nq-text-s">
                        {{ contact.address }}
                    </div>
                </div>
            </div>
        </div>
        <div class="nq-card-footer">
            <!--<ok-btn @click="saveWallet" :options="options" btnColor="green" v-if="wallet.label">Save</ok-btn>-->
            <cancel-btn :options="options" @click="handleDismiss()">
                Cancel
            </cancel-btn>
        </div>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js' // Include mixin
import CancelBtn from 'components/dialog/Cancel-btn.vue'
import Identicon from 'components/Identicon.vue'
import {mapGetters} from 'vuex'
import store from 'store'
import {CONTACT_LIST_REQUEST} from 'store/actions/contact'

export default {
    components: {
        CancelBtn,
        Identicon
    },
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
            this.proceed(contact.address)
        },
        handleDismiss() {
            this.cancel() // included in DialogMixin
        }
    }
}
</script>
<style scoped>
    .contact{
        cursor: pointer;
    }
</style>