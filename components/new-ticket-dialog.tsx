'use client'

import { useState } from 'react'
import { Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TicketPriority, TicketQueue, Environment, Severity, Ticket as TicketType } from '@/lib/ticket-data'
import { teamMembers } from '@/lib/ticket-data'

interface NewTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTicket: (ticket: Omit<TicketType, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void
  nextTicketNumber: number
}

export function NewTicketDialog({ open, onOpenChange, onCreateTicket, nextTicketNumber }: NewTicketDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('Medium')
  const [queue, setQueue] = useState<TicketQueue>('Backend / API')
  const [reporter, setReporter] = useState('')
  const [assignee, setAssignee] = useState<string>('')
  const [environment, setEnvironment] = useState<Environment>('Production')
  const [tags, setTags] = useState('')
  const [services, setServices] = useState('')
  const [severity, setSeverity] = useState<Severity>('P2 - Minor')
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  const handleSubmit = () => {
    const newErrors: { title?: string; description?: string } = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const selectedMember = teamMembers.find(m => m.name === assignee)

    onCreateTicket({
      title: title.trim(),
      description: description.trim(),
      status: 'Open',
      priority,
      queue,
      assignee: assignee || null,
      assigneeInitials: selectedMember?.initials || null,
      avatarColor: selectedMember?.color || null,
      reporter: reporter || 'Unknown',
      environment,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      services: services.split(',').map(s => s.trim()).filter(Boolean),
      severity,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setQueue('Backend / API')
    setReporter('')
    setAssignee('')
    setEnvironment('Production')
    setTags('')
    setServices('')
    setSeverity('P2 - Minor')
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#1a56db]" />
            Create engineering ticket
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Brief description of the issue..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({ ...errors, title: undefined })
              }}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Priority & Queue Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Queue</Label>
              <Select value={queue} onValueChange={(v) => setQueue(v as TicketQueue)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Backend / API">Backend / API</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Infra / Cloud">Infra / Cloud</SelectItem>
                  <SelectItem value="Data / DB">Data / DB</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reporter & Assignee Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reporter">Reporter</Label>
              <Input
                id="reporter"
                placeholder="Your name"
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee..." />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Environment */}
          <div className="space-y-2">
            <Label>Environment</Label>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Staging">Staging</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="All environments">All environments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the issue, steps to reproduce, expected vs actual behavior, error logs, affected users..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: undefined })
              }}
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="e.g. NestJS, AWS, authentication (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label htmlFor="services">Related services / components</Label>
            <Input
              id="services"
              placeholder="e.g. allocation-service, GCP Pub/Sub, user-api"
              value={services}
              onChange={(e) => setServices(e.target.value)}
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label>Severity / impact</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as Severity)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P0 - Outage">P0 - Outage</SelectItem>
                <SelectItem value="P1 - Degraded">P1 - Degraded</SelectItem>
                <SelectItem value="P2 - Minor">P2 - Minor</SelectItem>
                <SelectItem value="P3 - Cosmetic">P3 - Cosmetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#1a56db] hover:bg-[#1a56db]/90">
            Create ticket →
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
