'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { User } from './types'
import { currentUser as mockCurrentUser } from './mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      // In production, this would verify a JWT token
      const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null
      if (storedAuth) {
        try {
          setUser(JSON.parse(storedAuth))
        } catch {
          localStorage.removeItem('auth_user')
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // In production, this would call the auth API
      // For demo, accept any valid email format with password "demo123"
      if (email && password === 'demo123') {
        // Use mock user but update email
        const loggedInUser = { ...mockCurrentUser, email }
        setUser(loggedInUser)
        localStorage.setItem('auth_user', JSON.stringify(loggedInUser))
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
