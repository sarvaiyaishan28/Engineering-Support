'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  PlusCircle,
  UserPlus,
  RefreshCw,
  MessageSquare,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Activity } from '@/lib/types'

interface ActivityFeedProps {
  activities: Activity[]
}

const actionConfig: Record<string, { icon: typeof PlusCircle; color: string; bgColor: string }> = {
  created: { icon: PlusCircle, color: 'text-[#3B82F6]', bgColor: 'bg-[#DBEAFE]' },
  assigned: { icon: UserPlus, color: 'text-[#9333EA]', bgColor: 'bg-[#F3E8FF]' },
  status_changed: { icon: RefreshCw, color: 'text-[#EA580C]', bgColor: 'bg-[#FFEDD5]' },
  comment_added: { icon: MessageSquare, color: 'text-[#0891B2]', bgColor: 'bg-[#CFFAFE]' },
  priority_changed: { icon: AlertTriangle, color: 'text-[#DC2626]', bgColor: 'bg-[#FEE2E2]' },
  resolved: { icon: CheckCircle2, color: 'text-[#16A34A]', bgColor: 'bg-[#DCFCE7]' }
}

function getActivityMessage(activity: Activity): string {
  const metadata = activity.metadata as Record<string, unknown> | null
  
  switch (activity.action) {
    case 'created':
      return `created ticket "${metadata?.title || 'Unknown'}"`
    case 'assigned':
      return `assigned ticket to ${metadata?.assignee || 'someone'}`
    case 'status_changed':
      return `changed status from ${metadata?.from || 'Unknown'} to ${metadata?.to || 'Unknown'}`
    case 'comment_added':
      return `added a comment`
    case 'priority_changed':
      return `changed priority from ${metadata?.from || 'Unknown'} to ${metadata?.to || 'Unknown'}`
    case 'resolved':
      return `resolved the ticket`
    default:
      return activity.action
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl">
      <div className="px-6 py-4 border-b border-[#E5E7EB]">
        <h3 className="text-base font-semibold text-[#0F172A]">Recent Activity</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {activities.map((activity, index) => {
          const config = actionConfig[activity.action] || actionConfig.created
          const Icon = config.icon

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex gap-3 px-6 py-4 border-b border-[#E5E7EB] last:border-0 hover:bg-[#F8FAFC] transition-colors"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-[#E5E7EB] text-[#64748B]">
                    {activity.user ? getInitials(activity.user.name) : '?'}
                  </AvatarFallback>
                </Avatar>
                {index < activities.length - 1 && (
                  <div className="w-px flex-1 bg-[#E5E7EB] mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-[#0F172A] truncate">
                    {activity.user?.name || 'Unknown'}
                  </span>
                  <div className={cn('p-1 rounded-lg', config.bgColor)}>
                    <Icon className={cn('h-3 w-3', config.color)} />
                  </div>
                </div>
                <p className="text-sm text-[#64748B] mt-0.5">
                  {getActivityMessage(activity)}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
