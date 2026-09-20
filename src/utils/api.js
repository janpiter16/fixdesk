import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fixdesk-auth')
  if (token) {
    const { state } = JSON.parse(token)
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  me: () => apiClient.get('/auth/me'),
}

export const ticketApi = {
  create: (data) => apiClient.post('/tickets', data),
  getAll: (params) => apiClient.get('/tickets', { params }),
  getById: (id) => apiClient.get(`/tickets/${id}`),
  updateStatus: (id, status) => apiClient.patch(`/tickets/${id}/status`, { status }),
  assign: (id, assigned_to) => apiClient.patch(`/tickets/${id}/assign`, { assigned_to }),
  track: (token) => axios.get(`${API_BASE_URL}/tickets/track/${token}`),
}

export const customerApi = {
  getAll: () => apiClient.get('/customers'),
  getById: (id) => apiClient.get(`/customers/${id}`),
  create: (data) => apiClient.post('/customers', data),
  update: (id, data) => apiClient.patch(`/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
}

export const deviceApi = {
  getAll: (params) => apiClient.get('/devices', { params }),
  getById: (id) => apiClient.get(`/devices/${id}`),
  create: (data) => apiClient.post('/devices', data),
  update: (id, data) => apiClient.patch(`/devices/${id}`, data),
  getCategories: () => apiClient.get('/devices/categories'),
}

export default apiClient
