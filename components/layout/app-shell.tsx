'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#10B65C] border-t-transparent" />
          <p className="text-sm text-[#64748B]">Loading...</p>
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-200",
          sidebarCollapsed ? "pl-[72px]" : "pl-[256px]"
        )}
      >
        {/* Collapse Toggle Button - positioned at top near header */}
        <Button
          variant="outline"
          size="icon"
          className="fixed top-[72px] z-40 h-6 w-6 rounded-md border-[#E5E7EB] bg-white shadow-sm hover:bg-[#F0FDF4] hover:border-[#10B65C] transition-all duration-200"
          style={{ left: sidebarCollapsed ? 84 : 268 }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-[#64748B]" />
          )}
        </Button>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
