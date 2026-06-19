import axios from 'axios';
import { toast } from 'react-toastify';
import { store } from '../store';
import { logoutRequest } from '../features/auth/authSlice';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      store.dispatch(logoutRequest());
      
      toast.error('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;