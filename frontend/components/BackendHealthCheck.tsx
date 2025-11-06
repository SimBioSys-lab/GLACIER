'use client'

import { useEffect } from 'react'
import { HealthCheckService } from '@/services/healthCheckService'

export function BackendHealthCheck() {
  useEffect(() => {
    // Trigger health check when component mounts
    const performHealthCheck = async () => {
      console.log('🚀 Initiating backend health check...')
      
      // Single ping to wake up the server
      const result = await HealthCheckService.ping()
      
      // If the server is waking up, do a few retries in the background
      if (result.status === 'waking') {
        // Don't block the UI, just let it retry in the background
        HealthCheckService.pingWithRetries(5, 10000).catch(error => {
          console.error('Health check retries failed:', error)
        })
      }
    }
    
    performHealthCheck()
  }, []) // Empty dependency array means this runs once on mount
  
  // This component doesn't render anything visible
  return null
}
