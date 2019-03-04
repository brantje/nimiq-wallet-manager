<template>
    <div class="nq-card walletDetail">
        <h1 class="nq-h1">
            Contact list
        </h1>
        <button class="nq-button-s" @click="addContact">
            Add contact
        </button>
        <div v-for="contact in getContacts" :key="contact._id" class="contact-list">
            <div class="contact">
                <div>
                    <Identicon :address="contact.address" size="50" class="img-responsive"></Identicon>
                </div>
                <div class="nq-label">
                    {{ contact.label }}
                </div>
                <div class="nq-text-s">
                    {{ contact.address }}
                </div>
                <div class="actions">
                    <button class="nq-button-s red" @click="deleteContact(contact)">
                        Delete
                    </button>
                    <button class="nq-button-s" @click="editContact(contact)">
                        Edit
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import store from 'store'
import {CONTACT_LIST_REQUEST} from 'store/actions/contact'
import Identicon from 'components/Identicon.vue'
import {contactApi} from 'utils/api/contact'

export default {
    name: 'Contacts',
    metaInfo: {
        title: 'Contacts'
    },
    components: {
        Identicon
    },
    computed: mapGetters(['getContacts']),
    created() {
        store.dispatch(CONTACT_LIST_REQUEST)
    },
    methods: {
        deleteContact: function (contact) {
            this.$dialog
                    .confirm('Please confirm to continue', {type: 'prompt'})
                    .then(function (dialog) {
                        contactApi.delete(contact).then(() => {
                            store.dispatch(CONTACT_LIST_REQUEST)
                            this.$notify({
                                title: 'Contact deleted',
                            })
                        }).catch((e) => {
                            this.$notify({
                                type: 'error',
                                title: 'Error during deleting contact',
                            })
                        })
                    })
                    .catch(function () {

                    })
        },
        addContact: function () {
            this.$dialog.alert('', {
                view: 'AddContactDialog', // can be set globally too
                html: true,
                animation: 'fade',
                backdropClose: true,
                message: {
                    title: 'Add contact'
                }
            }).then(() => store.dispatch(CONTACT_LIST_REQUEST)).catch(() => {})
        },
        editContact: function (contact) {
            this.$dialog.alert('', {
                view: 'AddContactDialog', // can be set globally too
                html: true,
                animation: 'fade',
                backdropClose: true,
                contact: contact,
                message: {
                    title: 'Edit contact'
                }
            }).then(() => store.dispatch(CONTACT_LIST_REQUEST)).catch(() => {})
        }
    }
}
</script>
<style scoped>


    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
        padding: 20px 15px;
    }
</style>