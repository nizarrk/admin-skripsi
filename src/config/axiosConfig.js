import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://192.168.1.4:3000',
    headers: {
      'authorization': localStorage.getItem('jwt')
    }
  });
}