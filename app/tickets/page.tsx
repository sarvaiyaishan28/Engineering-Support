'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

import { mockTickets, mockUsers } from '@/lib/mock-data'
import { statusConfig, priorityConfig, categoryConfig, getSLAStatus } from '@/lib/types'
import type { Ticket, TicketStatus, Priority, Category } from '@/lib/types'
import { cn } from '@/lib/utils'

type SortField = 'ticketNumber' | 'title' | 'priority' | 'status' | 'createdAt'
type SortDirection = 'asc' | 'desc'

// Status tab configuration matching the Allocations dashboard style
const statusTabs: { key: TicketStatus | 'all'; label: string; bgColor: string }[] = [
  { key: 'all', label: 'All', bgColor: 'bg-[#475569] text-white' },
  { key: 'OPEN', label: 'Open', bgColor: 'bg-[#F97316] text-white' },
  { key: 'IN_PROGRESS', label: 'In Progress', bgColor: 'bg-[#10B65C] text-white' },
  { key: 'QA_REVIEW', label: 'QA Review', bgColor: 'bg-[#3B82F6] text-white' },
  { key: 'RESOLVED', label: 'Resolved', bgColor: 'bg-[#8B5CF6] text-white' },
  { key: 'CLOSED', label: 'Closed', bgColor: 'bg-[#14B8A6] text-white' },
  { key: 'BLOCKED', label: 'Blocked', bgColor: 'bg-[#DC2626] text-white' },
]

// Category tabs
const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'BUG', label: 'Bug' },
  { key: 'FEATURE_REQUEST', label: 'Feature' },
  { key: 'PERFORMANCE', label: 'Performance' },
]

const ITEMS_PER_PAGE = 10

