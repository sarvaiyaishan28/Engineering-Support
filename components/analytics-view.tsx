'use client'

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
  Legend,
  LineChart,
  Line
} from 'recharts'
import { StatsCards } from './stats-cards'
import type { Ticket } from '@/lib/ticket-data'

interface AnalyticsViewProps {
  tickets: Ticket[]
}

const queueData = [
  { name: 'Backend', tickets: 4 },
  { name: 'Frontend', tickets: 3 },
  { name: 'Infra', tickets: 3 },
  { name: 'Data', tickets: 2 },
]

const priorityData = [
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'High', value: 5, color: '#f97316' },
  { name: 'Medium', value: 4, color: '#eab308' },
  { name: 'Low', value: 1, color: '#22c55e' },
]

const weeklyData = [
  { day: 'Mon', opened: 3, resolved: 2 },
  { day: 'Tue', opened: 5, resolved: 3 },
  { day: 'Wed', opened: 4, resolved: 5 },
  { day: 'Thu', opened: 6, resolved: 4 },
  { day: 'Fri', opened: 3, resolved: 5 },
  { day: 'Sat', opened: 2, resolved: 3 },
  { day: 'Sun', opened: 4, resolved: 3 },
]

const topAssignees = [
  { name: 'Rahul Kumar', initials: 'RK', color: 'bg-blue-500', count: 4 },
  { name: 'Priya Sharma', initials: 'PS', color: 'bg-purple-500', count: 3 },
  { name: 'Vivek Rao', initials: 'VR', color: 'bg-red-500', count: 3 },
  { name: 'Ankit Joshi', initials: 'AJ', color: 'bg-green-500', count: 2 },
]

export function AnalyticsView({ tickets }: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards tickets={tickets} />

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Tickets by Queue - Bar Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Tickets by Queue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={queueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="tickets" fill="#1a56db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tickets by Priority - Pie Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Tickets by Priority</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Line Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Ticket Volume — Last 7 days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} domain={[0, 10]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend 
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-sm text-gray-600 capitalize">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="opened" 
              stroke="#1a56db" 
              strokeWidth={2} 
              dot={{ fill: '#1a56db', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="#22c55e" 
              strokeWidth={2} 
              dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Assignees */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Top Assignees by ticket count</h3>
          <div className="space-y-3">
            {topAssignees.map((assignee, index) => (
              <div key={assignee.name} className="flex items-center gap-3">
                <span className="w-4 text-sm font-medium text-gray-500">{index + 1}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${assignee.color}`}>
                  {assignee.initials}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-900">{assignee.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-[#1a56db] rounded-full" 
                      style={{ width: `${(assignee.count / 4) * 100}%` }}
                    />
                  </div>
                  <span className="w-4 text-sm font-semibold text-gray-900">{assignee.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">SLA Compliance this week</h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-green-600">87%</div>
            <div>
              <p className="text-sm text-gray-500">13% tickets exceeded SLA target</p>
              <div className="mt-2 h-3 w-48 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[87%] rounded-full bg-green-500" />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 border-t border-gray-100 pt-4">
            {[
              { label: 'P0', value: '90%' },
              { label: 'P1', value: '85%' },
              { label: 'P2', value: '92%' },
              { label: 'P3', value: '100%' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-sm font-semibold text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
