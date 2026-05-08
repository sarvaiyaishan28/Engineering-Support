'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { mockUsers } from '@/lib/mock-data'
import { priorityConfig, categoryConfig, environmentConfig } from '@/lib/types'
import type { Priority, Category, Environment } from '@/lib/types'
import { toast } from 'sonner'

const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  category: z.enum([
    'BACKEND', 'FRONTEND', 'API', 'INFRASTRUCTURE', 'DATABASE',
    'PAYMENTS', 'AUTHENTICATION', 'DEPLOYMENT', 'BUG', 'FEATURE_REQUEST', 'PERFORMANCE'
  ]),
  environment: z.enum(['PRODUCTION', 'STAGING', 'DEVELOPMENT']),
  assigneeId: z.string().optional(),
  impact: z.string().optional(),
  stepsToReproduce: z.string().optional(),
  browserInfo: z.string().optional(),
  tags: z.array(z.string()).default([])
})

type TicketForm = z.infer<typeof ticketSchema>

export default function CreateTicketPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const engineers = mockUsers.filter(u => u.role === 'ENGINEERING' || u.role === 'ADMIN')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'MEDIUM',
      category: 'BUG',
      environment: 'PRODUCTION',
      tags: []
    }
  })

  const watchedPriority = watch('priority')

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      const newTags = [...tags, tagInput.trim().toLowerCase()]
      setTags(newTags)
      setValue('tags', newTags)
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag)
    setTags(newTags)
    setValue('tags', newTags)
  }

  const onSubmit = async (data: TicketForm) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Ticket created successfully!')
      router.push('/tickets')
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Ticket</h1>
          <p className="text-muted-foreground">
            Submit a new engineering support ticket
          </p>
        </div>
      </motion.div>

      {/* Priority Warning */}
      {watchedPriority === 'CRITICAL' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Critical tickets have a 1-hour SLA response time. Please ensure this issue truly requires immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief summary of the issue"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the issue, including any error messages, expected behavior, and actual behavior..."
                    rows={6}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown formatting
                  </p>
                </div>

                {/* Steps to Reproduce */}
                <div className="space-y-2">
                  <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                  <Textarea
                    id="stepsToReproduce"
                    placeholder="1. Go to...\n2. Click on...\n3. Observe..."
                    rows={4}
                    {...register('stepsToReproduce')}
                  />
                </div>

                {/* Impact */}
                <div className="space-y-2">
                  <Label htmlFor="impact">Business Impact</Label>
                  <Input
                    id="impact"
                    placeholder="e.g., Blocking 100 users, revenue loss estimated at $X/hour"
                    {...register('impact')}
                  />
                </div>

                {/* Browser Info */}
                <div className="space-y-2">
                  <Label htmlFor="browserInfo">Browser/Environment Info</Label>
                  <Input
                    id="browserInfo"
                    placeholder="e.g., Chrome 120 on macOS Sonoma"
                    {...register('browserInfo')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 10MB per file. Supports images, PDFs, and logs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Priority */}
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select
                    value={watch('priority')}
                    onValueChange={(v) => setValue('priority', v as Priority)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${key === 'CRITICAL' ? 'bg-red-500' : key === 'HIGH' ? 'bg-orange-500' : key === 'MEDIUM' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={watch('category')}
                    onValueChange={(v) => setValue('category', v as Category)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Environment */}
                <div className="space-y-2">
                  <Label>Environment *</Label>
                  <Select
                    value={watch('environment')}
                    onValueChange={(v) => setValue('environment', v as Environment)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(environmentConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <Label>Assign to</Label>
                  <Select
                    value={watch('assigneeId') || 'unassigned'}
                    onValueChange={(v) => setValue('assigneeId', v === 'unassigned' ? undefined : v)}
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

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Ticket
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