export default function TicketsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState(0)

  const engineers = mockUsers.filter(u => u.role === 'ENGINEERING' || u.role === 'ADMIN')

  // Calculate active filter count
  useMemo(() => {
    let count = 0
    if (priorityFilter !== 'all') count++
    if (categoryFilter !== 'all') count++
    if (assigneeFilter !== 'all') count++
    setActiveFilters(count)
  }, [priorityFilter, categoryFilter, assigneeFilter])

  const filteredTickets = useMemo(() => {
    let result = [...mockTickets]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.ticketNumber.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter)
    }

    // Assignee filter
    if (assigneeFilter !== 'all') {
      result = result.filter(t => t.assigneeId === assigneeFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'ticketNumber':
          comparison = a.ticketNumber.localeCompare(b.ticketNumber)
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'priority':
          const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, assigneeFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE)
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredTickets, currentPage])

  // Stats
  const stats = useMemo(() => {
    const openCount = mockTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length
    const totalReporters = new Set(mockTickets.map(t => t.reporterId)).size
    return {
      totalTickets: mockTickets.length,
      openTickets: openCount,
      totalReporters: totalReporters
    }
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedTickets.size === filteredTickets.length) {
      setSelectedTickets(new Set())
    } else {
      setSelectedTickets(new Set(filteredTickets.map(t => t.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedTickets)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTickets(newSelected)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getSLAIndicator = (ticket: Ticket) => {
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') return null
    
    const slaStatus = getSLAStatus(ticket.slaDueAt, ticket.slaBreached)
    
    if (slaStatus === 'breached') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    if (slaStatus === 'warning') {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
    return <CheckCircle2 className="h-4 w-4 text-green-500" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#0F172A]">Ticket Dashboard</h1>
          <p className="text-sm text-[#64748B]">
            Manage and track engineering support tickets
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Open Tickets - Green Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#10B65C] rounded-xl p-5 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/90 text-xs font-semibold uppercase tracking-wider">OPEN TICKETS</p>
              <p className="text-3xl font-bold mt-2">{stats.openTickets}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-white/70" />
          </div>
        </motion.div>

        {/* Total Reporters Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-[#E5E7EB] rounded-xl p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">TOTAL REPORTERS</p>
              <p className="text-3xl font-bold text-[#0F172A] mt-2">{stats.totalReporters}</p>
            </div>
            <Users className="h-6 w-6 text-[#94A3B8]" />
          </div>
        </motion.div>

        {/* Total Tickets Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#E5E7EB] rounded-xl p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">TOTAL TICKETS</p>
              <p className="text-3xl font-bold text-[#0F172A] mt-2">{stats.totalTickets}</p>
            </div>
            <FileText className="h-6 w-6 text-[#94A3B8]" />
          </div>
        </motion.div>
      </div>

      {/* Filters Row */}
      <div className="space-y-3">
        {/* Search and Status Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-white border-[#E5E7EB] rounded-lg h-9 focus:border-[#10B65C] focus:ring-[#10B65C]"
            />
          </div>

          {/* Filter Button with Count */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-[#E5E7EB] h-9">
                <Filter className="h-3.5 w-3.5" />
                Filter
                {activeFilters > 0 && (
                  <span className="text-xs">({activeFilters})</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl">
              <div className="p-2">
                <p className="text-xs font-semibold text-[#64748B] mb-2">Priority</p>
                <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | 'all')}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <p className="text-xs font-semibold text-[#64748B] mb-2">Assignee</p>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {engineers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Tabs - Inline pills */}
          <div className="flex flex-wrap gap-1.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key)
                  setCurrentPage(1)
                }}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  tab.bgColor
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-lg border-[#E5E7EB] h-9 w-9"
          >
            <RefreshCw className="h-4 w-4 text-[#64748B]" />
          </Button>

          {/* Export */}
          <Button 
            variant="outline" 
            className="gap-2 rounded-lg border-[#10B65C] text-[#10B65C] hover:bg-[#F0FDF4] h-9"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          {/* Create Ticket Button */}
          <Button 
            onClick={() => router.push('/tickets/new')} 
            className="gap-2 rounded-lg bg-white border border-[#10B65C] text-[#10B65C] hover:bg-[#F0FDF4] h-9"
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>

        {/* Category tabs row */}
        <div className="flex gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setCategoryFilter(tab.key === 'all' ? 'all' : tab.key as Category)
                setCurrentPage(1)
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                categoryFilter === tab.key || (tab.key === 'all' && categoryFilter === 'all')
                  ? 'border-[#3B82F6] bg-[#EFF6FF] text-[#3B82F6]'
                  : 'border-[#E5E7EB] text-[#64748B] hover:border-[#94A3B8] bg-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A]"
                    onClick={() => handleSort('ticketNumber')}
                  >
                    Ticket
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A]"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Category
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A]"
                    onClick={() => handleSort('priority')}
                  >
                    Priority
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Assignee
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    SLA
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#64748B] hover:text-[#0F172A]"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-12 w-12 text-[#E5E7EB]" />
                      <p className="text-[#64748B] font-medium">No tickets found</p>
                      <p className="text-sm text-[#94A3B8]">Try adjusting your filters or create a new ticket</p>
                      <Button 
                        onClick={() => router.push('/tickets/new')}
                        className="mt-2 rounded-lg bg-white border border-[#10B65C] text-[#10B65C] hover:bg-[#F0FDF4]"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first ticket
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket, index) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                    className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full text-white font-semibold text-sm",
                          ['bg-[#10B65C]', 'bg-[#3B82F6]', 'bg-[#F97316]', 'bg-[#06B6D4]', 'bg-[#8B5CF6]'][index % 5]
                        )}>
                          {ticket.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{ticket.title}</p>
                          <p className="text-xs text-[#94A3B8]">{ticket.ticketNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide',
                        statusConfig[ticket.status].bgColor,
                        statusConfig[ticket.status].color
                      )}>
                        {statusConfig[ticket.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#64748B]">
                        {categoryConfig[ticket.category].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                        ticket.priority === 'CRITICAL' && 'bg-[#FEE2E2] text-[#DC2626]',
                        ticket.priority === 'HIGH' && 'bg-[#FFEDD5] text-[#EA580C]',
                        ticket.priority === 'MEDIUM' && 'bg-[#DBEAFE] text-[#2563EB]',
                        ticket.priority === 'LOW' && 'bg-[#F3F4F6] text-[#64748B]',
                      )}>
                        {priorityConfig[ticket.priority].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {ticket.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-[#E5E7EB] text-[#64748B]">
                              {getInitials(ticket.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[#0F172A]">{ticket.assignee.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#94A3B8]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getSLAIndicator(ticket)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">
                      {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md border-[#10B65C] text-[#10B65C] hover:bg-[#F0FDF4] font-medium text-xs gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/tickets/${ticket.id}`)
                        }}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                        Actions
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length} tickets
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg border-[#E5E7EB]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-[#64748B] px-2">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg border-[#E5E7EB]"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
