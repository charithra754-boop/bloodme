// 🚨 HACKATHON DEMO: Mock API for when backend is down

export const mockAuthAPI = {
  login: async (credentials: { email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      user: {
        id: 'demo-user-123',
        name: credentials.email.includes('hospital') ? 'City General Hospital' : 'John Donor',
        email: credentials.email,
        role: credentials.email.includes('hospital') ? 'hospital' : 'donor',
        phone: '+1-555-0123',
        address: '123 Demo Street, Demo City',
        location: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128]
        }
      },
      token: 'demo-jwt-token-' + Date.now()
    }
  },

  register: async (userData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      user: {
        id: 'demo-user-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
        location: userData.location
      },
      token: 'demo-jwt-token-' + Date.now()
    }
  }
}

export const mockAlertsAPI = {
  getActiveAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return [
      {
        _id: 'alert-1',
        bloodGroup: 'O+',
        unitsNeeded: 2,
        priority: 'high',
        status: 'active',
        patientCondition: 'Emergency Surgery Patient',
        additionalNotes: 'Patient requires immediate blood transfusion',
        requiredBy: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        searchRadius: 10,
        responses: [],
        notifiedDonors: [],
        unitsCollected: 0,
        isEmergency: true,
        createdAt: new Date().toISOString(),
        hospitalId: {
          hospitalName: 'City General Hospital',
          emergencyContact: '+1-555-EMERGENCY'
        }
      },
      {
        _id: 'alert-2',
        bloodGroup: 'A+',
        unitsNeeded: 1,
        priority: 'medium',
        status: 'active',
        patientCondition: 'Scheduled Surgery',
        requiredBy: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        searchRadius: 15,
        responses: [],
        notifiedDonors: [],
        unitsCollected: 0,
        isEmergency: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        hospitalId: {
          hospitalName: 'Metro Medical Center'
        }
      }
    ]
  },

  createAlert: async (alertData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      _id: 'alert-' + Date.now(),
      ...alertData,
      status: 'active',
      responses: [],
      notifiedDonors: [],
      unitsCollected: 0,
      createdAt: new Date().toISOString()
    }
  },

  respondToAlert: async (alertId: string, response: any) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      success: true,
      message: 'Response submitted successfully!'
    }
  }
}