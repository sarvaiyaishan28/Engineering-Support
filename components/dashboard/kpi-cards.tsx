'use client'

import { motion } from 'framer-motion'
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Timer
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    key: 'inProgress' as const,
    label: 'In Progress',
    icon: Clock,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    key: 'resolvedToday' as const,
    label: 'Resolved Today',
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    key: 'criticalIssues' as const,
    label: 'Critical Issues',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  {
    key: 'slaBreached' as const,
    label: 'SLA Breached',
    icon: AlertOctagon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    key: 'avgResolutionTime' as const,
    label: 'Avg Resolution',
    icon: Timer,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    suffix: 'h'
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
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {value}
                      {kpi.suffix && (
                        <span className="text-sm font-normal text-muted-foreground ml-0.5">
                          {kpi.suffix}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className={cn('p-2 rounded-lg', kpi.bgColor)}>
                    <Icon className={cn('h-4 w-4', kpi.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
