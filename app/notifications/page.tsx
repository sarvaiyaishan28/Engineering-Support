'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Bell,
  CheckCheck,
  Trash2,
  UserPlus,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  AtSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockNotifications } from '@/lib/mock-data'
import type { Notification, NotificationType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const notificationIcons: Record<NotificationType, typeof Bell> = {
  TICKET_ASSIGNED: UserPlus,
  NEW_COMMENT: MessageSquare,
  MENTIONED: AtSign,
  STATUS_CHANGED: RefreshCw,
  SLA_BREACHED: AlertTriangle,
  SLA_WARNING: AlertTriangle
}

const notificationColors: Record<NotificationType, string> = {
  TICKET_ASSIGNED: 'text-blue-500 bg-blue-100 dark:bg-blue-950',
  NEW_COMMENT: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-950',
  MENTIONED: 'text-purple-500 bg-purple-100 dark:bg-purple-950',
  STATUS_CHANGED: 'text-orange-500 bg-orange-100 dark:bg-orange-950',
  SLA_BREACHED: 'text-red-500 bg-red-100 dark:bg-red-950',
  SLA_WARNING: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950'
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState('all')

  const unreadCount = notifications.filter(n => !n.isRead).length

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    )
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification deleted')
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.ticketId) {
      router.push(`/tickets/${notification.ticketId}`)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-1">No notifications</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'unread' 
                    ? 'You have read all your notifications'
                    : 'You have no notifications yet'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="divide-y">
                {filteredNotifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type]
                  const colorClass = notificationColors[notification.type]

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        'flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors',
                        !notification.isRead && 'bg-primary/5'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Icon */}
                      <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={cn(
                              'text-sm',
                              !notification.isRead && 'font-medium'
                            )}>
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                {notification.message}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            {!notification.isRead && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
