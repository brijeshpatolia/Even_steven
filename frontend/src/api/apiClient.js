// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  //baseURL: 'http://localhost:8000/api/v1',
  baseURL: 'https://even-steven-jhyx.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
