"use client"

import { useEffect } from "react"

export function ApiConfigLogger() {
  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    console.log('🔧 API Configuration:', {
      NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  }, [])

  return null
}
