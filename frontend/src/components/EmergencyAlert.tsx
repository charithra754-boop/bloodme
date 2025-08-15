'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  Slide,
  Alert
} from '@mui/material'
import {
  Warning as WarningIcon,
  LocalHospital,
  BloodtypeOutlined,
  Schedule,
  LocationOn
} from '@mui/icons-material'
import { TransitionProps } from '@mui/material/transitions'
import React from 'react'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface EmergencyAlertProps {
  alert: any
  open: boolean
  onClose: () => void
  onRespond: (response: string) => void
}

export default function EmergencyAlert({ alert, open, onClose, onRespond }: EmergencyAlertProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!alert?.requiredBy) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const deadline = new Date(alert.requiredBy).getTime()
      const distance = deadline - now

      if (distance < 0) {
        setTimeLeft('EXPIRED')
        return
      }

      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      setTimeLeft(`${hours}h ${minutes}m`)
    }, 1000)

    return () => clearInterval(timer)
  }, [alert?.requiredBy])

  if (!alert) return null

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
          color: 'white',
          border: '3px solid #ff1744',
          boxShadow: '0 0 30px rgba(255, 23, 68, 0.5)',
          animation: 'pulse 2s infinite'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <WarningIcon sx={{ fontSize: 40, animation: 'heartbeat 1s infinite' }} />
          <Typography variant="h4" fontWeight="bold">
            🚨 EMERGENCY ALERT
          </Typography>
          <WarningIcon sx={{ fontSize: 40, animation: 'heartbeat 1s infinite' }} />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center" mb={3}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(255,255,255,0.2)',
              margin: '0 auto',
              mb: 2
            }}
          >
            <LocalHospital fontSize="large" />
          </Avatar>

          <Typography variant="h5" gutterBottom fontWeight="bold">
            {alert.hospitalId?.hospitalName || 'Emergency Hospital'}
          </Typography>

          <Box display="flex" justifyContent="center" gap={1} mb={2}>
            <Chip
              icon={<BloodtypeOutlined />}
              label={`${alert.bloodGroup} BLOOD NEEDED`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                color: '#d32f2f',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            />
          </Box>
        </Box>

        <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" gutterBottom>
            {alert.patientCondition}
          </Typography>
          <Typography variant="body1">
            <strong>{alert.unitsNeeded} units</strong> of {alert.bloodGroup} blood urgently needed
          </Typography>
        </Alert>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Schedule />
            <Typography variant="body1">
              <strong>Time Left: {timeLeft}</strong>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn />
            <Typography variant="body1">
              Within {alert.searchRadius}km
            </Typography>
          </Box>
        </Box>

        {alert.additionalNotes && (
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2">
              <strong>Additional Notes:</strong> {alert.additionalNotes}
            </Typography>
          </Box>
        )}

        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.9 }}>
          Your response can save a life. Every second counts! 💝
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
        <Button
          onClick={() => onRespond('accepted')}
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'rgba(255,255,255,0.9)',
            color: '#d32f2f',
            fontWeight: 'bold',
            minWidth: 120,
            '&:hover': {
              bgcolor: 'white',
              transform: 'scale(1.05)'
            }
          }}
        >
          🩸 I CAN HELP!
        </Button>

        <Button
          onClick={() => onRespond('declined')}
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'rgba(255,255,255,0.5)',
            color: 'white',
            minWidth: 120,
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Can't Help Now
        </Button>
      </DialogActions>
    </Dialog>
  )
}