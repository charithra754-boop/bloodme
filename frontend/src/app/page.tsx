'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions 
} from '@mui/material'
import { 
  LocalHospital, 
  Favorite, 
  Notifications,
  TrendingUp 
} from '@mui/icons-material'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'hospital') {
        router.push('/hospital/dashboard')
      } else if (user.role === 'donor') {
        router.push('/donor/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const features = [
    {
      icon: <Notifications color="primary" sx={{ fontSize: 40 }} />,
      title: 'Real-Time Alerts',
      description: 'Get instant notifications when blood is needed in your area'
    },
    {
      icon: <LocalHospital color="primary" sx={{ fontSize: 40 }} />,
      title: 'Hospital Network',
      description: 'Connect with verified hospitals and medical facilities'
    },
    {
      icon: <Favorite color="primary" sx={{ fontSize: 40 }} />,
      title: 'Save Lives',
      description: 'Your donation can save up to 3 lives with a single donation'
    },
    {
      icon: <TrendingUp color="primary" sx={{ fontSize: 40 }} />,
      title: 'Track Impact',
      description: 'Monitor your donation history and see your life-saving impact'
    }
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            Blood Donor & Alert System
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Connecting hospitals with blood donors through real-time alerts and community engagement
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ mr: 2 }}
              onClick={() => router.push('/auth/register')}
            >
              Join as Donor
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => router.push('/auth/login')}
            >
              Hospital Login
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box textAlign="center" mt={8} p={4} bgcolor="primary.main" color="white" borderRadius={2}>
          <Typography variant="h4" gutterBottom>
            Ready to Save Lives?
          </Typography>
          <Typography variant="body1" paragraph>
            Join thousands of donors making a difference in their communities
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => router.push('/auth/register')}
          >
            Get Started Today
          </Button>
        </Box>
      </Box>
    </Container>
  )
}