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
          className="rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Create Ticket</h1>
          <p className="text-[#64748B]">
            Submit a new engineering support ticket
          </p>
        </div>
      </motion.div>

      {/* Priority Warning */}
      {watchedPriority === 'CRITICAL' && (
        <Alert className="bg-[#FEE2E2] border-[#EF4444]/30 rounded-xl">
          <AlertCircle className="h-4 w-4 text-[#EF4444]" />
          <AlertDescription className="text-[#DC2626]">
            Critical tickets have a 1-hour SLA response time. Please ensure this issue truly requires immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#0F172A]">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief summary of the issue"
                    {...register('title')}
                    className="rounded-xl border-[#E5E7EB] focus:border-[#10B65C] focus:ring-[#10B65C]"
                  />
                  {errors.title && (
                    <p className="text-sm text-[#EF4444]">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#0F172A]">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the issue, including any error messages, expected behavior, and actual behavior..."
                    rows={6}
                    {...register('description')}
                    className="rounded-xl border-[#E5E7EB] focus:border-[#10B65C] focus:ring-[#10B65C]"
                  />
                  {errors.description && (
                    <p className="text-sm text-[#EF4444]">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-[#94A3B8]">
                    Supports Markdown formatting
                  </p>
                </div>

                {/* Steps to Reproduce */}
                <div className="space-y-2">
                  <Label htmlFor="stepsToReproduce" className="text-[#0F172A]">Steps to Reproduce</Label>
                  <Textarea
                    id="stepsToReproduce"
                    placeholder="1. Go to...\n2. Click on...\n3. Observe..."
                    rows={4}
                    {...register('stepsToReproduce')}
                    className="rounded-xl border-[#E5E7EB] focus:border-[#10B65C] focus:ring-[#10B65C]"
                  />
                </div>

                {/* Impact */}
                <div className="space-y-2">
                  <Label htmlFor="impact" className="text-[#0F172A]">Business Impact</Label>
                  <Input
                    id="impact"
                    placeholder="e.g., Blocking 100 users, revenue loss estimated at $X/hour"
                    {...register('impact')}
                    className="rounded-xl border-[#E5E7EB] focus:border-[#10B65C] focus:ring-[#10B65C]"
                  />
                </div>

                {/* Browser Info */}
                <div className="space-y-2">
                  <Label htmlFor="browserInfo" className="text-[#0F172A]">Browser/Environment Info</Label>
                  <Input
                    id="browserInfo"
                    placeholder="e.g., Chrome 120 on macOS Sonoma"
                    {...register('browserInfo')}
                    className="rounded-xl border-[#E5E7EB] focus:border-[#10B65C] focus:ring-[#10B65C]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#10B65C]/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-[#94A3B8] mb-2" />
                  <p className="text-sm text-[#64748B] mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button type="button" variant="outline" size="sm" className="rounded-xl border-[#E5E7EB]">
                    Choose Files
                  </Button>
                  <p className="text-xs text-[#94A3B8] mt-2">
                    Max 10MB per file. Supports images, PDFs, and logs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Priority */}
                <div className="space-y-2">
                  <Label className="text-[#0F172A]">Priority *</Label>
                  <Select
                    value={watch('priority')}
                    onValueChange={(v) => setValue('priority', v as Priority)}
                  >
                    <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${key === 'CRITICAL' ? 'bg-[#EF4444]' : key === 'HIGH' ? 'bg-[#F97316]' : key === 'MEDIUM' ? 'bg-[#3B82F6]' : 'bg-[#94A3B8]'}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-[#0F172A]">Category *</Label>
                  <Select
                    value={watch('category')}
                    onValueChange={(v) => setValue('category', v as Category)}
                  >
                    <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Environment */}
                <div className="space-y-2">
                  <Label className="text-[#0F172A]">Environment *</Label>
                  <Select
                    value={watch('environment')}
                    onValueChange={(v) => setValue('environment', v as Environment)}
                  >
                    <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.entries(environmentConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <Label className="text-[#0F172A]">Assign to</Label>
                  <Select
                    value={watch('assigneeId') || 'unassigned'}
                    onValueChange={(v) => setValue('assigneeId', v === 'unassigned' ? undefined : v)}
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

            {/* Tags */}
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Tags</CardTitle>
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
                    className="rounded-xl border-[#E5E7EB] focus:border-[#10B65C] focus:ring-[#10B65C]"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTag}
                    className="rounded-xl border-[#E5E7EB]"
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} className="gap-1 bg-[#F3F4F6] text-[#64748B] rounded-full">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-[#EF4444]"
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
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full rounded-xl bg-[#10B65C] hover:bg-[#0EA550] text-white"
              >
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
                className="w-full rounded-xl border-[#E5E7EB] text-[#64748B]"
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
