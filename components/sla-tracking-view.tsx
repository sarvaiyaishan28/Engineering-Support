'use client'

import { cn } from '@/lib/utils'
import type { Ticket, TicketPriority } from '@/lib/ticket-data'

interface SLATrackingViewProps {
  tickets: Ticket[]
}

// SLA targets in hours
const slaTargets: Record<TicketPriority, number> = {
  'Critical': 2,
  'High': 6,
  'Medium': 24,
  'Low': 72,
}

// Mock time open data (in hours) for demonstration
const mockTimeOpen: Record<string, number> = {
  'ENG-001': 2,
  'ENG-002': 4,
  'ENG-003': 6,
  'ENG-004': 24,
  'ENG-005': 24,
  'ENG-006': 48,
  'ENG-007': 72,
  'ENG-008': 72,
  'ENG-009': 96,
  'ENG-010': 120,
  'ENG-011': 120,
  'ENG-012': 144,
}

function getBreachStatus(priority: TicketPriority, timeOpenHours: number): { 
  status: 'breached' | 'at-risk' | 'on-track'
  label: string 
} {
  const target = slaTargets[priority]
  const percentUsed = (timeOpenHours / target) * 100

  if (timeOpenHours > target) {
    return { status: 'breached', label: 'Breached' }
  } else if (percentUsed > 75) {
    return { status: 'at-risk', label: 'At Risk' }
  }
  return { status: 'on-track', label: 'On Track' }
}

const priorityConfig: Record<TicketPriority, { bg: string; text: string }> = {
  'Critical': { bg: 'bg-red-100', text: 'text-red-800' },
  'High': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Low': { bg: 'bg-green-100', text: 'text-green-800' },
}

export function SLATrackingView({ tickets }: SLATrackingViewProps) {
  // Filter to only non-resolved/closed tickets
  const activeTickets = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed')
  
  const slaData = activeTickets.map(ticket => {
    const timeOpen = mockTimeOpen[ticket.id] || 0
    const breach = getBreachStatus(ticket.priority, timeOpen)
    return { ...ticket, timeOpen, breach }
  })

  const breachedCount = slaData.filter(t => t.breach.status === 'breached').length
  const atRiskCount = slaData.filter(t => t.breach.status === 'at-risk').length
  const onTrackCount = slaData.filter(t => t.breach.status === 'on-track').length

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-gray-700">{breachedCount} breached</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium text-gray-700">{atRiskCount} at risk</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-700">{onTrackCount} on track</span>
        </div>
      </div>

      {/* SLA Targets Reference */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">SLA Targets</h3>
        <div className="flex items-center gap-8">
          {Object.entries(slaTargets).map(([priority, hours]) => (
            <div key={priority} className="flex items-center gap-2">
              <span className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                priorityConfig[priority as TicketPriority].bg,
                priorityConfig[priority as TicketPriority].text
              )}>
                {priority}
              </span>
              <span className="text-sm text-gray-600">{hours}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ticket ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">SLA Target</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Time Open</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Breach</th>
            </tr>
          </thead>
          <tbody>
            {slaData.map((ticket, index) => {
              const priorityCfg = priorityConfig[ticket.priority]
              return (
                <tr
                  key={ticket.id}
                  className={cn(
                    'transition-colors hover:bg-gray-50',
                    index !== slaData.length - 1 && 'border-b border-gray-100'
                  )}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-[#1a56db]">{ticket.id}</span>
                  </td>
                  <td className="max-w-[250px] px-4 py-3">
                    <div className="truncate text-sm font-medium text-gray-900">{ticket.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', priorityCfg.bg, priorityCfg.text)}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {slaTargets[ticket.priority]}h
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {ticket.timeOpen}h
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ticket.status}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                      ticket.breach.status === 'breached' && 'bg-red-100 text-red-700',
                      ticket.breach.status === 'at-risk' && 'bg-amber-100 text-amber-700',
                      ticket.breach.status === 'on-track' && 'bg-green-100 text-green-700'
                    )}>
                      {ticket.breach.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {slaData.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No active tickets to track.
          </div>
        )}
      </div>
    </div>
  )
}
