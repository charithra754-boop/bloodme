'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material'
import { Add, LocalHospital, Notifications, TrendingUp } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '@/store'
import { fetchHospitalAlerts, createAlert } from '@/store/slices/alertsSlice'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const priorities = [
  { value: 'low', label: 'Low', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' },
  { value: 'critical', label: 'Critical', color: 'error' }
]

interface CreateAlertForm {
  bloodGroup: string
  unitsNeeded: number
  priority: string
  patientCondition: string
  additionalNotes: string
  requiredBy: string
  searchRadius: number
  isEmergency: boolean
}

export default function HospitalDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { hospitalAlerts, loading } = useSelector((state: RootState) => state.alerts)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateAlertForm>()

  useEffect(() => {
    dispatch(fetchHospitalAlerts())
  }, [dispatch])

  const onCreateAlert = async (data: CreateAlertForm) => {
    try {
      await dispatch(createAlert({
        ...data,
        requiredBy: new Date(data.requiredBy).toISOString(),
      })).unwrap()
      
      toast.success('Alert created successfully!')
      setCreateDialogOpen(false)
      reset()
      dispatch(fetchHospitalAlerts())
    } catch (error: any) {
      toast.error(error.message || 'Failed to create alert')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary'
      case 'fulfilled': return 'success'
      case 'expired': return 'error'
      case 'cancelled': return 'default'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    const p = priorities.find(p => p.value === priority)
    return p?.color || 'default'
  }

  const activeAlerts = hospitalAlerts.filter(alert => alert.status === 'active')
  const totalResponses = hospitalAlerts.reduce((sum, alert) => sum + alert.responses.length, 0)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Hospital Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          Create Alert
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Notifications color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{activeAlerts.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{totalResponses}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Responses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalHospital color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{hospitalAlerts.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Alerts
          </Typography>
          
          {hospitalAlerts.length === 0 ? (
            <Alert severity="info">
              No alerts created yet. Click "Create Alert" to get started.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {hospitalAlerts.slice(0, 10).map((alert) => (
                <Grid item xs={12} key={alert._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Box>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Chip 
                              label={alert.bloodGroup} 
                              color="error" 
                              size="small" 
                            />
                            <Chip 
                              label={alert.priority} 
                              color={getPriorityColor(alert.priority) as any}
                              size="small" 
                            />
                            <Chip 
                              label={alert.status} 
                              color={getStatusColor(alert.status) as any}
                              size="small" 
                            />
                          </Box>
                          <Typography variant="subtitle1" gutterBottom>
                            {alert.patientCondition}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {alert.unitsNeeded} units needed • {alert.responses.length} responses
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Create Alert Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Blood Donation Alert</DialogTitle>
        <form onSubmit={handleSubmit(onCreateAlert)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    {...register('bloodGroup', { required: 'Blood group is required' })}
                    label="Blood Group"
                    error={!!errors.bloodGroup}
                  >
                    {bloodGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Units Needed"
                  type="number"
                  {...register('unitsNeeded', { 
                    required: 'Units needed is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  error={!!errors.unitsNeeded}
                  helperText={errors.unitsNeeded?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    {...register('priority', { required: 'Priority is required' })}
                    label="Priority"
                    error={!!errors.priority}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Search Radius (km)"
                  type="number"
                  defaultValue={5}
                  {...register('searchRadius', { 
                    min: { value: 1, message: 'Must be at least 1 km' },
                    max: { value: 50, message: 'Must be less than 50 km' }
                  })}
                  error={!!errors.searchRadius}
                  helperText={errors.searchRadius?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Patient Condition"
                  {...register('patientCondition', { required: 'Patient condition is required' })}
                  error={!!errors.patientCondition}
                  helperText={errors.patientCondition?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Required By"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  {...register('requiredBy', { required: 'Required by date is required' })}
                  error={!!errors.requiredBy}
                  helperText={errors.requiredBy?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={3}
                  {...register('additionalNotes')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Alert
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}