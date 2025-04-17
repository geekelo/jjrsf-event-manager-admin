import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn('⚠️ VITE_API_BASE_URL is not defined in your .env file.');
}

export const createAxiosInstance = () => {
  const token = sessionStorage.getItem('admin_token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
