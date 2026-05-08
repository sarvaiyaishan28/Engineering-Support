'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const platformNav = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tickets', href: '/tickets', icon: Ticket, badge: 7 },
  { name: 'Create Ticket', href: '/tickets/new', icon: PlusCircle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
]

const financeNav = [
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
  { name: 'Integrations', href: '/integrations', icon: Puzzle },
]

const adminNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ collapsed: controlledCollapsed, onCollapsedChange }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = controlledCollapsed ?? internalCollapsed
  const setCollapsed = onCollapsedChange ?? setInternalCollapsed
  const pathname = usePathname()

  const NavItem = ({ item }: { item: typeof platformNav[0] }) => {
    const isActive = pathname === item.href || 
      (item.href !== '/' && pathname.startsWith(item.href))

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'hover:bg-[#F0FDF4]',
              isActive
                ? 'bg-[#F0FDF4] text-[#10B65C]'
                : 'text-[#64748B] hover:text-[#10B65C]'
            )}
          >
            <item.icon className={cn(
              'h-5 w-5 shrink-0 transition-colors',
              isActive ? 'text-[#10B65C]' : ''
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
                className={cn(
                  'h-5 min-w-5 justify-center text-xs rounded-full',
                  isActive 
                    ? 'bg-[#10B65C] text-white' 
                    : 'bg-[#E5E7EB] text-[#64748B]'
                )}
              >
                {item.badge}
              </Badge>
            )}
            {item.badge && collapsed && (
              <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-[#10B65C]" />
            )}
          </Link>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.name}
            {item.badge && (
              <Badge className="h-5 min-w-5 justify-center text-xs bg-[#10B65C] text-white">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  const NavSection = ({ title, items }: { title: string; items: typeof platformNav }) => (
    <div className="space-y-1">
      <AnimatePresence>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
          >
            {title}
          </motion.p>
        )}
      </AnimatePresence>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.name}>
            <NavItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-[#E5E7EB] bg-white flex flex-col"
      >
        {/* Logo - Centered */}
        <div className="flex h-16 items-center justify-center border-b border-[#E5E7EB] px-4">
          <Link href="/" className="flex items-center justify-center gap-3">
            <div className="relative h-8 w-8 shrink-0">
              <Image 
                src="/allocations-icon.png" 
                alt="Allocations" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-xl text-[#0F172A] whitespace-nowrap overflow-hidden"
                >
                  Allocations
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
          <NavSection title="Platform" items={platformNav} />
          <NavSection title="Finance" items={financeNav} />
          <NavSection title="Administration" items={adminNav} />
        </nav>


      </motion.aside>
    </TooltipProvider>
  )
}
