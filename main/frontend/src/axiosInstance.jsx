import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.53.152.19:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
