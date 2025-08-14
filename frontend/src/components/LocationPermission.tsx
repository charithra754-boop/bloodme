'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Paper
} from '@mui/material'
import { LocationOn, MyLocation } from '@mui/icons-material'

interface LocationPermissionProps {
  onLocationDetected: (lat: number, lng: number, address?: string) => void
  onError: (error: string) => void
}

export default function LocationPermission({ onLocationDetected, onError }: LocationPermissionProps) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'detecting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const requestLocation = () => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser.'
      setErrorMessage(error)
      setStatus('error')
      onError(error)
      return
    }

    setStatus('requesting')
    
    navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        const error = 'Location access denied. Please enable location in your browser settings.'
        setErrorMessage(error)
        setStatus('error')
        onError(error)
        return
      }
      
      detectLocation()
    }).catch(() => {
      // Fallback if permissions API not available
      detectLocation()
    })
  }

  const detectLocation = () => {
    setStatus('detecting')
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Try to get address
          const address = await reverseGeocode(latitude, longitude)
          setStatus('success')
          onLocationDetected(latitude, longitude, address)
        } catch (error) {
          setStatus('success')
          onLocationDetected(latitude, longitude)
        }
      },
      (error) => {
        let errorMsg = 'Could not get your location. '
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Please allow location access and try again.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMsg += 'Location request timed out. Please try again.'
            break
          default:
            errorMsg += 'An unknown error occurred.'
            break
        }
        
        setErrorMessage(errorMsg)
        setStatus('error')
        onError(errorMsg)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      const data = await response.json()
      
      if (data.locality && data.countryName) {
        return `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`
      }
      return ''
    } catch (error) {
      return ''
    }
  }

  // Auto-request location on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'idle') {
        requestLocation()
      }
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <LocationOn color="primary" />
        <Typography variant="h6">Location Detection</Typography>
      </Box>

      {status === 'idle' && (
        <Typography variant="body2" color="text.secondary">
          We need your location to find nearby blood donation requests.
        </Typography>
      )}

      {status === 'requesting' && (
        <Alert severity="info">
          Please allow location access when prompted by your browser.
        </Alert>
      )}

      {status === 'detecting' && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={20} />
          <Typography variant="body2">
            Detecting your location...
          </Typography>
        </Box>
      )}

      {status === 'success' && (
        <Alert severity="success">
          ✅ Location detected successfully! Your address has been auto-filled.
        </Alert>
      )}

      {status === 'error' && (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
          <Button 
            variant="outlined" 
            startIcon={<MyLocation />}
            onClick={requestLocation}
            size="small"
          >
            Try Again
          </Button>
        </Box>
      )}

      {(status === 'success' || status === 'error') && (
        <Button 
          variant="text" 
          startIcon={<MyLocation />}
          onClick={requestLocation}
          size="small"
          sx={{ mt: 1 }}
        >
          Update Location
        </Button>
      )}
    </Paper>
  )
}