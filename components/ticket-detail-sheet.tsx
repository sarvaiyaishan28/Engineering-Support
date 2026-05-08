'use client'

import { useState } from 'react'
import { Send, ArrowRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { Ticket, TicketStatus, Comment } from '@/lib/ticket-data'

interface TicketDetailSheetProps {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void
  onAddComment: (ticketId: string, comment: Comment) => void
}

const statusConfig: Record<TicketStatus, { bg: string; text: string; dot: string }> = {
  'Open': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'In Progress': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'In Review': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Resolved': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'Closed': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
}

const priorityConfig: Record<string, { bg: string; text: string }> = {
  'Critical': { bg: 'bg-red-100', text: 'text-red-800' },
  'High': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Low': { bg: 'bg-green-100', text: 'text-green-800' },
}

const statusFlow: TicketStatus[] = ['Open', 'In Progress', 'In Review', 'Resolved']

export function TicketDetailSheet({ 
  ticket, 
  open, 
  onOpenChange,
  onUpdateStatus,
  onAddComment 
}: TicketDetailSheetProps) {
  const [newComment, setNewComment] = useState('')

  if (!ticket) return null

  const statusCfg = statusConfig[ticket.status]
  const priorityCfg = priorityConfig[ticket.priority]

  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: 'Rahul Kumar',
      authorInitials: 'RK',
      avatarColor: 'bg-blue-500',
      content: newComment.trim(),
      timestamp: 'Just now',
    }
    
    onAddComment(ticket.id, comment)
    setNewComment('')
  }

  const getNextStatus = (): TicketStatus | null => {
    const currentIndex = statusFlow.indexOf(ticket.status)
    if (currentIndex === -1 || currentIndex >= statusFlow.length - 1) return null
    return statusFlow[currentIndex + 1]
  }

  const nextStatus = getNextStatus()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[680px] max-w-full sm:max-w-[680px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-medium text-[#1a56db]">{ticket.id}</span>
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', statusCfg.bg, statusCfg.text)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
              {ticket.status}
            </span>
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', priorityCfg.bg, priorityCfg.text)}>
              {ticket.priority}
            </span>
          </div>
          <SheetTitle className="text-lg font-semibold text-gray-900 text-left mt-2">
            {ticket.title}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - Main Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {/* Tags & Services */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags & Services</h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {tag}
                    </span>
                  ))}
                  {ticket.services.map((service) => (
                    <span key={service} className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activity / Comments */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity</h3>
                <div className="space-y-4">
                  {ticket.comments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No comments yet.</p>
                  ) : (
                    ticket.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white', comment.avatarColor)}>
                          {comment.authorInitials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">· {comment.timestamp}</span>
                          </div>
                          <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleAddComment} className="bg-[#1a56db] hover:bg-[#1a56db]/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Right Column - Details */}
          <div className="w-[220px] shrink-0 border-l border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Queue</span>
                <span className="text-gray-900 font-medium">{ticket.queue}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-500">Environment</span>
                <span className="text-gray-900">{ticket.environment}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-500">Reporter</span>
                <span className="text-gray-900">{ticket.reporter}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Assignee</span>
                {ticket.assignee ? (
                  <div className="flex items-center gap-1.5">
                    <div className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium text-white', ticket.avatarColor)}>
                      {ticket.assigneeInitials}
                    </div>
                    <span className="text-gray-900">{ticket.assignee.split(' ')[0]}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{ticket.createdAt}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-500">Updated</span>
                <span className="text-gray-900">{ticket.updatedAt}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-500">Severity</span>
                <span className="text-gray-900">{ticket.severity}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              {nextStatus && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => onUpdateStatus(ticket.id, nextStatus)}
                >
                  <ArrowRight className="h-4 w-4" />
                  Move to {nextStatus}
                </Button>
              )}
              {ticket.status !== 'Resolved' && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => onUpdateStatus(ticket.id, 'Resolved')}
                >
                  <Check className="h-4 w-4" />
                  Mark Resolved
                </Button>
              )}
              {ticket.status !== 'Closed' && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-gray-500"
                  onClick={() => onUpdateStatus(ticket.id, 'Closed')}
                >
                  <X className="h-4 w-4" />
                  Close Ticket
                </Button>
              )}
            </div>

            {/* Status Flow */}
            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Status flow</h4>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                {statusFlow.map((status, index) => (
                  <div key={status} className="flex items-center">
                    <span className={cn(
                      'rounded px-1.5 py-0.5',
                      ticket.status === status ? 'bg-blue-100 text-blue-700 font-medium' : ''
                    )}>
                      {status}
                    </span>
                    {index < statusFlow.length - 1 && <span className="mx-1">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
