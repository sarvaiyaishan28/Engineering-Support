'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BarChart3,
  Users,
  Bell,
  Puzzle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tickets', href: '/tickets', icon: Ticket, badge: 7 },
  { name: 'Create Ticket', href: '/tickets/new', icon: PlusCircle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
  { name: 'Integrations', href: '/integrations', icon: Puzzle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card flex flex-col"
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <span className="font-semibold text-foreground whitespace-nowrap">
                    Allocations
                  </span>
                  <span className="text-xs text-muted-foreground block whitespace-nowrap">
                    Engineering Support
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <li key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                          'hover:bg-accent hover:text-accent-foreground',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground'
                        )}
                      >
                        <item.icon className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-primary' : ''
                        )} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1 whitespace-nowrap overflow-hidden"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {item.badge && !collapsed && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              'h-5 min-w-5 justify-center text-xs',
                              isActive ? 'bg-primary/20 text-primary' : ''
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {item.badge && collapsed && (
                          <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <Badge variant="secondary" className="h-5 min-w-5 justify-center text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
