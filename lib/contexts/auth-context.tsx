"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth-api"
import type { CurrentUser, LoginRequest } from "@/lib/types/auth"

interface AuthContextType {
  user: CurrentUser | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (token) {
        const currentUser = await authApi.getCurrentUser(token)
        setUser({ ...currentUser, userType: currentUser.userType || "UNKNOWN" })
      }
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials)
    localStorage.setItem("authToken", response.token)
    localStorage.setItem("authUser", JSON.stringify({
      userId: response.userId,
      username: response.username,
      name: response.name,
      surname: response.surname,
      email: response.email,
      userType: response.userType,
    }))
    setUser({
      userId: response.userId,
      username: response.username,
      name: response.name,
      surname: response.surname,
      email: response.email,
      userType: response.userType,
    })
    router.push("/")
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
