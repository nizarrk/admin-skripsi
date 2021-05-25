import axios from 'axios'

export default () => {
  return axios.create({
    // baseURL: 'https://api.pelaporan-dishub.xyz',
    baseURL: 'http://localhost:8000',
    headers: {
      'authorization': localStorage.getItem('jwt')
    }
  });
}