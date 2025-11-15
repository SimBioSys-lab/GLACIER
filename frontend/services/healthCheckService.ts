/**
 * Health Check Service for GlycoShield Backend
 * Automatically wakes up the Render.com free tier backend when the frontend loads
 */

import { API_URL } from '@/app/config'

export class HealthCheckService {
  static async ping(): Promise<{ status: string; message?: string }> {
    try {
      // Try to hit the root endpoint or a health check endpoint
      const response = await fetch(API_URL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      })
      
      if (response.ok) {
        console.log('✅ Backend health check successful - server is active')
        return { status: 'healthy', message: 'Backend is running' }
      } else {
        console.warn(`⚠️ Backend responded with status: ${response.status}`)
        return { status: 'unhealthy', message: `Server responded with ${response.status}` }
      }
    } catch (error) {
      // This is expected on first load when the backend is sleeping
      console.log(`🔄 Waking up backend server at ${API_URL} (this may take 30-60 seconds if hosted on free tier)...`)
      return { 
        status: 'waking', 
        message: 'Backend is starting up. This may take 30-60 seconds on first access.' 
      }
    }
  }
  
  /**
   * Perform health check with retries
   * Useful for waiting for the backend to fully wake up
   */
  static async pingWithRetries(maxRetries: number = 3, delayMs: number = 5000): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      const result = await this.ping()
      
      if (result.status === 'healthy') {
        return
      }
      
      if (i < maxRetries - 1) {
        console.log(`Retry ${i + 1}/${maxRetries} in ${delayMs / 1000} seconds...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    
    console.log('Backend health check completed. The server should be active now.')
  }
}
