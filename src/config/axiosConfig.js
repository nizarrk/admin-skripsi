import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'https://api.pelaporan-dishub.xyz',
    headers: {
      'authorization': localStorage.getItem('jwt')
    }
  });
}