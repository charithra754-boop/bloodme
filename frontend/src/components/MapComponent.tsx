'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { Box, Typography, Button, Chip, Avatar } from '@mui/material'
import {
  Navigation,
  Phone,
  BloodtypeOutlined,
  LocalHospital,
  Event,
  Person
} from '@mui/icons-material'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapMarker {
  id: string
  type: 'donor' | 'hospital' | 'camp' | 'alert'
  position: [number, number]
  data: any
}

interface MapComponentProps {
  userRole: 'donor' | 'hospital'
  userLocation: [number, number]
  markers: MapMarker[]
  searchRadius: number
  onMarkerClick: (marker: MapMarker) => void
  onNavigate: (position: [number, number]) => void
}

export default function MapComponent({
  userRole,
  userLocation,
  markers,
  searchRadius,
  onMarkerClick,
  onNavigate
}: MapComponentProps) {
  const mapRef = useRef<any>(null)

  const renderMarkerPopup = (marker: MapMarker) => {
    const { type, data } = marker

    switch (type) {
      case 'donor':
        return (
          <Box sx={{ minWidth: 250 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BloodtypeOutlined color="error" />
              {data.name}
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <Chip label={data.bloodGroup} color="error" size="small" />
              <Chip 
                label={data.isAvailable ? 'Available' : 'Not Available'} 
                color={data.isAvailable ? 'success' : 'default'} 
                size="small" 
              />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 {data.distance.toFixed(1)} km away
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              🩸 {data.donations} donations completed
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📅 Last donation: {data.lastDonation.toLocaleDateString()}
            </Typography>
            <Box display="flex" gap={1} mt={2}>
              <Button 
                size="small" 
                variant="contained" 
                startIcon={<Phone />}
                onClick={() => window.open(`tel:${data.phone}`)}
              >
                Call
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<Navigation />}
                onClick={() => onNavigate(marker.position)}
              >
                Navigate
              </Button>
            </Box>
          </Box>
        )

      case 'hospital':
        return (
          <Box sx={{ minWidth: 250 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalHospital color="error" />
              {data.name}
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <Chip label={`Urgent: ${data.urgentNeeds}`} color="error" size="small" />
              <Chip label={`${data.activeAlerts} Active Alerts`} color="warning" size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 {data.distance.toFixed(1)} km away
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ⭐ Rating: {data.rating.toFixed(1)}/5.0
            </Typography>
            <Box display="flex" gap={1} mt={2}>
              <Button 
                size="small" 
                variant="contained" 
                startIcon={<Phone />}
                onClick={() => window.open(`tel:${data.phone}`)}
              >
                Call
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<Navigation />}
                onClick={() => onNavigate(marker.position)}
              >
                Navigate
              </Button>
            </Box>
          </Box>
        )

      case 'camp':
        return (
          <Box sx={{ minWidth: 250 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Event color="primary" />
              {data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              🏢 Organized by: {data.organizer}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📅 Date: {data.date.toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 {data.distance?.toFixed(1)} km away
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
            <Box display="flex" gap={1} mt={2}>
              <Button 
                size="small" 
                variant="contained" 
                startIcon={<Event />}
              >
                Register
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<Navigation />}
                onClick={() => onNavigate(marker.position)}
              >
                Navigate
              </Button>
            </Box>
          </Box>
        )

      case 'alert':
        return (
          <Box sx={{ minWidth: 250 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🚨 Emergency Alert
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              {data.hospitalName}
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <Chip label={data.bloodGroup} color="error" size="small" />
              <Chip label={data.priority.toUpperCase()} color="error" size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              🩸 {data.unitsNeeded} units needed
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ⏰ {data.timeLeft} hours remaining
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 {data.distance.toFixed(1)} km away
            </Typography>
            <Box display="flex" gap={1} mt={2}>
              <Button 
                size="small" 
                variant="contained" 
                color="error"
                startIcon={<BloodtypeOutlined />}
              >
                I Can Help!
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<Navigation />}
                onClick={() => onNavigate(marker.position)}
              >
                Navigate
              </Button>
            </Box>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Location Circle */}
      <Circle
        center={userLocation}
        radius={searchRadius * 1000}
        pathOptions={{
          fillColor: userRole === 'hospital' ? '#f44336' : '#e91e63',
          fillOpacity: 0.1,
          color: userRole === 'hospital' ? '#f44336' : '#e91e63',
          weight: 2,
          opacity: 0.8
        }}
      />

      {/* User Location Marker */}
      <Marker position={userLocation}>
        <Popup>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              📍 Your Location
            </Typography>
            <Typography variant="body2">
              {userRole === 'hospital' ? '🏥 Hospital' : '🩸 Donor'}
            </Typography>
          </Box>
        </Popup>
      </Marker>

      {/* Dynamic Markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{
            click: () => onMarkerClick(marker)
          }}
        >
          <Popup>
            {renderMarkerPopup(marker)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}