'use client'

import { useState } from 'react'
import {
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  Zoom
} from '@mui/material'
import {
  Add,
  Warning,
  Refresh,
  Notifications,
  Analytics,
  Settings,
  Help
} from '@mui/icons-material'

interface FloatingActionButtonProps {
  userRole: 'donor' | 'hospital'
  onCreateAlert?: () => void
  onRefresh?: () => void
  onNotifications?: () => void
}

export default function FloatingActionButton({ 
  userRole, 
  onCreateAlert, 
  onRefresh,
  onNotifications 
}: FloatingActionButtonProps) {
  const [open, setOpen] = useState(false)

  const hospitalActions = [
    {
      icon: <Warning />,
      name: 'Emergency Alert',
      onClick: onCreateAlert,
      color: '#f44336'
    },
    {
      icon: <Add />,
      name: 'New Alert',
      onClick: onCreateAlert,
      color: '#2196f3'
    },
    {
      icon: <Analytics />,
      name: 'Analytics',
      onClick: () => console.log('Analytics'),
      color: '#9c27b0'
    },
    {
      icon: <Refresh />,
      name: 'Refresh',
      onClick: onRefresh,
      color: '#4caf50'
    }
  ]

  const donorActions = [
    {
      icon: <Notifications />,
      name: 'Notifications',
      onClick: onNotifications,
      color: '#ff9800'
    },
    {
      icon: <Refresh />,
      name: 'Refresh Alerts',
      onClick: onRefresh,
      color: '#4caf50'
    },
    {
      icon: <Settings />,
      name: 'Settings',
      onClick: () => console.log('Settings'),
      color: '#607d8b'
    },
    {
      icon: <Help />,
      name: 'Help',
      onClick: () => console.log('Help'),
      color: '#795548'
    }
  ]

  const actions = userRole === 'hospital' ? hospitalActions : donorActions

  return (
    <SpeedDial
      ariaLabel="Quick Actions"
      sx={{ 
        position: 'fixed', 
        bottom: 24, 
        right: 24,
        '& .MuiFab-primary': {
          background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
          }
        }
      }}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            action.onClick?.()
            setOpen(false)
          }}
          sx={{
            '& .MuiFab-primary': {
              bgcolor: action.color,
              '&:hover': {
                bgcolor: action.color,
                filter: 'brightness(0.9)'
              }
            }
          }}
        />
      ))}
    </SpeedDial>
  )
}