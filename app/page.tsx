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
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Dashboard</h1>
        <p className="text-[#64748B]">
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
            className="rounded-2xl border border-[#E5E7EB] bg-white p-6"
          >
            <h3 className="font-semibold mb-4 text-[#0F172A]">SLA Compliance Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-[#DCFCE7]">
                <div className="text-3xl font-bold text-[#16A34A]">89%</div>
                <div className="text-sm text-[#64748B] mt-1">On Track</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#FEF9C3]">
                <div className="text-3xl font-bold text-[#CA8A04]">8%</div>
                <div className="text-sm text-[#64748B] mt-1">At Risk</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#FEE2E2]">
                <div className="text-3xl font-bold text-[#DC2626]">3%</div>
                <div className="text-sm text-[#64748B] mt-1">Breached</div>
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
