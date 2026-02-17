"use client"

import { useEffect } from "react"

export function ApiConfigLogger() {
  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    const isNgrok = apiBaseUrl.includes('ngrok')
    
    console.log('🔧 API Configuration:', {
      NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
      environment: process.env.NODE_ENV,
      isNgrok: isNgrok,
      protocol: apiBaseUrl.startsWith('https') ? 'HTTPS' : 'HTTP',
      timestamp: new Date().toISOString()
    })

    if (isNgrok) {
      console.warn('⚠️ Using ngrok URL - Make sure your backend has:')
      console.warn('  1. CORS enabled for your Netlify domain')
      console.warn('  2. Proper ngrok configuration (no request limits)')
      console.warn('  3. HTTPS support if using https://ngrok URL')
    }
  }, [])

  return null
}
