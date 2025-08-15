'use client'

import { useState, useEffect } from 'react'
import { Snackbar, Alert, Slide, Box, Typography, Button } from '@mui/material'
import { Warning, Notifications, CheckCircle } from '@mui/icons-material'
import { toast } from 'react-toastify'

interface LiveNotificationsProps {
  userId: string
  userRole: 'donor' | 'hospital'
}

export default function LiveNotifications({ userId, userRole }: LiveNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [currentNotification, setCurrentNotification] = useState<any>(null)

  useEffect(() => {
    // Simulate real-time notifications for demo
    const simulateNotifications = () => {
      if (userRole === 'donor') {
        // Simulate emergency alerts for donors
        setTimeout(() => {
          const emergencyAlert = {
            id: Date.now(),
            type: 'emergency',
            title: '🚨 EMERGENCY BLOOD ALERT',
            message: 'City Hospital needs O+ blood urgently! Patient in critical condition.',
            priority: 'critical',
            timestamp: new Date()
          }
          
          setCurrentNotification(emergencyAlert)
          
          // Auto-hide after 10 seconds
          setTimeout(() => {
            setCurrentNotification(null)
          }, 10000)
        }, 3000)

        // Simulate regular alerts
        setTimeout(() => {
          toast.success('🩸 New blood donation request in your area!')
        }, 8000)

      } else if (userRole === 'hospital') {
        // Simulate donor responses for hospitals
        setTimeout(() => {
          toast.success('✅ Donor John D. accepted your blood request!')
        }, 5000)

        setTimeout(() => {
          toast.info('📍 Donor Sarah M. is 5 minutes away from your hospital')
        }, 12000)
      }
    }

    simulateNotifications()
  }, [userRole])

  const handleNotificationAction = (action: string) => {
    if (action === 'respond') {
      // Open response dialog
      toast.info('Opening response form...')
    } else if (action === 'view') {
      // Navigate to alerts
      toast.info('Navigating to alerts...')
    }
    setCurrentNotification(null)
  }

  return (
    <>
      {/* Emergency Alert Notification */}
      <Snackbar
        open={!!currentNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert
          severity="error"
          sx={{
            width: '100%',
            maxWidth: 500,
            background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
            color: 'white',
            border: '2px solid #ff1744',
            boxShadow: '0 4px 20px rgba(255, 23, 68, 0.4)',
            animation: currentNotification?.priority === 'critical' ? 'pulse 2s infinite' : 'none',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
          icon={<Warning />}
          action={
            <Box display="flex" gap={1}>
              <Button
                size="small"
                onClick={() => handleNotificationAction('respond')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
                variant="outlined"
              >
                RESPOND
              </Button>
              <Button
                size="small"
                onClick={() => setCurrentNotification(null)}
                sx={{ color: 'white' }}
              >
                ✕
              </Button>
            </Box>
          }
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentNotification?.title}
            </Typography>
            <Typography variant="body2">
              {currentNotification?.message}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      {/* Success Notifications */}
      <Snackbar
        open={false} // Controlled by toast notifications
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" icon={<CheckCircle />}>
          Donor response received!
        </Alert>
      </Snackbar>
    </>
  )
}