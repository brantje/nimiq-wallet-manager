import axios from 'axios'
const userApi = {
    login: ({username, password}) => {
        return axios({url: '/api/v1/core/user/login', data: {username: username, password: password}, method: 'POST' });
    },
    register: (newUser) => {
        return axios({url: '/api/v1/core/user/register', data: newUser, method: 'POST' });
    },
    current: () => {
        return axios({url: '/api/v1/core/user/current', method: 'GET',  headers: { 'Content-Type': 'application/json' }});
    }
}

export {userApi};