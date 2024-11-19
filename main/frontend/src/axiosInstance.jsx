import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.codenexuslive.tech:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
