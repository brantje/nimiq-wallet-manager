import axios from 'axios'
const userApi = {
    login: ({username, password}) => {
        return axios({url: 'api/v1/core/user/login', data: {username: username, password: password}, method: 'POST' });
    }
}

export {userApi};