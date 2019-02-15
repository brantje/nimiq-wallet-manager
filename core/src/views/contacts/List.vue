<template>
    <div class="nq-card walletDetail">
        <h3 class="nq-label">Contact list</h3>
        <button class="nq-button-s" @click="addContact">Add contact</button>
        <div class="contact-list" v-for="contact in getContacts">
            <div class="contact">
                <div>
                    <Identicon :address="contact.address" size="50" class="img-responsive"></Identicon>
                </div>
                <div class="nq-label">{{ contact.label }}</div>
                <div class="nq-text-s">{{ contact.address }}</div>
                <div class="actions">
                    <button class="nq-button-s red" @click="deleteContact(contact)">Delete</button>
                    <button class="nq-button-s" @click="editContact(contact)">Edit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import store from 'store'
    import {CONTACT_LIST_REQUEST} from 'store/actions/contact'
    import Identicon from "components/Identicon.vue"
    import {contactApi} from 'utils/api/contact'

    export default {
        name: "Contacts",
        metaInfo: {
            title: 'Contacts'
        },
        computed: mapGetters(['getContacts']),
        created() {
            store.dispatch(CONTACT_LIST_REQUEST)
        },
        data() {
            return {};
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
                            });
                        }).catch((e) => {
                            this.$notify({
                                type: 'error',
                                title: 'Error during deleting contact',
                            });
                        })
                    })
                    .catch(function () {

                    });
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
        },
        components: {
            Identicon
        }
    };
</script>
<style scoped>
    .contact-list .contact {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .contact-list .contact .actions {
        margin-top: 12px;
    }

    .contact-list .contact div:first-child {
        width: 10%;
        min-width: 55px;
    }

    .contact-list .contact div:nth-child(2) {
        width: 20%
    }

    .contact-list .contact div:nth-child(3) {
        width: 40%
    }

    .nq-card {
        position: relative;
        width: calc(100% - 30px);
        max-width: none;
        padding: 20px 15px;
    }
</style>