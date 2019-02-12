import axios from 'axios'

const contactApi = {
    list: () => {
        return axios({url: '/api/v1/core/contacts'});
    },
    create: (contact) => {
        return axios({url: `/api/v1/core/contacts/`, data: contact, method: 'POST'});
    },
    update: (contact) => {
        return axios({url: `/api/v1/core/contacts/${contact._id}`, data: contact, method: 'PATCH'});
    },
    delete: (contact) => {
        return axios({url: `/api/v1/core/contacts/${contact._id}`, method: 'DELETE'});
    },
}

export {contactApi};