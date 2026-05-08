'use client'

import { Server, Palette, Cloud, Database, Shield, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Ticket, TicketStatus, TicketPriority, TicketQueue } from '@/lib/ticket-data'

interface TicketTableProps {
  tickets: Ticket[]
  onTicketClick: (ticket: Ticket) => void
}

const statusConfig: Record<TicketStatus, { bg: string; text: string; dot: string }> = {
  'Open': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'In Progress': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'In Review': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Resolved': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'Closed': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
}

const priorityConfig: Record<TicketPriority, { bg: string; text: string }> = {
  'Critical': { bg: 'bg-red-100', text: 'text-red-800' },
  'High': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Low': { bg: 'bg-green-100', text: 'text-green-800' },
}

const queueIcons: Record<TicketQueue, React.ElementType> = {
  'Backend / API': Server,
  'Frontend': Palette,
  'Infra / Cloud': Cloud,
  'Data / DB': Database,
  'Security': Shield,
  'Mobile': Smartphone,
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', config.bg, config.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = priorityConfig[priority]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', config.bg, config.text)}>
      {priority}
    </span>
  )
}

function QueueLabel({ queue }: { queue: TicketQueue }) {
  const Icon = queueIcons[queue]
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-600">
      <Icon className="h-3.5 w-3.5" />
      <span>{queue}</span>
    </div>
  )
}

function AssigneeAvatar({ name, initials, color }: { name: string | null; initials: string | null; color: string | null }) {
  if (!name || !initials) {
    return <span className="text-sm text-gray-400">Unassigned</span>
  }
  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white', color)}>
        {initials}
      </div>
      <span className="text-sm text-gray-700">{name.split(' ')[0]}</span>
    </div>
  )
}

export function TicketTable({ tickets, onTicketClick }: TicketTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Queue</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Assignee</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr
              key={ticket.id}
              onClick={() => onTicketClick(ticket)}
              className={cn(
                'cursor-pointer transition-colors hover:bg-gray-50',
                index !== tickets.length - 1 && 'border-b border-gray-100'
              )}
            >
              <td className="px-4 py-3">
                <span className="font-mono text-sm font-medium text-[#1a56db]">{ticket.id}</span>
              </td>
              <td className="max-w-[300px] px-4 py-3">
                <div className="truncate font-medium text-gray-900">{ticket.title}</div>
                <div className="mt-0.5 text-xs text-gray-500">
                  {ticket.environment} · {ticket.queue}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3">
                <QueueLabel queue={ticket.queue} />
              </td>
              <td className="px-4 py-3">
                <AssigneeAvatar 
                  name={ticket.assignee} 
                  initials={ticket.assigneeInitials} 
                  color={ticket.avatarColor} 
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{ticket.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {tickets.length === 0 && (
        <div className="py-12 text-center text-sm text-gray-500">
          No tickets found matching your filters.
        </div>
      )}
    </div>
  )
}
