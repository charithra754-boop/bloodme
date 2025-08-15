import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { alertsAPI } from '@/services/api'

export interface Alert {
  _id: string
  hospitalId: any
  bloodGroup: string
  unitsNeeded: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled'
  patientCondition: string
  additionalNotes?: string
  requiredBy: string
  searchRadius: number
  responses: any[]
  notifiedDonors: string[]
  unitsCollected: number
  expiresAt: string
  isEmergency: boolean
  createdAt: string
  updatedAt: string
}

interface AlertsState {
  alerts: Alert[]
  activeAlerts: Alert[]
  hospitalAlerts: Alert[]
  loading: boolean
  error: string | null
}

const initialState: AlertsState = {
  alerts: [],
  activeAlerts: [],
  hospitalAlerts: [],
  loading: false,
  error: null,
}

export const fetchActiveAlerts = createAsyncThunk<any[]>(
  'alerts/fetchActive',
  async () => {
    const response = await alertsAPI.getActiveAlerts()
    return Array.isArray(response) ? response : []
  }
)

export const fetchHospitalAlerts = createAsyncThunk<any[], string | undefined>(
  'alerts/fetchHospital',
  async (status?: string) => {
    const response = await alertsAPI.getHospitalAlerts(status)
    return Array.isArray(response) ? response : []
  }
)

export const createAlert = createAsyncThunk<any, any>(
  'alerts/create',
  async (alertData: any) => {
    const response = await alertsAPI.createAlert(alertData)
    return response
  }
)

export const respondToAlert = createAsyncThunk<any, { alertId: string; response: any }>(
  'alerts/respond',
  async ({ alertId, response }: { alertId: string; response: any }) => {
    const result = await alertsAPI.respondToAlert(alertId, response)
    return result
  }
)

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    addAlert: (state, action) => {
      state.activeAlerts.unshift(action.payload)
    },
    updateAlert: (state, action) => {
      const index = state.activeAlerts.findIndex(alert => alert._id === action.payload._id)
      if (index !== -1) {
        state.activeAlerts[index] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active alerts
      .addCase(fetchActiveAlerts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchActiveAlerts.fulfilled, (state, action) => {
        state.loading = false
        state.activeAlerts = action.payload
      })
      .addCase(fetchActiveAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch alerts'
      })
      // Fetch hospital alerts
      .addCase(fetchHospitalAlerts.fulfilled, (state, action) => {
        state.hospitalAlerts = action.payload
      })
      // Create alert
      .addCase(createAlert.fulfilled, (state, action) => {
        state.hospitalAlerts.unshift(action.payload)
        state.activeAlerts.unshift(action.payload)
      })
      // Respond to alert
      .addCase(respondToAlert.fulfilled, (state, action) => {
        const payload = action.payload as any
        if (payload && payload._id) {
          const index = state.activeAlerts.findIndex(alert => alert._id === payload._id)
          if (index !== -1) {
            state.activeAlerts[index] = payload
          }
        }
      })
  },
})

export const { clearError, addAlert, updateAlert } = alertsSlice.actions
export default alertsSlice.reducer