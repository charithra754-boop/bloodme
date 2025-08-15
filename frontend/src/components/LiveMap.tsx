'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  Avatar,
  Badge
} from '@mui/material'
import {
  MyLocation,
  Layers,
  FilterList,
  Navigation,
  LocalHospital,
  BloodtypeOutlined,
  Event,
  Person,
  Refresh,
  Fullscreen,
  Close,
  Phone,
  DirectionsRun,
  Schedule
} from '@mui/icons-material'
import dynamic from 'next/dynamic'

// Dynamically import the entire map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        height: '500px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'grey.100',
        borderRadius: 2
      }}
    >
      <Typography>Loading map...</Typography>
    </Box>
  )
})

interface LiveMapProps {
  userRole: 'donor' | 'hospital'
  userLocation?: [number, number]
  height?: number
}

interface MapMarker {
  id: string
  type: 'donor' | 'hospital' | 'camp' | 'alert'
  position: [number, number]
  data: any
}

export default function LiveMap({ userRole, userLocation = [40.7128, -74.0060], height = 500 }: LiveMapProps) {
  const [mounted, setMounted] = useState(false)
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(userLocation)
  const [searchRadius, setSearchRadius] = useState(5) // km
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    donors: true,
    hospitals: true,
    camps: true,
    alerts: true
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
    generateMockData()
  }, [userRole, userLocation])

  const generateMockData = () => {
    const mockMarkers: MapMarker[] = []
    
    if (userRole === 'hospital') {
      // Generate nearby donors for hospital view
      for (let i = 0; i < 15; i++) {
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
      for (let i = 0; i < 5; i++) {
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
            contact: '+1-555-' + Math.floor(Math.random() * 9000 + 1000)
          }
        })
      }
    } else {
      // Generate nearby hospitals for donor view
      for (let i = 0; i < 8; i++) {
        const lat = userLocation[0] + (Math.random() - 0.5) * 0.12
        const lng = userLocation[1] + (Math.random() - 0.5) * 0.12
        mockMarkers.push({
          id: `hospital-${i}`,
          type: 'hospital',
          position: [lat, lng],
          data: {
            name: `${['City', 'General', 'Memorial', 'St. Mary\'s', 'Regional', 'Community', 'University', 'Children\'s'][i]} Hospital`,
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
            timeLeft: Math.floor(Math.random() * 6) + 1, // hours
            distance: Math.random() * 8
          }
        })
      }
      
      // Generate blood camps for donors
      for (let i = 0; i < 6; i++) {
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

  const getMarkerIcon = (type: string, data?: any) => {
    const baseStyle = {
      width: 40,
      height: 40,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '18px',
      border: '3px solid white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }

    switch (type) {
      case 'donor':
        return {
          ...baseStyle,
          backgroundColor: data?.isAvailable ? '#4caf50' : '#9e9e9e',
          content: '🩸'
        }
      case 'hospital':
        return {
          ...baseStyle,
          backgroundColor: '#f44336',
          content: '🏥'
        }
      case 'camp':
        return {
          ...baseStyle,
          backgroundColor: '#2196f3',
          content: '🏕️'
        }
      case 'alert':
        return {
          ...baseStyle,
          backgroundColor: data?.priority === 'critical' ? '#d32f2f' : '#ff9800',
          content: '🚨',
          animation: data?.priority === 'critical' ? 'pulse 2s infinite' : 'none'
        }
      default:
        return baseStyle
    }
  }

  const filteredMarkers = markers.filter(marker => filters[marker.type + 's' as keyof typeof filters])

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker)
  }

  const handleNavigate = (position: [number, number]) => {
    const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${position[0]},${position[1]}`
    window.open(url, '_blank')
  }



  if (!mounted) {
    return (
      <Card sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading map...</Typography>
      </Card>
    )
  }

  return (
    <>
      <Card sx={{ height: isFullscreen ? '100vh' : height, position: isFullscreen ? 'fixed' : 'relative', top: isFullscreen ? 0 : 'auto', left: isFullscreen ? 0 : 'auto', right: isFullscreen ? 0 : 'auto', bottom: isFullscreen ? 0 : 'auto', zIndex: isFullscreen ? 9999 : 'auto' }}>
        {/* Map Controls */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Tooltip title="Toggle Fullscreen">
            <IconButton 
              sx={{ bgcolor: 'white', boxShadow: 2 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Close /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
          <Tooltip title="My Location">
            <IconButton 
              sx={{ bgcolor: 'white', boxShadow: 2 }}
              onClick={() => setMapCenter(userLocation)}
            >
              <MyLocation />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filters">
            <IconButton 
              sx={{ bgcolor: 'white', boxShadow: 2 }}
              onClick={() => setShowFilters(true)}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton 
              sx={{ bgcolor: 'white', boxShadow: 2 }}
              onClick={generateMockData}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Map Legend */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 16, 
          zIndex: 1000,
          bgcolor: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          minWidth: 200
        }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            🗺️ Live Map Legend
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.5}>
            {userRole === 'hospital' ? (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                  <Typography variant="caption">Available Donors</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9e9e9e' }} />
                  <Typography variant="caption">Unavailable Donors</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2196f3' }} />
                  <Typography variant="caption">Blood Camps</Typography>
                </Box>
              </>
            ) : (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                  <Typography variant="caption">Hospitals</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#d32f2f' }} />
                  <Typography variant="caption">Emergency Alerts</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2196f3' }} />
                  <Typography variant="caption">Donation Camps</Typography>
                </Box>
              </>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            📍 Showing {filteredMarkers.length} locations within {searchRadius}km
          </Typography>
        </Box>

        {/* Map Container */}
        <DynamicMap
          userRole={userRole}
          userLocation={userLocation}
          markers={filteredMarkers}
          searchRadius={searchRadius}
          onMarkerClick={handleMarkerClick}
          onNavigate={handleNavigate}
        />
      </Card>

      {/* Filters Dialog */}
      <Dialog open={showFilters} onClose={() => setShowFilters(false)} maxWidth="sm" fullWidth>
        <DialogTitle>🔍 Map Filters & Settings</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            Show on Map:
          </Typography>
          <List>
            {userRole === 'hospital' ? (
              <>
                <ListItem>
                  <ListItemIcon><Person /></ListItemIcon>
                  <ListItemText primary="Available Donors" />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.donors}
                        onChange={(e) => setFilters(prev => ({ ...prev, donors: e.target.checked }))}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Event /></ListItemIcon>
                  <ListItemText primary="Blood Camps" />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.camps}
                        onChange={(e) => setFilters(prev => ({ ...prev, camps: e.target.checked }))}
                      />
                    }
                    label=""
                  />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem>
                  <ListItemIcon><LocalHospital /></ListItemIcon>
                  <ListItemText primary="Hospitals" />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.hospitals}
                        onChange={(e) => setFilters(prev => ({ ...prev, hospitals: e.target.checked }))}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>🚨</ListItemIcon>
                  <ListItemText primary="Emergency Alerts" />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.alerts}
                        onChange={(e) => setFilters(prev => ({ ...prev, alerts: e.target.checked }))}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Event /></ListItemIcon>
                  <ListItemText primary="Donation Camps" />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.camps}
                        onChange={(e) => setFilters(prev => ({ ...prev, camps: e.target.checked }))}
                      />
                    }
                    label=""
                  />
                </ListItem>
              </>
            )}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Search Radius: {searchRadius} km
          </Typography>
          <Slider
            value={searchRadius}
            onChange={(_, value) => setSearchRadius(value as number)}
            min={1}
            max={50}
            step={1}
            marks={[
              { value: 1, label: '1km' },
              { value: 10, label: '10km' },
              { value: 25, label: '25km' },
              { value: 50, label: '50km' }
            ]}
            valueLabelDisplay="auto"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFilters(false)}>Close</Button>
          <Button variant="contained" onClick={() => { generateMockData(); setShowFilters(false) }}>
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}