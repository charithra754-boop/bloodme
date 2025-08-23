import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authAPI } from '@/services/api'

export interface User {
  id: string
  name: string
  email: string
  role: 'donor' | 'hospital' | 'admin'
  phone: string
  address: string
  location: {
    type: string
    coordinates: [number, number]
  }
  // Donor-specific fields
  bloodGroup?: string
  dateOfBirth?: string
  weight?: number
  // Hospital-specific fields
  hospitalName?: string
  licenseNumber?: string
  contactPerson?: string
  emergencyContact?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Load user data from localStorage
const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null
  try {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

// Load token from localStorage
const loadTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

const initialState: AuthState = {
  user: loadUserFromStorage(),
  token: loadTokenFromStorage(),
  isAuthenticated: !!(loadUserFromStorage() && loadTokenFromStorage()),
  loading: false,
  error: null,
}

interface LoginResponse {
  user: User
  token: string
}

export const login = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  'auth/login',
  async (credentials) => {
    const data = await authAPI.login(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data as LoginResponse
  }
)

export const register = createAsyncThunk<LoginResponse, any>(
  'auth/register',
  async (userData) => {
    const data = await authAPI.register(userData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data as LoginResponse
  }
)

export const updateProfile = createAsyncThunk<User, Partial<User>>(
  'auth/updateProfile',
  async (profileData, { getState }) => {
    const state = getState() as { auth: AuthState }
    const currentUser = state.auth.user
    
    if (!currentUser) throw new Error('No user logged in')
    
    // Merge current user data with updates
    const updatedUser = { ...currentUser, ...profileData }
    
    // Save to localStorage (since backend might be down)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    return updatedUser
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Profile update failed'
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setCredentials } = authSlice.actions
export default authSlice.reducer