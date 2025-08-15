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
    console.error('API Error:', error)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    
    // 🚨 HACKATHON DEMO: Check if backend is down
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.warn('🚨 Backend appears to be down, using mock data for demo')
      // Don't reject - let the API functions handle fallback
      return Promise.reject({ useMockData: true, originalError: error })
    }
    
    // Better error handling
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Network error occurred'
    
    return Promise.reject(new Error(errorMessage))
  }
)

import { mockAuthAPI, mockAlertsAPI } from './mockApi'

export const authAPI = {
  login: async (credentials: { email: string; password: string }): Promise<{ user: any; token: string }> => {
    try {
      return await api.post('/auth/login', credentials)
    } catch (error: any) {
      if (error.useMockData) {
        console.warn('🚨 Using mock login for demo')
        return await mockAuthAPI.login(credentials)
      }
      throw error
    }
  },
  
  register: async (userData: any): Promise<{ user: any; token: string }> => {
    try {
      return await api.post('/auth/register', userData)
    } catch (error: any) {
      if (error.useMockData) {
        console.warn('🚨 Using mock registration for demo')
        return await mockAuthAPI.register(userData)
      }
      throw error
    }
  },
  
  getProfile: () =>
    api.post('/auth/profile'),
}

export const alertsAPI = {
  getActiveAlerts: async () => {
    try {
      return await api.get('/alerts/active')
    } catch (error: any) {
      if (error.useMockData) {
        console.warn('🚨 Using mock alerts for demo')
        return await mockAlertsAPI.getActiveAlerts()
      }
      throw error
    }
  },
  
  getHospitalAlerts: async (status?: string) => {
    try {
      return await api.get(`/alerts/hospital${status ? `?status=${status}` : ''}`)
    } catch (error: any) {
      if (error.useMockData) {
        console.warn('🚨 Using mock hospital alerts for demo')
        return []
      }
      throw error
    }
  },
  
  createAlert: async (alertData: any) => {
    try {
      return await api.post('/alerts', alertData)
    } catch (error: any) {
      if (error.useMockData) {
        console.warn('🚨 Using mock alert creation for demo')
        return await mockAlertsAPI.createAlert(alertData)
      }
      throw error
    }
  },
  
  respondToAlert: async (alertId: string, response: any) => {
    try {
      return await api.post(`/alerts/${alertId}/respond`, response)
    } catch (error: any) {
      if (error.useMockData) {
        console.warn('🚨 Using mock alert response for demo')
        return await mockAlertsAPI.respondToAlert(alertId, response)
      }
      throw error
    }
  },
  
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