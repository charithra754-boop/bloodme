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
  Alert,
  LinearProgress,
  Avatar,
  Paper,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  Badge,
  Divider
} from '@mui/material'
import { 
  Favorite, 
  Notifications, 
  EmojiEvents,
  LocationOn,
  Phone,
  CheckCircle,
  Cancel,
  BloodtypeOutlined,
  Emergency,
  Schedule,
  TrendingUp,
  Star,
  LocalHospital,
  Refresh,
  VolunteerActivism,
  Timeline,
  CardGiftcard
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '@/store'
import { fetchActiveAlerts, respondToAlert } from '@/store/slices/alertsSlice'
import FloatingActionButton from '@/components/FloatingActionButton'

interface RespondForm {
  status: string
  estimatedArrival: string
  notes: string
}

export default function DonorDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { activeAlerts, loading } = useSelector((state: RootState) => state.alerts)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [respondDialogOpen, setRespondDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RespondForm>()

  useEffect(() => {
    dispatch(fetchActiveAlerts())
    // Set up polling for new alerts
    const interval = setInterval(() => {
      dispatch(fetchActiveAlerts())
    }, 30000) // Poll every 30 seconds
    
    return () => clearInterval(interval)
  }, [dispatch])

  const handleRespond = (alert: any) => {
    setSelectedAlert(alert)
    setRespondDialogOpen(true)
  }

  const onSubmitResponse = async (data: RespondForm) => {
    if (!selectedAlert) return
    
    try {
      await dispatch(respondToAlert({
        alertId: selectedAlert._id,
        response: {
          ...data,
          estimatedArrival: data.estimatedArrival ? new Date(data.estimatedArrival).toISOString() : undefined
        }
      })).unwrap()
      
      toast.success('Response submitted successfully!')
      setRespondDialogOpen(false)
      reset()
      dispatch(fetchActiveAlerts())
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit response')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error'
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getTimeUrgency = (requiredBy: string) => {
    const now = new Date()
    const required = new Date(requiredBy)
    const hoursLeft = (required.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (hoursLeft < 2) return { text: 'URGENT - Less than 2 hours', color: 'error' }
    if (hoursLeft < 6) return { text: `${Math.floor(hoursLeft)} hours left`, color: 'warning' }
    return { text: `${Math.floor(hoursLeft)} hours left`, color: 'success' }
  }

  // Mock donor stats - in real app, fetch from API
  const donorStats = {
    totalDonations: 5,
    rewardPoints: 250,
    tier: 'Silver',
    nextTierPoints: 500,
    livesImpacted: 15
  }

  const progressToNextTier = (donorStats.rewardPoints / donorStats.nextTierPoints) * 100

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Enhanced Header */}
      <Fade in timeout={800}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}
              >
                <VolunteerActivism fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Life Saver Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Welcome back, {user?.name}! 🦸‍♀️
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mt={1}>
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Eligible Donor" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(76,175,80,0.8)', color: 'white' }}
                  />
                  <Chip 
                    icon={<Star />} 
                    label={`${donorStats.tier} Member`} 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,193,7,0.8)', color: 'white' }}
                  />
                </Box>
              </Box>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {donorStats.livesImpacted}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                💝 Lives Impacted
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                You're a hero! 🌟
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={600}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {donorStats.totalDonations}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      🩸 Blood Donations
                    </Typography>
                  </Box>
                  <Badge badgeContent={donorStats.totalDonations} color="error">
                    <Favorite sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Badge>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <TrendingUp sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="caption">
                    {donorStats.totalDonations > 0 ? 'Keep up the great work!' : 'Ready to start saving lives?'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={800}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {donorStats.rewardPoints}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      ⭐ Reward Points
                    </Typography>
                  </Box>
                  <EmojiEvents sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(donorStats.rewardPoints / donorStats.nextTierPoints) * 100} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                  }}
                />
              </CardContent>
            </Card>
          </Grow>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={1000}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {donorStats.livesImpacted}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      💝 Lives Saved
                    </Typography>
                  </Box>
                  <VolunteerActivism sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Star sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="caption">
                    You're making a difference!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={1200}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      🏆 {donorStats.tier} Tier
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Next: Gold Level
                    </Typography>
                  </Box>
                  <CardGiftcard sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progressToNextTier} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'rgba(255,255,255,0.8)' }
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {donorStats.nextTierPoints - donorStats.rewardPoints} points to go
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Active Alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Active Blood Donation Alerts Near You
          </Typography>
          
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          
          {activeAlerts.length === 0 ? (
            <Alert severity="info">
              No active alerts in your area right now. We'll notify you when blood is needed!
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {activeAlerts.map((alert) => {
                const urgency = getTimeUrgency(alert.requiredBy)
                const hasResponded = alert.responses.some((r: any) => r.donorId === user?.id)
                
                return (
                  <Grid item xs={12} key={alert._id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        border: alert.priority === 'critical' ? '2px solid #f44336' : undefined,
                        backgroundColor: alert.priority === 'critical' ? '#ffebee' : undefined
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                              <Chip 
                                label={alert.bloodGroup} 
                                color="error" 
                                size="small" 
                              />
                              <Chip 
                                label={alert.priority.toUpperCase()} 
                                color={getPriorityColor(alert.priority) as any}
                                size="small" 
                              />
                              <Chip 
                                label={urgency.text}
                                color={urgency.color as any}
                                size="small" 
                              />
                              {alert.isEmergency && (
                                <Chip 
                                  label="EMERGENCY" 
                                  color="error" 
                                  size="small"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              )}
                            </Box>
                            
                            <Typography variant="h6" gutterBottom>
                              {alert.patientCondition}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Box display="flex" alignItems="center">
                                <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2">
                                  {alert.hospitalId?.hospitalName || 'Hospital'}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {alert.unitsNeeded} units needed
                              </Typography>
                            </Box>
                            
                            {alert.additionalNotes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {alert.additionalNotes}
                              </Typography>
                            )}
                            
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                              Posted {new Date(alert.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          
                          <Box ml={2}>
                            {hasResponded ? (
                              <Chip 
                                label="Responded" 
                                color="success" 
                                icon={<CheckCircle />}
                              />
                            ) : (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleRespond(alert)}
                                startIcon={<Favorite />}
                              >
                                Respond
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog 
        open={respondDialogOpen} 
        onClose={() => setRespondDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Respond to Blood Donation Alert</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitResponse)}>
          <DialogContent>
            {selectedAlert && (
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedAlert.patientCondition}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAlert.bloodGroup} • {selectedAlert.unitsNeeded} units needed
                </Typography>
              </Box>
            )}
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Your Response</InputLabel>
              <Select
                {...register('status', { required: 'Response is required' })}
                label="Your Response"
                error={!!errors.status}
              >
                <MenuItem value="accepted">✅ I can donate</MenuItem>
                <MenuItem value="declined">❌ Cannot donate right now</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              fullWidth
              label="Estimated Arrival (if accepting)"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              {...register('estimatedArrival')}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              placeholder="Any additional information..."
              {...register('notes')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRespondDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit Response
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Floating Action Button */}
      <FloatingActionButton
        userRole="donor"
        onRefresh={() => dispatch(fetchActiveAlerts())}
        onNotifications={() => toast.info('Notifications feature coming soon!')}
      />
    </Container>
  )
}