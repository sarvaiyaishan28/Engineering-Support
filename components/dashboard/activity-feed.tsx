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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Activity } from '@/lib/types'

interface ActivityFeedProps {
  activities: Activity[]
}

const actionConfig: Record<string, { icon: typeof PlusCircle; color: string; bgColor: string }> = {
  created: { icon: PlusCircle, color: 'text-blue-500', bgColor: 'bg-blue-500' },
  assigned: { icon: UserPlus, color: 'text-purple-500', bgColor: 'bg-purple-500' },
  status_changed: { icon: RefreshCw, color: 'text-orange-500', bgColor: 'bg-orange-500' },
  comment_added: { icon: MessageSquare, color: 'text-cyan-500', bgColor: 'bg-cyan-500' },
  priority_changed: { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-500' },
  resolved: { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-500' }
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
                className="flex gap-3 px-6 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-muted">
                      {activity.user ? getInitials(activity.user.name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  {index < activities.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {activity.user?.name || 'Unknown'}
                    </span>
                    <div className={cn('p-1 rounded', `${config.bgColor}/10`)}>
                      <Icon className={cn('h-3 w-3', config.color)} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {getActivityMessage(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
