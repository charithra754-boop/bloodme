'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  LocalHospital,
  Favorite,
  Schedule,
  CheckCircle,
  Warning,
  CardGiftcard,
  Timeline
} from '@mui/icons-material'

interface DonorHealthCardProps {
  donorStats: any
}

export default function DonorHealthCard({ donorStats }: DonorHealthCardProps) {
  const [healthDialogOpen, setHealthDialogOpen] = useState(false)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const nextEligible = new Date(donorStats.nextEligibleDate)
      const timeDiff = nextEligible.getTime() - now.getTime()

      if (timeDiff <= 0) {
        setCountdown('✅ ELIGIBLE TO DONATE!')
        return
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      setCountdown(`${days}d ${hours}h ${minutes}m`)
    }, 1000)

    return () => clearInterval(timer)
  }, [donorStats.nextEligibleDate])

  const progressToHealthReward = (donorStats.rewardPoints / 30) * 100

  return (
    <>
      <Card sx={{ 
        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            🏥 Health Reward Progress
          </Typography>
          
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4" fontWeight="bold">
              {donorStats.rewardPoints}/30
            </Typography>
            <CardGiftcard sx={{ fontSize: 40, opacity: 0.8 }} />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={progressToHealthReward} 
            sx={{ 
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { 
                bgcolor: 'rgba(255,255,255,0.9)',
                animation: progressToHealthReward > 75 ? 'pulse 2s infinite' : 'none'
              }
            }}
          />

          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            {30 - donorStats.rewardPoints} points to FREE Health Checkup! 🎁
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={() => setHealthDialogOpen(true)}
            sx={{ 
              mt: 2, 
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            View Health Records
          </Button>
        </CardContent>
      </Card>

      {/* Health Records Dialog */}
      <Dialog open={healthDialogOpen} onClose={() => setHealthDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <LocalHospital color="primary" />
            <Typography variant="h5">Your Health Records</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon><Favorite color="error" /></ListItemIcon>
              <ListItemText 
                primary="Blood Type" 
                secondary="O+ (Universal Donor)" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText 
                primary="Health Score" 
                secondary={`${donorStats.healthScore}/100 - Excellent condition`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Schedule color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Last Donation" 
                secondary={donorStats.lastDonationDate.toLocaleDateString()}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Timeline color="info" /></ListItemIcon>
              <ListItemText 
                primary="Total Distance Traveled" 
                secondary={`${donorStats.totalDistance} km for donations`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><Warning color="warning" /></ListItemIcon>
              <ListItemText 
                primary="Next Eligible Date" 
                secondary={`${donorStats.nextEligibleDate.toLocaleDateString()} (${Math.ceil((new Date(donorStats.nextEligibleDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining)`}
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </>
  )
}