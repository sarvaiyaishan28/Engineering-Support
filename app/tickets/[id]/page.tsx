'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { formatDistanceToNow, format } from 'date-fns'
import {
  ArrowLeft,
  Clock,
  User,
  Tag,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  Activity,
  MoreHorizontal,
  Send,
  Eye,
  EyeOff,
  Edit2,
  Link2,
  Timer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { mockTickets, mockComments, mockActivities, mockUsers } from '@/lib/mock-data'
import { statusConfig, priorityConfig, categoryConfig, environmentConfig, getSLAStatus, getSLAHours } from '@/lib/types'
import type { TicketStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [activeTab, setActiveTab] = useState('overview')
  const [newComment, setNewComment] = useState('')
  const [isInternalComment, setIsInternalComment] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Find ticket
  const ticket = useMemo(() => {
    return mockTickets.find(t => t.id === ticketId)
  }, [ticketId])

  // Get comments for this ticket
  const comments = useMemo(() => {
    return mockComments.filter(c => c.ticketId === ticketId)
  }, [ticketId])

  // Get activities for this ticket
  const activities = useMemo(() => {
    return mockActivities.filter(a => a.ticketId === ticketId)
  }, [ticketId])

  const engineers = mockUsers.filter(u => u.role === 'ENGINEERING' || u.role === 'ADMIN')

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Ticket not found</p>
        <Button variant="outline" onClick={() => router.push('/tickets')}>
          Back to Tickets
        </Button>
      </div>
    )
  }

  const slaStatus = getSLAStatus(ticket.slaDueAt, ticket.slaBreached)
  const slaHours = getSLAHours(ticket.priority)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleStatusChange = (newStatus: TicketStatus) => {
    toast.success(`Status updated to ${statusConfig[newStatus].label}`)
  }

  const handleAssigneeChange = (assigneeId: string) => {
    const assignee = assigneeId === 'unassigned' 
      ? 'Unassigned' 
      : mockUsers.find(u => u.id === assigneeId)?.name
    toast.success(`Assigned to ${assignee}`)
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    
    setIsSubmittingComment(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success(isInternalComment ? 'Internal note added' : 'Comment added')
      setNewComment('')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const getSLATimeRemaining = () => {
    if (!ticket.slaDueAt) return null
    const now = new Date()
    const due = new Date(ticket.slaDueAt)
    const diff = due.getTime() - now.getTime()
    
    if (diff <= 0) return 'Overdue'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/tickets')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {ticket.ticketNumber}
                </span>
                <Badge className={cn(priorityConfig[ticket.priority].bgColor)}>
                  {priorityConfig[ticket.priority].label}
                </Badge>
                <Badge variant="outline" className={cn(statusConfig[ticket.status].bgColor, statusConfig[ticket.status].color)}>
                  {statusConfig[ticket.status].label}
                </Badge>
                {slaStatus !== 'healthy' && (
                  <Badge variant={slaStatus === 'breached' ? 'destructive' : 'outline'} className={slaStatus === 'warning' ? 'border-yellow-500 text-yellow-600' : ''}>
                    {slaStatus === 'breached' ? 'SLA Breached' : 'SLA Warning'}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem>Link issue</DropdownMenuItem>
                <DropdownMenuItem>Add watcher</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Close ticket</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">
                  Activity
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {activities.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="comments">
                  Comments
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {comments.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                  </CardContent>
                </Card>

                {/* Steps to Reproduce */}
                {ticket.stepsToReproduce && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Steps to Reproduce</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{ticket.stepsToReproduce}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Impact */}
                {ticket.impact && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Business Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{ticket.impact}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Technical Info */}
                {(ticket.browserInfo || ticket.environment) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Technical Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Environment</span>
                        <Badge variant="outline" className={environmentConfig[ticket.environment].bgColor}>
                          {environmentConfig[ticket.environment].label}
                        </Badge>
                      </div>
                      {ticket.browserInfo && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Browser</span>
                          <span>{ticket.browserInfo}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    {activities.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No activity yet</p>
                    ) : (
                      <div className="space-y-4">
                        {activities.map((activity, index) => (
                          <div key={activity.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {activity.user ? getInitials(activity.user.name) : '?'}
                                </AvatarFallback>
                              </Avatar>
                              {index < activities.length - 1 && (
                                <div className="w-px flex-1 bg-border mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{activity.user?.name}</span>
                                <span className="text-sm text-muted-foreground">{activity.action.replace('_', ' ')}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-6 space-y-4">
                {/* Add Comment */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Textarea
                        placeholder={isInternalComment ? "Add an internal note (only visible to team)..." : "Add a comment..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className={isInternalComment ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200' : ''}
                      />
                      <div className="flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isInternalComment ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => setIsInternalComment(!isInternalComment)}
                              className="gap-2"
                            >
                              {isInternalComment ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              {isInternalComment ? 'Internal Note' : 'Public Comment'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isInternalComment ? 'Only team members can see this' : 'Visible to everyone'}
                          </TooltipContent>
                        </Tooltip>
                        <Button
                          size="sm"
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim() || isSubmittingComment}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {isInternalComment ? 'Add Note' : 'Comment'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments List */}
                {comments.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No comments yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className={comment.isInternal ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/10' : ''}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {comment.user ? getInitials(comment.user.name) : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.user?.name}</span>
                              {comment.isInternal && (
                                <Badge variant="outline" className="text-xs bg-yellow-100 border-yellow-300">
                                  Internal
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{comment.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="attachments" className="mt-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No attachments</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Upload File
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Select value={ticket.status} onValueChange={(v) => handleStatusChange(v as TicketStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Assignee</label>
                  <Select
                    value={ticket.assigneeId || 'unassigned'}
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {engineers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* SLA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  SLA Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  'p-3 rounded-lg text-center',
                  slaStatus === 'healthy' ? 'bg-green-50 dark:bg-green-950/20' :
                  slaStatus === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                  'bg-red-50 dark:bg-red-950/20'
                )}>
                  <div className={cn(
                    'text-2xl font-bold',
                    slaStatus === 'healthy' ? 'text-green-600' :
                    slaStatus === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  )}>
                    {getSLATimeRemaining() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {slaHours}h SLA for {priorityConfig[ticket.priority].label} priority
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Reporter
                  </span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">
                        {ticket.reporter ? getInitials(ticket.reporter.name) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{ticket.reporter?.name}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </span>
                  <span className={categoryConfig[ticket.category].color}>
                    {categoryConfig[ticket.category].label}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created
                  </span>
                  <span>{format(ticket.createdAt, 'MMM d, yyyy')}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Updated
                  </span>
                  <span>{formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
