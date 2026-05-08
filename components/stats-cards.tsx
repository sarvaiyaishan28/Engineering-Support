'use client'

import { Ticket, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import type { Ticket as TicketType } from '@/lib/ticket-data'

interface StatsCardsProps {
  tickets: TicketType[]
}

export function StatsCards({ tickets }: StatsCardsProps) {
  const openCount = tickets.filter(t => t.status === 'Open').length
  const criticalCount = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved' && t.status !== 'Closed').length
  const resolvedToday = tickets.filter(t => t.status === 'Resolved').length

  const stats = [
    {
      label: 'Total Open Tickets',
      value: openCount,
      subtext: '↑ 2 from yesterday',
      icon: Ticket,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600',
    },
    {
      label: 'Critical Issues',
      value: criticalCount,
      subtext: 'Needs immediate action',
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600',
    },
    {
      label: 'Avg Resolution Time',
      value: '4.2h',
      subtext: 'SLA target: 6h',
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-600',
    },
    {
      label: 'Resolved Today',
      value: resolvedToday,
      subtext: '↑ 1 vs. yesterday',
      icon: CheckCircle,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-3xl font-semibold ${stat.valueColor}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{stat.subtext}</p>
            </div>
            <div className={`rounded-lg p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
