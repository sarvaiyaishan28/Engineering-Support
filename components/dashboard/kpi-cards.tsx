'use client'

import { motion } from 'framer-motion'
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Timer,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DashboardStats } from '@/lib/types'

interface KPICardsProps {
  stats: DashboardStats
}

const kpiConfig = [
  {
    key: 'openTickets' as const,
    label: 'Open Tickets',
    icon: Ticket,
    color: 'text-[#3B82F6]',
    bgColor: 'bg-[#DBEAFE]',
    highlight: false
  },
  {
    key: 'inProgress' as const,
    label: 'In Progress',
    icon: Clock,
    color: 'text-[#9333EA]',
    bgColor: 'bg-[#F3E8FF]',
    highlight: false
  },
  {
    key: 'resolvedToday' as const,
    label: 'Resolved Today',
    icon: CheckCircle2,
    color: 'text-white',
    bgColor: 'bg-[#10B65C]',
    highlight: true
  },
  {
    key: 'criticalIssues' as const,
    label: 'Critical Issues',
    icon: AlertTriangle,
    color: 'text-[#DC2626]',
    bgColor: 'bg-[#FEE2E2]',
    highlight: false
  },
  {
    key: 'slaBreached' as const,
    label: 'SLA Breached',
    icon: AlertOctagon,
    color: 'text-[#EA580C]',
    bgColor: 'bg-[#FFEDD5]',
    highlight: false
  },
  {
    key: 'avgResolutionTime' as const,
    label: 'Avg Resolution',
    icon: Timer,
    color: 'text-[#0891B2]',
    bgColor: 'bg-[#CFFAFE]',
    suffix: 'h',
    highlight: false
  }
]

export function KPICards({ stats }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpiConfig.map((kpi, index) => {
        const value = stats[kpi.key]
        const Icon = kpi.icon

        return (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div 
              className={cn(
                "rounded-2xl p-5 transition-all hover:shadow-md",
                kpi.highlight 
                  ? "bg-[#10B65C] text-white" 
                  : "bg-white border border-[#E5E7EB]"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className={cn(
                    "text-xs font-medium",
                    kpi.highlight ? "text-white/80" : "text-[#64748B]"
                  )}>
                    {kpi.label}
                  </p>
                  <p className={cn(
                    "text-2xl font-bold tracking-tight",
                    kpi.highlight ? "text-white" : "text-[#0F172A]"
                  )}>
                    {value}
                    {kpi.suffix && (
                      <span className={cn(
                        "text-sm font-normal ml-0.5",
                        kpi.highlight ? "text-white/70" : "text-[#94A3B8]"
                      )}>
                        {kpi.suffix}
                      </span>
                    )}
                  </p>
                </div>
                {kpi.highlight ? (
                  <TrendingUp className="h-6 w-6 text-white/60" />
                ) : (
                  <div className={cn('p-2 rounded-xl', kpi.bgColor)}>
                    <Icon className={cn('h-4 w-4', kpi.color)} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
