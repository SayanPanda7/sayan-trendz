import axios from 'axios';
import { getAccessToken, getDevHeaders } from './session';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  const nextHeaders = {
    ...(config.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : getDevHeaders()),
  };

  return {
    ...config,
    headers: nextHeaders,
  };
});

export async function apiRequest(url, options = {}) {
  const response = await api({
    url,
    method: options.method || 'GET',
    data: options.data,
    params: options.params,
    headers: options.headers,
  });

  return response.data;
}
