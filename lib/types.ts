// Type definitions for Allocations.com Engineering Support Ticket Tool

export type Role = 'ADMIN' | 'ENGINEERING' | 'SUPPORT' | 'PRODUCT' | 'VIEWER'

export type TicketStatus = 
  | 'OPEN' 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'QA_REVIEW' 
  | 'BLOCKED' 
  | 'RESOLVED' 
  | 'CLOSED'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type Category = 
  | 'BACKEND' 
  | 'FRONTEND' 
  | 'API' 
  | 'INFRASTRUCTURE' 
  | 'DATABASE' 
  | 'PAYMENTS' 
  | 'AUTHENTICATION' 
  | 'DEPLOYMENT' 
  | 'BUG' 
  | 'FEATURE_REQUEST' 
  | 'PERFORMANCE'

export type Environment = 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT'

export type NotificationType = 
  | 'TICKET_ASSIGNED' 
  | 'NEW_COMMENT' 
  | 'MENTIONED' 
  | 'STATUS_CHANGED' 
  | 'SLA_BREACHED'
  | 'SLA_WARNING'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string | null
  department?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  description: string
  status: TicketStatus
  priority: Priority
  category: Category
  environment: Environment
  tags: string[]
  impact?: string | null
  stepsToReproduce?: string | null
  browserInfo?: string | null
  slaDueAt?: Date | null
  slaBreached: boolean
  reporterId: string
  reporter?: User
  assigneeId?: string | null
  assignee?: User | null
  comments?: Comment[]
  attachments?: Attachment[]
  activities?: Activity[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date | null
}

export interface Comment {
  id: string
  message: string
  isInternal: boolean
  ticketId: string
  userId: string
  user?: User
  parentId?: string | null
  replies?: Comment[]
  reactions?: CommentReaction[]
  createdAt: Date
  updatedAt: Date
}

export interface CommentReaction {
  id: string
  emoji: string
  commentId: string
  userId: string
  createdAt: Date
}

export interface Attachment {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  ticketId: string
  uploadedById: string
  uploadedBy?: User
  createdAt: Date
}

export interface Activity {
  id: string
  action: string
  metadata?: Record<string, unknown> | null
  ticketId: string
  userId: string
  user?: User
  createdAt: Date
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string | null
  ticketId?: string | null
  isRead: boolean
  userId: string
  createdAt: Date
}

export interface SLARule {
  id: string
  priority: Priority
  responseHours: number
  resolutionHours: number
  isActive: boolean
}

export interface Integration {
  id: string
  name: string
  type: string
  config?: Record<string, unknown> | null
  isActive: boolean
}

// Dashboard stats
export interface DashboardStats {
  openTickets: number
  inProgress: number
  resolvedToday: number
  criticalIssues: number
  slaBreached: number
  avgResolutionTime: number
}

// Chart data types
export interface TicketsByStatusData {
  status: string
  count: number
  fill: string
}

export interface TicketsByPriorityData {
  priority: string
  count: number
  fill: string
}

export interface WeeklyTrendData {
  day: string
  created: number
  resolved: number
}

export interface EngineerWorkloadData {
  name: string
  tickets: number
  avgTime: number
}

// SLA status
export type SLAStatus = 'healthy' | 'warning' | 'breached'

export function getSLAStatus(slaDueAt: Date | null, isBreached: boolean): SLAStatus {
  if (isBreached) return 'breached'
  if (!slaDueAt) return 'healthy'
  
  const now = new Date()
  const due = new Date(slaDueAt)
  const hoursRemaining = (due.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursRemaining <= 0) return 'breached'
  if (hoursRemaining <= 1) return 'warning'
  return 'healthy'
}

export function getSLAHours(priority: Priority): number {
  const slaMap: Record<Priority, number> = {
    CRITICAL: 1,
    HIGH: 4,
    MEDIUM: 12,
    LOW: 24
  }
  return slaMap[priority]
}

// Status and priority display helpers
export const statusConfig: Record<TicketStatus, { label: string; color: string; bgColor: string }> = {
  OPEN: { label: 'Open', color: 'text-blue-700', bgColor: 'bg-blue-50 dark:bg-blue-950 dark:text-blue-300' },
  PENDING: { label: 'Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-300' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-purple-700', bgColor: 'bg-purple-50 dark:bg-purple-950 dark:text-purple-300' },
  QA_REVIEW: { label: 'QA Review', color: 'text-cyan-700', bgColor: 'bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-300' },
  BLOCKED: { label: 'Blocked', color: 'text-red-700', bgColor: 'bg-red-50 dark:bg-red-950 dark:text-red-300' },
  RESOLVED: { label: 'Resolved', color: 'text-green-700', bgColor: 'bg-green-50 dark:bg-green-950 dark:text-green-300' },
  CLOSED: { label: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300' }
}

export const priorityConfig: Record<Priority, { label: string; color: string; bgColor: string }> = {
  LOW: { label: 'Low', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
  MEDIUM: { label: 'Medium', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900 dark:text-blue-300' },
  HIGH: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900 dark:text-orange-300' },
  CRITICAL: { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900 dark:text-red-300' }
}

export const categoryConfig: Record<Category, { label: string; color: string }> = {
  BACKEND: { label: 'Backend', color: 'text-indigo-600' },
  FRONTEND: { label: 'Frontend', color: 'text-pink-600' },
  API: { label: 'API', color: 'text-violet-600' },
  INFRASTRUCTURE: { label: 'Infrastructure', color: 'text-slate-600' },
  DATABASE: { label: 'Database', color: 'text-emerald-600' },
  PAYMENTS: { label: 'Payments', color: 'text-green-600' },
  AUTHENTICATION: { label: 'Authentication', color: 'text-amber-600' },
  DEPLOYMENT: { label: 'Deployment', color: 'text-cyan-600' },
  BUG: { label: 'Bug', color: 'text-red-600' },
  FEATURE_REQUEST: { label: 'Feature Request', color: 'text-blue-600' },
  PERFORMANCE: { label: 'Performance', color: 'text-orange-600' }
}

export const environmentConfig: Record<Environment, { label: string; color: string; bgColor: string }> = {
  PRODUCTION: { label: 'Production', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950' },
  STAGING: { label: 'Staging', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-950' },
  DEVELOPMENT: { label: 'Development', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950' }
}
