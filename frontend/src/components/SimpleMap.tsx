'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Grid,
  Paper
} from '@mui/material'
import {
  MyLocation,
  Navigation,
  LocalHospital,
  BloodtypeOutlined,
  Event,
  Person,
  Refresh,
  Phone,
  DirectionsRun
} from '@mui/icons-material'

interface MapMarker {
  id: string
  type: 'donor' | 'hospital' | 'camp' | 'alert'
  position: [number, number]
  data: any
}

interface SimpleMapProps {
  userRole: 'donor' | 'hospital'
  userLocation?: [number, number]
  height?: number
}

export default function SimpleMap({ userRole, userLocation = [40.7128, -74.0060], height = 500 }: SimpleMapProps) {
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)

  useEffect(() => {
    generateMockData()
  }, [userRole])

  const generateMockData = () => {
    const mockMarkers: MapMarker[] = []
    
    if (userRole === 'hospital') {
      // Generate nearby donors for hospital view
      for (let i = 0; i < 12; i++) {
        const lat = userLocation[0] + (Math.random() - 0.5) * 0.1
        const lng = userLocation[1] + (Math.random() - 0.5) * 0.1
        mockMarkers.push({
          id: `donor-${i}`,
          type: 'donor',
          position: [lat, lng],
          data: {
            name: `Donor ${i + 1}`,
            bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
            lastDonation: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            isAvailable: Math.random() > 0.3,
            distance: Math.random() * 10,
            phone: '+1-555-' + Math.floor(Math.random() * 9000 + 1000),
            donations: Math.floor(Math.random() * 20) + 1
          }
        })
      }
      
      // Generate blood camps
      for (let i = 0; i < 4; i++) {
        const lat = userLocation[0] + (Math.random() - 0.5) * 0.15
        const lng = userLocation[1] + (Math.random() - 0.5) * 0.15
        mockMarkers.push({
          id: `camp-${i}`,
          type: 'camp',
          position: [lat, lng],
          data: {
            name: `Blood Drive ${i + 1}`,
            organizer: ['Red Cross', 'City Hospital', 'Community Center', 'University'][Math.floor(Math.random() * 4)],
            date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            expectedDonors: Math.floor(Math.random() * 100) + 50,
            address: `${Math.floor(Math.random() * 999) + 1} Main St`,
            distance: Math.random() * 15
          }
        })
      }
    } else {
      // Generate nearby hospitals for donor view
      for (let i = 0; i < 6; i++) {
        const lat = userLocation[0] + (Math.random() - 0.5) * 0.12
        const lng = userLocation[1] + (Math.random() - 0.5) * 0.12
        mockMarkers.push({
          id: `hospital-${i}`,
          type: 'hospital',
          position: [lat, lng],
          data: {
            name: `${['City', 'General', 'Memorial', 'St. Mary\'s', 'Regional', 'Community'][i]} Hospital`,
            urgentNeeds: ['A+', 'O-', 'AB+'][Math.floor(Math.random() * 3)],
            distance: Math.random() * 15,
            phone: '+1-555-' + Math.floor(Math.random() * 9000 + 1000),
            activeAlerts: Math.floor(Math.random() * 5),
            rating: 4 + Math.random()
          }
        })
      }
      
      // Generate active alerts
      for (let i = 0; i < 3; i++) {
        const lat = userLocation[0] + (Math.random() - 0.5) * 0.08
        const lng = userLocation[1] + (Math.random() - 0.5) * 0.08
        mockMarkers.push({
          id: `alert-${i}`,
          type: 'alert',
          position: [lat, lng],
          data: {
            hospitalName: `Emergency Hospital ${i + 1}`,
            bloodGroup: ['A+', 'O-', 'AB+', 'B-'][Math.floor(Math.random() * 4)],
            priority: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)],
            unitsNeeded: Math.floor(Math.random() * 5) + 1,
            timeLeft: Math.floor(Math.random() * 6) + 1,
            distance: Math.random() * 8
          }
        })
      }
      
      // Generate blood camps for donors
      for (let i = 0; i < 5; i++) {
        const lat = userLocation[0] + (Math.random() - 0.5) * 0.1
        const lng = userLocation[1] + (Math.random() - 0.5) * 0.1
        mockMarkers.push({
          id: `camp-donor-${i}`,
          type: 'camp',
          position: [lat, lng],
          data: {
            name: `Donation Camp ${i + 1}`,
            organizer: ['Red Cross', 'Blood Bank', 'Community Center'][Math.floor(Math.random() * 3)],
            date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
            incentives: ['Free Health Checkup', 'Gift Card', 'Certificate', 'Refreshments'][Math.floor(Math.random() * 4)],
            distance: Math.random() * 12
          }
        })
      }
    }
    
    setMarkers(mockMarkers)
  }

  const handleNavigate = (position: [number, number]) => {
    const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${position[0]},${position[1]}`
    window.open(url, '_blank')
  }

  const getMarkerIcon = (type: string, data?: any) => {
    switch (type) {
      case 'donor':
        return data?.isAvailable ? '🩸' : '⚫'
      case 'hospital':
        return '🏥'
      case 'camp':
        return '🏕️'
      case 'alert':
        return '🚨'
      default:
        return '📍'
    }
  }

  const getMarkerColor = (type: string, data?: any) => {
    switch (type) {
      case 'donor':
        return data?.isAvailable ? '#4caf50' : '#9e9e9e'
      case 'hospital':
        return '#f44336'
      case 'camp':
        return '#2196f3'
      case 'alert':
        return data?.priority === 'critical' ? '#d32f2f' : '#ff9800'
      default:
        return '#757575'
    }
  }

  const renderMarkerCard = (marker: MapMarker) => {
    const { type, data } = marker

    return (
      <Card 
        key={marker.id}
        sx={{ 
          mb: 2, 
          cursor: 'pointer',
          border: selectedMarker?.id === marker.id ? '2px solid #2196f3' : '1px solid #e0e0e0',
          '&:hover': { 
            boxShadow: 3,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease'
          }
        }}
        onClick={() => setSelectedMarker(marker)}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar 
              sx={{ 
                bgcolor: getMarkerColor(type, data),
                width: 40,
                height: 40
              }}
            >
              {getMarkerIcon(type, data)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                {type === 'donor' ? data.name :
                 type === 'hospital' ? data.name :
                 type === 'camp' ? data.name :
                 type === 'alert' ? data.hospitalName : 'Unknown'}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {type === 'donor' && (
                  <>
                    <Chip label={data.bloodGroup} color="error" size="small" />
                    <Chip 
                      label={data.isAvailable ? 'Available' : 'Not Available'} 
                      color={data.isAvailable ? 'success' : 'default'} 
                      size="small" 
                    />
                  </>
                )}
                {type === 'hospital' && (
                  <>
                    <Chip label={`Urgent: ${data.urgentNeeds}`} color="error" size="small" />
                    <Chip label={`${data.activeAlerts} Alerts`} color="warning" size="small" />
                  </>
                )}
                {type === 'camp' && (
                  <Chip label={data.organizer} color="primary" size="small" />
                )}
                {type === 'alert' && (
                  <>
                    <Chip label={data.bloodGroup} color="error" size="small" />
                    <Chip label={data.priority.toUpperCase()} color="error" size="small" />
                  </>
                )}
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            📍 {data.distance?.toFixed(1)} km away
          </Typography>

          {type === 'donor' && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                🩸 {data.donations} donations completed
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                📅 Last donation: {data.lastDonation.toLocaleDateString()}
              </Typography>
            </>
          )}

          {type === 'hospital' && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ⭐ Rating: {data.rating.toFixed(1)}/5.0
            </Typography>
          )}

          {type === 'camp' && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                📅 Date: {data.date.toLocaleDateString()}
              </Typography>
              {data.incentives && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  🎁 Incentive: {data.incentives}
                </Typography>
              )}
              {data.expectedDonors && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  👥 Expected: {data.expectedDonors} donors
                </Typography>
              )}
            </>
          )}

          {type === 'alert' && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                🩸 {data.unitsNeeded} units needed
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ⏰ {data.timeLeft} hours remaining
              </Typography>
            </>
          )}

          <Box display="flex" gap={1} mt={2}>
            {(type === 'donor' || type === 'hospital') && (
              <Button 
                size="small" 
                variant="contained" 
                startIcon={<Phone />}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`tel:${data.phone}`)
                }}
              >
                Call
              </Button>
            )}
            {type === 'alert' && userRole === 'donor' && (
              <Button 
                size="small" 
                variant="contained" 
                color="error"
                startIcon={<BloodtypeOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle response
                }}
              >
                I Can Help!
              </Button>
            )}
            {type === 'camp' && (
              <Button 
                size="small" 
                variant="contained" 
                startIcon={<Event />}
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle registration
                }}
              >
                Register
              </Button>
            )}
            <Button 
              size="small" 
              variant="outlined" 
              startIcon={<Navigation />}
              onClick={(e) => {
                e.stopPropagation()
                handleNavigate(marker.position)
              }}
            >
              Navigate
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const groupedMarkers = {
    donors: markers.filter(m => m.type === 'donor'),
    hospitals: markers.filter(m => m.type === 'hospital'),
    camps: markers.filter(m => m.type === 'camp'),
    alerts: markers.filter(m => m.type === 'alert')
  }

  return (
    <Card sx={{ height, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            🗺️ Interactive Location Map
          </Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh locations">
              <IconButton onClick={generateMockData} size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="My location">
              <IconButton size="small">
                <MyLocation />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {userRole === 'hospital' 
            ? 'Find available donors and blood camps in your area'
            : 'Discover hospitals, emergency alerts, and donation opportunities nearby'
          }
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ height: height - 100, overflow: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          {/* Your Location */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white', mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  📍
                </Avatar>
                <Box>
                  <Typography variant="h6">Your Location</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {userRole === 'hospital' ? '🏥 Hospital' : '🩸 Donor'} • New York, NY
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Emergency Alerts (for donors) */}
          {userRole === 'donor' && groupedMarkers.alerts.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main', fontWeight: 'bold' }}>
                🚨 Emergency Alerts ({groupedMarkers.alerts.length})
              </Typography>
              {groupedMarkers.alerts.map(renderMarkerCard)}
            </Grid>
          )}

          {/* Available Donors (for hospitals) */}
          {userRole === 'hospital' && groupedMarkers.donors.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'success.main', fontWeight: 'bold' }}>
                🩸 Available Donors ({groupedMarkers.donors.filter(d => d.data.isAvailable).length}/{groupedMarkers.donors.length})
              </Typography>
              {groupedMarkers.donors.filter(d => d.data.isAvailable).slice(0, 6).map(renderMarkerCard)}
            </Grid>
          )}

          {/* Nearby Hospitals (for donors) */}
          {userRole === 'donor' && groupedMarkers.hospitals.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main', fontWeight: 'bold' }}>
                🏥 Nearby Hospitals ({groupedMarkers.hospitals.length})
              </Typography>
              {groupedMarkers.hospitals.map(renderMarkerCard)}
            </Grid>
          )}

          {/* Blood Camps */}
          {groupedMarkers.camps.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                🏕️ Blood Donation Camps ({groupedMarkers.camps.length})
              </Typography>
              {groupedMarkers.camps.map(renderMarkerCard)}
            </Grid>
          )}
        </Grid>

        {/* Legend */}
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            📋 Legend
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                <Typography variant="caption">Available</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                <Typography variant="caption">Emergency</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2196f3' }} />
                <Typography variant="caption">Events</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9e9e9e' }} />
                <Typography variant="caption">Unavailable</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Card>
  )
}