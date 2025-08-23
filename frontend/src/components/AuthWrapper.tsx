'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Box } from '@mui/material'
import { AppDispatch, RootState } from '@/store'
import { setCredentials } from '@/store/slices/authSlice'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user data exists in localStorage but not in Redux state
    const checkAuthState = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')

        if (storedUser && storedToken && !isAuthenticated) {
          // Restore authentication state from localStorage
          const userData = JSON.parse(storedUser)
          dispatch(setCredentials({ user: userData, token: storedToken }))
        }
      } catch (error) {
        console.error('Error restoring auth state:', error)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()
  }, [dispatch, isAuthenticated])

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}