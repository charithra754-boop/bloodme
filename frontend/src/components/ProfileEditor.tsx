'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material'
import { Edit, Save, Cancel } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '@/store'
import { updateProfile } from '@/store/slices/authSlice'

interface ProfileEditorProps {
  open: boolean
  onClose: () => void
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function ProfileEditor({ open, onClose }: ProfileEditorProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.auth)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bloodGroup: user?.bloodGroup || '',
      dateOfBirth: user?.dateOfBirth || '',
      weight: user?.weight || '',
      hospitalName: user?.hospitalName || '',
      licenseNumber: user?.licenseNumber || '',
      contactPerson: user?.contactPerson || '',
      emergencyContact: user?.emergencyContact || ''
    }
  })

  const onSubmit = async (data: any) => {
    try {
      // Clean up the data - only include relevant fields for the user's role
      const profileData: any = {
        name: data.name,
        phone: data.phone,
        address: data.address
      }

      if (user?.role === 'donor') {
        profileData.bloodGroup = data.bloodGroup
        profileData.dateOfBirth = data.dateOfBirth
        profileData.weight = data.weight ? Number(data.weight) : undefined
      } else if (user?.role === 'hospital') {
        profileData.hospitalName = data.hospitalName
        profileData.licenseNumber = data.licenseNumber
        profileData.contactPerson = data.contactPerson
        profileData.emergencyContact = data.emergencyContact
      }

      await dispatch(updateProfile(profileData)).unwrap()
      toast.success('Profile updated successfully!')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Edit color="primary" />
        Edit Profile
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Update your profile information. Changes will be saved locally and synced when the backend is available.
          </Alert>

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                {...register('phone', { required: 'Phone number is required' })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            
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

            {/* Donor-specific fields */}
            {user?.role === 'donor' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Donor Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Blood Group</InputLabel>
                    <Select
                      {...register('bloodGroup', { required: 'Blood group is required' })}
                      label="Blood Group"
                      error={!!errors.bloodGroup}
                      value={watch('bloodGroup')}
                      onChange={(e) => setValue('bloodGroup', e.target.value)}
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
                      min: { value: 45, message: 'Minimum weight is 45kg' }
                    })}
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                </Grid>
              </>
            )}

            {/* Hospital-specific fields */}
            {user?.role === 'hospital' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Hospital Information
                  </Typography>
                </Grid>
                
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
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClose}
            startIcon={<Cancel />}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}