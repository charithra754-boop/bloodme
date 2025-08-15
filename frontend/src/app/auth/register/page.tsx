'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '@/store'
import { register as registerUser } from '@/store/slices/authSlice'

const steps = ['Account Type', 'Basic Information', 'Location & Details']
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

interface RegisterForm {
  // Basic info
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  role: 'donor' | 'hospital'
  address: string
  
  // Location (simplified - in production, use Google Maps API)
  latitude: number
  longitude: number
  
  // Donor specific
  bloodGroup?: string
  dateOfBirth?: string
  weight?: number
  
  // Hospital specific
  hospitalName?: string
  licenseNumber?: string
  contactPerson?: string
  emergencyContact?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  
  const [activeStep, setActiveStep] = useState(0)
  const [userRole, setUserRole] = useState<'donor' | 'hospital'>('donor')
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger
  } = useForm<RegisterForm>()

  const password = watch('password')



  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const getFieldsForStep = (step: number): (keyof RegisterForm)[] => {
    switch (step) {
      case 0:
        return ['role']
      case 1:
        return ['name', 'email', 'password', 'confirmPassword', 'phone']
      case 2:
        const baseFields: (keyof RegisterForm)[] = ['address']
        if (userRole === 'donor') {
          return [...baseFields, 'bloodGroup', 'dateOfBirth', 'weight']
        } else {
          return [...baseFields, 'hospitalName', 'licenseNumber', 'contactPerson', 'emergencyContact']
        }
      default:
        return []
    }
  }

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Validate location data
      if (!data.latitude || !data.longitude) {
        toast.error('Please allow location access to continue.')
        return
      }

      const registrationData = {
        ...data,
        role: userRole,
        location: {
          type: 'Point',
          coordinates: [data.longitude, data.latitude]
        }
      }

      console.log('Submitting registration:', registrationData)
      
      await dispatch(registerUser(registrationData)).unwrap()
      toast.success('Registration successful!')
      
      // Redirect based on user role
      if (userRole === 'hospital') {
        router.push('/hospital/dashboard')
      } else {
        router.push('/donor/dashboard')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed')
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.')
      setLocationStatus('error')
      return
    }

    setLocationStatus('detecting')
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Set the form values
        setValue('latitude', latitude)
        setValue('longitude', longitude)
        
        setLocationStatus('success')
        toast.success('Location detected successfully!')
        
        // Optional: Reverse geocode to get address
        reverseGeocode(latitude, longitude)
      },
      (error) => {
        setLocationStatus('error')
        let errorMessage = 'Could not get your location. '
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.'
            break
          default:
            errorMessage += 'An unknown error occurred.'
            break
        }
        
        toast.error(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using a free geocoding service (you can replace with Google Maps API later)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      const data = await response.json()
      
      if (data.locality && data.countryName) {
        const address = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`
        setValue('address', address)
        toast.info('Address auto-filled based on your location!')
      }
    } catch (error) {
      console.log('Reverse geocoding failed:', error)
      // Don't show error to user, it's optional
    }
  }

  // Auto-detect location when reaching step 2
  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep)
    const isValid = await trigger(fieldsToValidate)
    
    if (isValid) {
      setActiveStep((prev) => {
        const nextStep = prev + 1
        // Auto-detect location when reaching location step
        if (nextStep === 2 && locationStatus === 'idle') {
          setTimeout(() => getCurrentLocation(), 500)
        }
        return nextStep
      })
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">I want to register as:</FormLabel>
              <RadioGroup
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'donor' | 'hospital')}
              >
                <FormControlLabel 
                  value="donor" 
                  control={<Radio />} 
                  label="Blood Donor - I want to donate blood and help save lives" 
                />
                <FormControlLabel 
                  value="hospital" 
                  control={<Radio />} 
                  label="Hospital/Medical Facility - I need to request blood donations" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                {...register('phone', { required: 'Phone number is required' })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
          </Grid>
        )

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                {...register('address', { required: 'Address is required' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            {/* Hidden location fields */}
            <input type="hidden" {...register('latitude', { required: true, valueAsNumber: true })} />
            <input type="hidden" {...register('longitude', { required: true, valueAsNumber: true })} />
            
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📍 Location Detection
                </Typography>
                {locationStatus === 'detecting' && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Getting your location...</Typography>
                  </Box>
                )}
                {locationStatus === 'success' && (
                  <Typography variant="body2" color="success.main">
                    ✅ Location detected successfully!
                  </Typography>
                )}
                {locationStatus === 'error' && (
                  <Typography variant="body2" color="error.main">
                    ❌ Could not detect location. Please enable location access.
                  </Typography>
                )}
                <Button 
                  onClick={getCurrentLocation} 
                  variant="outlined" 
                  size="small"
                  sx={{ mt: 1 }}
                  disabled={locationStatus === 'detecting'}
                >
                  {locationStatus === 'success' ? 'Update Location' : 'Detect My Location'}
                </Button>
              </Box>
            </Grid>

            {/* Donor-specific fields */}
            {userRole === 'donor' && (
              <>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
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
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    {...register('weight', { 
                      required: 'Weight is required',
                      min: { value: 45, message: 'Minimum weight is 45kg' },
                      valueAsNumber: true
                    })}
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                </Grid>
              </>
            )}

            {/* Hospital-specific fields */}
            {userRole === 'hospital' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hospital Name"
                    {...register('hospitalName', { required: 'Hospital name is required' })}
                    error={!!errors.hospitalName}
                    helperText={errors.hospitalName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="License Number"
                    {...register('licenseNumber', { required: 'License number is required' })}
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Person"
                    {...register('contactPerson', { required: 'Contact person is required' })}
                    error={!!errors.contactPerson}
                    helperText={errors.contactPerson?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    {...register('emergencyContact', { required: 'Emergency contact is required' })}
                    error={!!errors.emergencyContact}
                    helperText={errors.emergencyContact?.message}
                  />
                </Grid>
              </>
            )}
          </Grid>
        )

      default:
        return null
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Account'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>

          <Box textAlign="center" mt={2}>
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push('/auth/login')}
            >
              Already have an account? Sign In
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}