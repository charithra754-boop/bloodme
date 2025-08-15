'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  Fade,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  TrendingUp,
  People,
  LocalHospital,
  Event,
  BloodtypeOutlined,
  AccessTime,
  LocationOn,
  Refresh,
  DirectionsRun
} from '@mui/icons-material'

interface MapStatsProps {
  userRole: 'donor' | 'hospital'
}

export default function MapStats({ userRole }: MapStatsProps) {
  const [stats, setStats] = useState({
    nearbyDonors: 0,
    availableDonors: 0,
    activeAlerts: 0,
    upcomingCamps: 0,
    averageResponseTime: 0,
    bloodGroupDistribution: {} as Record<string, number>
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateMockStats()
  }, [userRole])

  const generateMockStats = () => {
    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      if (userRole === 'hospital') {
        setStats({
          nearbyDonors: Math.floor(Math.random() * 50) + 20,
          availableDonors: Math.floor(Math.random() * 30) + 10,
          activeAlerts: Math.floor(Math.random() * 8) + 2,
          upcomingCamps: Math.floor(Math.random() * 5) + 1,
          averageResponseTime: Math.floor(Math.random() * 30) + 15, // minutes
          bloodGroupDistribution: {
            'O+': Math.floor(Math.random() * 15) + 5,
            'A+': Math.floor(Math.random() * 12) + 3,
            'B+': Math.floor(Math.random() * 10) + 2,
            'AB+': Math.floor(Math.random() * 8) + 1,
            'O-': Math.floor(Math.random() * 6) + 1,
            'A-': Math.floor(Math.random() * 5) + 1,
            'B-': Math.floor(Math.random() * 4) + 1,
            'AB-': Math.floor(Math.random() * 3) + 1
          }
        })
      } else {
        setStats({
          nearbyDonors: 0, // Not relevant for donors
          availableDonors: 0,
          activeAlerts: Math.floor(Math.random() * 5) + 1,
          upcomingCamps: Math.floor(Math.random() * 8) + 3,
          averageResponseTime: Math.floor(Math.random() * 20) + 10, // minutes to reach
          bloodGroupDistribution: {} // Not relevant for donors
        })
      }
      setLoading(false)
    }, 1000)
  }

  const refreshStats = () => {
    generateMockStats()
  }

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📊 Live Map Statistics
            <Chip 
              label="Real-time" 
              color="success" 
              size="small" 
              sx={{ animation: 'pulse 2s infinite' }}
            />
          </Typography>
          <Tooltip title="Refresh Statistics">
            <IconButton onClick={refreshStats} disabled={loading}>
              <Refresh sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {userRole === 'hospital' ? (
            <>
              {/* Hospital Stats */}
              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={600}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', margin: '0 auto', mb: 1 }}>
                        <People />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.nearbyDonors}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Nearby Donors
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Within 10km radius
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={800}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', margin: '0 auto', mb: 1 }}>
                        <BloodtypeOutlined />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.availableDonors}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Available Now
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Ready to donate
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={1000}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', margin: '0 auto', mb: 1 }}>
                        <AccessTime />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.averageResponseTime}m
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Avg Response
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Time to respond
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Fade in timeout={1200}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', margin: '0 auto', mb: 1 }}>
                        <Event />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.upcomingCamps}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Blood Camps
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        This month
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Blood Group Distribution */}
              <Grid item xs={12}>
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      🩸 Blood Group Distribution (Available Donors)
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(stats.bloodGroupDistribution).map(([bloodGroup, count], index) => (
                        <Grid item xs={6} sm={3} key={bloodGroup}>
                          <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" fontWeight="medium">
                                {bloodGroup}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {count} donors
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={(count / Math.max(...Object.values(stats.bloodGroupDistribution))) * 100}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'][index % 8]
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : (
            <>
              {/* Donor Stats */}
              <Grid item xs={12} sm={6} md={4}>
                <Fade in timeout={600}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', margin: '0 auto', mb: 1 }}>
                        🚨
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.activeAlerts}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Emergency Alerts
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Near your location
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Fade in timeout={800}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', margin: '0 auto', mb: 1 }}>
                        <Event />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.upcomingCamps}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Donation Camps
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        This month
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Fade in timeout={1000}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', margin: '0 auto', mb: 1 }}>
                        <DirectionsRun />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.averageResponseTime}m
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Avg Travel Time
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        To nearest hospital
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}