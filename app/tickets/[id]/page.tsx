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
        <p className="text-[#64748B]">Ticket not found</p>
        <Button 
          variant="outline" 
          onClick={() => router.push('/tickets')}
          className="rounded-xl border-[#E5E7EB]"
        >
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

  const getStatusBadge = (status: TicketStatus) => {
    const config = {
      OPEN: { bg: 'bg-[#F3F4F6]', text: 'text-[#64748B]', label: 'Open' },
      PENDING: { bg: 'bg-[#FEF9C3]', text: 'text-[#CA8A04]', label: 'Pending' },
      IN_PROGRESS: { bg: 'bg-[#FEF9C3]', text: 'text-[#CA8A04]', label: 'In Progress' },
      QA_REVIEW: { bg: 'bg-[#F3E8FF]', text: 'text-[#9333EA]', label: 'QA Review' },
      BLOCKED: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', label: 'Blocked' },
      RESOLVED: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', label: 'Resolved' },
      CLOSED: { bg: 'bg-[#DBEAFE]', text: 'text-[#3B82F6]', label: 'Closed' },
    }
    const c = config[status]
    return (
      <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', c.bg, c.text)}>
        {c.label}
      </span>
    )
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
              className="rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-[#64748B]">
                  {ticket.ticketNumber}
                </span>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                  ticket.priority === 'CRITICAL' && 'bg-[#FEE2E2] text-[#DC2626]',
                  ticket.priority === 'HIGH' && 'bg-[#FFEDD5] text-[#EA580C]',
                  ticket.priority === 'MEDIUM' && 'bg-[#DBEAFE] text-[#2563EB]',
                  ticket.priority === 'LOW' && 'bg-[#F3F4F6] text-[#64748B]',
                )}>
                  {priorityConfig[ticket.priority].label}
                </span>
                {getStatusBadge(ticket.status)}
                {slaStatus !== 'healthy' && (
                  <Badge 
                    className={cn(
                      'rounded-full',
                      slaStatus === 'breached' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FEF9C3] text-[#CA8A04]'
                    )}
                  >
                    {slaStatus === 'breached' ? 'SLA Breached' : 'SLA Warning'}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{ticket.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-[#E5E7EB] text-[#64748B]">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl border-[#E5E7EB]">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-[#E5E7EB]">
                <DropdownMenuItem className="cursor-pointer">
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Link issue</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Add watcher</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E5E7EB]" />
                <DropdownMenuItem className="cursor-pointer text-[#EF4444]">Close ticket</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[#F3F4F6] rounded-xl p-1">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F172A]">Overview</TabsTrigger>
                <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F172A]">
                  Activity
                  <Badge className="ml-2 h-5 px-1.5 bg-[#E5E7EB] text-[#64748B]">
                    {activities.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="comments" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F172A]">
                  Comments
                  <Badge className="ml-2 h-5 px-1.5 bg-[#E5E7EB] text-[#64748B]">
                    {comments.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="attachments" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0F172A]">Attachments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Description */}
                <Card className="rounded-2xl border-[#E5E7EB]">
                  <CardHeader>
                    <CardTitle className="text-base text-[#0F172A]">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#64748B] whitespace-pre-wrap">{ticket.description}</p>
                  </CardContent>
                </Card>

                {/* Steps to Reproduce */}
                {ticket.stepsToReproduce && (
                  <Card className="rounded-2xl border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-base text-[#0F172A]">Steps to Reproduce</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#64748B] whitespace-pre-wrap">{ticket.stepsToReproduce}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Impact */}
                {ticket.impact && (
                  <Card className="rounded-2xl border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-base text-[#0F172A]">Business Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#64748B]">{ticket.impact}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Technical Info */}
                {(ticket.browserInfo || ticket.environment) && (
                  <Card className="rounded-2xl border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-base text-[#0F172A]">Technical Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#64748B]">Environment</span>
                        <span className="px-2 py-0.5 bg-[#F3F4F6] rounded text-[#0F172A] text-xs font-medium">
                          {environmentConfig[ticket.environment].label}
                        </span>
                      </div>
                      {ticket.browserInfo && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#64748B]">Browser</span>
                          <span className="text-[#0F172A]">{ticket.browserInfo}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card className="rounded-2xl border-[#E5E7EB]">
                  <CardContent className="p-6">
                    {activities.length === 0 ? (
                      <p className="text-center text-[#64748B] py-8">No activity yet</p>
                    ) : (
                      <div className="space-y-4">
                        {activities.map((activity, index) => (
                          <div key={activity.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-[#E5E7EB] text-[#64748B]">
                                  {activity.user ? getInitials(activity.user.name) : '?'}
                                </AvatarFallback>
                              </Avatar>
                              {index < activities.length - 1 && (
                                <div className="w-px flex-1 bg-[#E5E7EB] mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-[#0F172A]">{activity.user?.name}</span>
                                <span className="text-sm text-[#64748B]">{activity.action.replace('_', ' ')}</span>
                              </div>
                              <p className="text-xs text-[#94A3B8] mt-1">
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
                <Card className="rounded-2xl border-[#E5E7EB]">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Textarea
                        placeholder={isInternalComment ? "Add an internal note (only visible to team)..." : "Add a comment..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className={cn(
                          "rounded-xl border-[#E5E7EB] focus:border-[#10B65C] focus:ring-[#10B65C]",
                          isInternalComment && 'bg-[#FEF9C3]/20 border-[#FACC15]/30'
                        )}
                      />
                      <div className="flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isInternalComment ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => setIsInternalComment(!isInternalComment)}
                              className={cn(
                                "gap-2 rounded-lg",
                                isInternalComment && "bg-[#FEF9C3] text-[#CA8A04]"
                              )}
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
                          className="rounded-xl bg-[#10B65C] hover:bg-[#0EA550] text-white"
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
                  <Card className="rounded-2xl border-[#E5E7EB]">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-[#E5E7EB] mb-2" />
                      <p className="text-[#64748B]">No comments yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  comments.map((comment) => (
                    <Card 
                      key={comment.id} 
                      className={cn(
                        "rounded-2xl",
                        comment.isInternal 
                          ? 'border-[#FACC15]/30 bg-[#FEF9C3]/10' 
                          : 'border-[#E5E7EB]'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-[#E5E7EB] text-[#64748B]">
                              {comment.user ? getInitials(comment.user.name) : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-[#0F172A]">{comment.user?.name}</span>
                              {comment.isInternal && (
                                <Badge className="text-xs bg-[#FEF9C3] text-[#CA8A04] rounded-full">
                                  Internal
                                </Badge>
                              )}
                              <span className="text-xs text-[#94A3B8]">
                                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-[#64748B] whitespace-pre-wrap">{comment.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="attachments" className="mt-6">
                <Card className="rounded-2xl border-[#E5E7EB]">
                  <CardContent className="p-8 text-center">
                    <Paperclip className="h-8 w-8 mx-auto text-[#E5E7EB] mb-2" />
                    <p className="text-[#64748B]">No attachments</p>
                    <Button variant="outline" size="sm" className="mt-4 rounded-xl border-[#E5E7EB]">
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
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-base text-[#0F172A]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm text-[#64748B]">Status</label>
                  <Select value={ticket.status} onValueChange={(v) => handleStatusChange(v as TicketStatus)}>
                    <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <label className="text-sm text-[#64748B]">Assignee</label>
                  <Select
                    value={ticket.assigneeId || 'unassigned'}
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
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
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-base text-[#0F172A] flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  SLA Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  'p-4 rounded-xl text-center',
                  slaStatus === 'healthy' ? 'bg-[#DCFCE7]' :
                  slaStatus === 'warning' ? 'bg-[#FEF9C3]' :
                  'bg-[#FEE2E2]'
                )}>
                  <div className={cn(
                    'text-2xl font-bold',
                    slaStatus === 'healthy' ? 'text-[#16A34A]' :
                    slaStatus === 'warning' ? 'text-[#CA8A04]' :
                    'text-[#DC2626]'
                  )}>
                    {getSLATimeRemaining() || 'N/A'}
                  </div>
                  <div className="text-xs text-[#64748B] mt-1">
                    {slaHours}h SLA for {priorityConfig[ticket.priority].label} priority
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-base text-[#0F172A]">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Reporter
                  </span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px] bg-[#E5E7EB] text-[#64748B]">
                        {ticket.reporter ? getInitials(ticket.reporter.name) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[#0F172A]">{ticket.reporter?.name}</span>
                  </div>
                </div>

                <Separator className="bg-[#E5E7EB]" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </span>
                  <span className="px-2 py-0.5 bg-[#F3F4F6] rounded text-[#0F172A] text-xs font-medium">
                    {categoryConfig[ticket.category].label}
                  </span>
                </div>

                <Separator className="bg-[#E5E7EB]" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created
                  </span>
                  <span className="text-[#0F172A]">{format(ticket.createdAt, 'MMM d, yyyy')}</span>
                </div>

                <Separator className="bg-[#E5E7EB]" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Updated
                  </span>
                  <span className="text-[#0F172A]">{formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <Card className="rounded-2xl border-[#E5E7EB]">
                <CardHeader>
                  <CardTitle className="text-base text-[#0F172A]">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} className="bg-[#F3F4F6] text-[#64748B] rounded-full">
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
