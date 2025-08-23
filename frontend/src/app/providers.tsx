'use client'

import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store } from '@/store'
import { theme } from '@/theme'
import AuthWrapper from '@/components/AuthWrapper'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </ThemeProvider>
    </Provider>
  )
}