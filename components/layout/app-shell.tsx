'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router])

  // Show nothing while checking auth on protected routes
  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Render public routes without shell
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className={cn(
          "pt-16 min-h-screen transition-all",
          sidebarCollapsed ? "pl-[72px]" : "pl-[240px]"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
