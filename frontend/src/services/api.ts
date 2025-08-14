import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  getProfile: () =>
    api.post('/auth/profile'),
}

export const alertsAPI = {
  getActiveAlerts: () =>
    api.get('/alerts/active'),
  
  getHospitalAlerts: (status?: string) =>
    api.get(`/alerts/hospital${status ? `?status=${status}` : ''}`),
  
  createAlert: (alertData: any) =>
    api.post('/alerts', alertData),
  
  respondToAlert: (alertId: string, response: any) =>
    api.post(`/alerts/${alertId}/respond`, response),
  
  updateAlertStatus: (alertId: string, status: string) =>
    api.patch(`/alerts/${alertId}/status`, { status }),
}

export const donorsAPI = {
  getProfile: () =>
    api.get('/donors/profile'),
  
  updateProfile: (data: any) =>
    api.patch('/donors/profile', data),
  
  getDonationHistory: () =>
    api.get('/donors/history'),
}

export const hospitalsAPI = {
  getProfile: () =>
    api.get('/hospitals/profile'),
  
  updateProfile: (data: any) =>
    api.patch('/hospitals/profile', data),
  
  updateInventory: (inventory: any) =>
    api.patch('/hospitals/inventory', inventory),
}

export default api