'use client'

import { motion } from 'framer-motion'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { DashboardCharts } from '@/components/dashboard/charts'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import {
  mockDashboardStats,
  mockTicketsByStatus,
  mockTicketsByPriority,
  mockWeeklyTrend,
  mockEngineerWorkload,
  mockActivities
} from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of engineering support ticket metrics and activity
        </p>
      </motion.div>

      {/* KPI Cards */}
      <KPICards stats={mockDashboardStats} />

      {/* Charts Grid */}
      <DashboardCharts
        ticketsByStatus={mockTicketsByStatus}
        ticketsByPriority={mockTicketsByPriority}
        weeklyTrend={mockWeeklyTrend}
        engineerWorkload={mockEngineerWorkload}
      />

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* SLA compliance overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="rounded-xl border bg-card p-6"
          >
            <h3 className="font-semibold mb-4">SLA Compliance Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-500/10">
                <div className="text-3xl font-bold text-green-600">89%</div>
                <div className="text-sm text-muted-foreground mt-1">On Track</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-600">8%</div>
                <div className="text-sm text-muted-foreground mt-1">At Risk</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-500/10">
                <div className="text-3xl font-bold text-red-600">3%</div>
                <div className="text-sm text-muted-foreground mt-1">Breached</div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>
    </div>
  )
}
