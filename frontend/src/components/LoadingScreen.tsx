'use client'

import { Box, CircularProgress, Typography, Fade } from '@mui/material'
import { Favorite } from '@mui/icons-material'

interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 3
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress size={60} thickness={4} />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Favorite color="error" />
          </Box>
        </Box>
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Fade>
  )
}