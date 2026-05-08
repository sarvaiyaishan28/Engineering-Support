'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'
import type {
  TicketsByStatusData,
  TicketsByPriorityData,
  WeeklyTrendData,
  EngineerWorkloadData
} from '@/lib/types'

interface ChartsProps {
  ticketsByStatus: TicketsByStatusData[]
  ticketsByPriority: TicketsByPriorityData[]
  weeklyTrend: WeeklyTrendData[]
  engineerWorkload: EngineerWorkloadData[]
}

const COLORS = ['#3B82F6', '#9333EA', '#FACC15', '#0891B2', '#EF4444', '#10B65C', '#64748B']

export function DashboardCharts({
  ticketsByStatus,
  ticketsByPriority,
  weeklyTrend,
  engineerWorkload
}: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tickets by Status - Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white border border-[#E5E7EB] rounded-2xl">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#0F172A]">Tickets by Status</h3>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsByStatus} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis 
                    type="category" 
                    dataKey="status" 
                    tick={{ fontSize: 12, fill: '#64748B' }} 
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[0, 6, 6, 0]}
                  >
                    {ticketsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tickets by Priority - Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="bg-white border border-[#E5E7EB] rounded-2xl">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#0F172A]">Tickets by Priority</h3>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketsByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="priority"
                  >
                    {ticketsByPriority.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.priority === 'Critical' ? '#EF4444' :
                          entry.priority === 'High' ? '#F97316' :
                          entry.priority === 'Medium' ? '#3B82F6' :
                          '#64748B'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'white'
                    }}
                  />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: '#64748B', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Trend - Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="bg-white border border-[#E5E7EB] rounded-2xl">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#0F172A]">Weekly Ticket Trend</h3>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'white'
                    }}
                  />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => <span style={{ color: '#64748B', fontSize: '12px' }}>{value}</span>}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="created" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 0, r: 4 }}
                    name="Created"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#10B65C" 
                    strokeWidth={2}
                    dot={{ fill: '#10B65C', strokeWidth: 0, r: 4 }}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Engineer Workload - Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="bg-white border border-[#E5E7EB] rounded-2xl">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#0F172A]">Engineer Workload</h3>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engineerWorkload}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'white'
                    }}
                  />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => <span style={{ color: '#64748B', fontSize: '12px' }}>{value}</span>}
                  />
                  <Bar 
                    dataKey="tickets" 
                    fill="#10B65C" 
                    name="Active Tickets"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
