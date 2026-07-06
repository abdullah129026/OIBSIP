import axios from 'axios';

const TOKEN_KEY = 'pizzacrave_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const FALLBACK_ERROR = 'Something went wrong. Please try again.';

const unwrap = (res) => res.data?.data ?? res.data;

const toMessage = (err) =>
  err.response?.data?.error ?? err.message ?? FALLBACK_ERROR;

const request = async (promise) => {
  try {
    return { data: unwrap(await promise), error: null };
  } catch (err) {
    return { data: null, error: toMessage(err) };
  }
};

export const registerUser = (payload) => request(api.post('/auth/register', payload));
export const loginUser = (payload) => request(api.post('/auth/login', payload));
export const adminLoginUser = (payload) => request(api.post('/auth/admin/login', payload));
export const verifyEmail = (token) => request(api.get(`/auth/verify/${token}`));
export const forgotPassword = (payload) => request(api.post('/auth/forgot-password', payload));
export const resetPassword = (token, payload) =>
  request(api.post(`/auth/reset-password/${token}`, payload));
export const fetchMe = () => request(api.get('/auth/me'));

export const fetchPizzas = () => request(api.get('/pizzas'));
export const fetchBuilderOptions = () => request(api.get('/inventory/options'));
export const fetchInventory = () => request(api.get('/inventory'));
export const updateInventory = (id, payload) => request(api.patch(`/inventory/${id}`, payload));

export const fetchMyOrders = () => request(api.get('/orders/mine'));
export const fetchAllOrders = () => request(api.get('/orders'));
export const updateOrderStatus = (id, status) => request(api.patch(`/orders/${id}/status`, { status }));

export const createPaymentOrder = (selection) =>
  request(api.post('/payment/create-order', { selection }));
export const verifyPayment = (payload) => request(api.post('/payment/verify', payload));

export default api;
