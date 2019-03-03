<template>
    <div class="nq-card">
        <div class="nq-card-header">
            <h1 class="nq-h1">
{{ messageTitle }}
</h1>
        </div>
        <div class="nq-card-body">
            <div class="identicon">
                <Identicon :address="contact.address" size="64" class="img-responsive"></Identicon>
            </div>
            <div class="account-data">
                <span class="nq-label">
                    <input v-model="contact.label" type="text" placeholder="Enter a name ">
                </span>
                <div class="nq-text-s">
                    <AddressInput :address="inputAddress" :placeholder="'Enter address'" @changed="setAddress"></AddressInput>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="nq-card-footer">
            <OkBtn v-if="contact.address" :options="options" btn-color="green" @click="saveContact">
Save
</OkBtn>
            <CancelBtn :options="options" @click="handleDismiss()">
Dismiss
</CancelBtn>
        </div>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
import OkBtn from 'components/dialog/Ok-btn.vue'
import AddressInput from 'components/AddressInput.vue'
import CancelBtn from 'components/dialog/Cancel-btn.vue'
import Identicon from 'components/Identicon.vue'
import {contactApi} from 'utils/api/contact'

export default {
    components: {
        CancelBtn,
        OkBtn,
        Identicon,
        AddressInput
    },
    mixins: [DialogMixin],
    data: function () {
        return {
            inputAddress: '',
            inputLabel: ''
        }
    },
    computed: {
        contact: function () {
            if (this.options.contact) {
                this.inputAddress = this.options.contact.address
                return Object.assign({}, this.options.contact)
            }
            return {
                _id: null,
                label: '',
                address: ''
            }
        }
    },
    watch: {
        inputAddress: function (inputAddress) {
            let address
            try {
                address = Nimiq.Address.fromString(inputAddress)
            } catch (e) {
                this.contact.address = ''
            }
            if (address) {
                this.contact.address = address.toUserFriendlyAddress()
            }
        }
    },
    methods: {
        setAddress: function(address) {
            this.inputAddress = address
        },
        saveContact() {
            let method = (this.contact._id) ? 'update' : 'create'
            contactApi[method](this.contact).then(() => {
                this.$notify({
                    title: 'Contact saved',
                })
                this.proceed() // included in DialogMixin
            }).catch(() => {
                this.$notify({
                    type: 'error',
                    title: 'Please fill in all fields',
                })
            })
        },
        handleDismiss() {
            this.cancel() // included in DialogMixin
        }
    }
}
</script>
