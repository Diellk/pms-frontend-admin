"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // If authenticated and on login page, redirect to home
      if (isAuthenticated && pathname === "/login") {
        router.push("/")
      }
      // If not authenticated and not on login page, redirect to login
      else if (!isAuthenticated && pathname !== "/login") {
        router.push("/login")
      }
    }
  }, [isAuthenticated, loading, pathname, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page without restrictions
  if (pathname === "/login") {
    return <>{children}</>
  }

  // If not authenticated and not on login page, don't render children
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
