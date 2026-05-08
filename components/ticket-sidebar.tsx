'use client'

import { 
  Ticket, 
  CircleDot, 
  AlertTriangle, 
  User, 
  Server, 
  Palette, 
  Cloud, 
  Database, 
  Shield, 
  Smartphone,
  BarChart3,
  Clock,
  ClipboardList,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Ticket as TicketType } from '@/lib/ticket-data'

type View = 'all' | 'open' | 'in-progress' | 'critical' | 'my-tickets' | 
  'backend' | 'frontend' | 'infra' | 'data' | 'security' | 'mobile' |
  'analytics' | 'sla' | 'audit'

interface TicketSidebarProps {
  tickets: TicketType[]
  currentView: View
  onViewChange: (view: View) => void
  currentUser: string
}

export function TicketSidebar({ tickets, currentView, onViewChange, currentUser }: TicketSidebarProps) {
  const openCount = tickets.filter(t => t.status === 'Open').length
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length
  const criticalCount = tickets.filter(t => t.priority === 'Critical').length
  const myTicketsCount = tickets.filter(t => t.assignee === currentUser).length

  const queueCounts = {
    backend: tickets.filter(t => t.queue === 'Backend / API').length,
    frontend: tickets.filter(t => t.queue === 'Frontend').length,
    infra: tickets.filter(t => t.queue === 'Infra / Cloud').length,
    data: tickets.filter(t => t.queue === 'Data / DB').length,
    security: tickets.filter(t => t.queue === 'Security').length,
    mobile: tickets.filter(t => t.queue === 'Mobile').length,
  }

  const NavItem = ({ 
    icon: Icon, 
    label, 
    count, 
    view, 
    countColor = 'bg-gray-100 text-gray-600' 
  }: { 
    icon: React.ElementType
    label: string
    count?: number
    view: View
    countColor?: string
  }) => (
    <button
      onClick={() => onViewChange(view)}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
        currentView === view
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', countColor)}>
          {count}
        </span>
      )}
    </button>
  )

  return (
    <aside className="flex h-screen w-[220px] flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a56db]">
            <Ticket className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Allocations.com</div>
            <div className="text-xs text-gray-500">Engineering Support</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Tickets Section */}
        <div className="mb-6">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Tickets
          </div>
          <div className="space-y-1">
            <NavItem icon={Ticket} label="All Tickets" count={tickets.length} view="all" />
            <NavItem 
              icon={CircleDot} 
              label="Open" 
              count={openCount} 
              view="open" 
              countColor="bg-blue-100 text-blue-700"
            />
            <NavItem 
              icon={CircleDot} 
              label="In Progress" 
              count={inProgressCount} 
              view="in-progress" 
              countColor="bg-purple-100 text-purple-700"
            />
            <NavItem 
              icon={AlertTriangle} 
              label="Critical" 
              count={criticalCount} 
              view="critical" 
              countColor="bg-red-100 text-red-700"
            />
            <NavItem icon={User} label="My Tickets" count={myTicketsCount} view="my-tickets" />
          </div>
        </div>

        {/* Queues Section */}
        <div className="mb-6">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Queues
          </div>
          <div className="space-y-1">
            <NavItem icon={Server} label="Backend / API" count={queueCounts.backend} view="backend" />
            <NavItem icon={Palette} label="Frontend" count={queueCounts.frontend} view="frontend" />
            <NavItem icon={Cloud} label="Infra / Cloud" count={queueCounts.infra} view="infra" />
            <NavItem icon={Database} label="Data / DB" count={queueCounts.data} view="data" />
            <NavItem icon={Shield} label="Security" count={queueCounts.security} view="security" />
            <NavItem icon={Smartphone} label="Mobile" count={queueCounts.mobile} view="mobile" />
          </div>
        </div>

        {/* Views Section */}
        <div>
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Views
          </div>
          <div className="space-y-1">
            <NavItem icon={BarChart3} label="Analytics" view="analytics" />
            <NavItem icon={Clock} label="SLA Tracking" view="sla" />
            <NavItem icon={ClipboardList} label="Audit Log" view="audit" />
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
              RK
            </div>
            <div className="text-sm font-medium text-gray-900">Rahul Kumar</div>
          </div>
          <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
