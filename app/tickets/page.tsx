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
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { mockTickets, mockUsers } from '@/lib/mock-data'
import { statusConfig, priorityConfig, categoryConfig, getSLAStatus } from '@/lib/types'
import type { Ticket, TicketStatus, Priority, Category } from '@/lib/types'
import { cn } from '@/lib/utils'

type SortField = 'ticketNumber' | 'title' | 'priority' | 'status' | 'createdAt'
type SortDirection = 'asc' | 'desc'

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

  const engineers = mockUsers.filter(u => u.role === 'ENGINEERING' || u.role === 'ADMIN')

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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track engineering support tickets
          </p>
        </div>
        <Button onClick={() => router.push('/tickets/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </motion.div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TicketStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as Category | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {engineers.map((user) => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedTickets.size > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Actions ({selectedTickets.size})
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Assign to...</DropdownMenuItem>
                <DropdownMenuItem>Change status...</DropdownMenuItem>
                <DropdownMenuItem>Add tags...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Close tickets</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export */}
          <Button variant="outline" size="icon" className="ml-auto">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTickets.size === filteredTickets.length && filteredTickets.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[120px]">
                <Button variant="ghost" className="gap-1 -ml-3" onClick={() => handleSort('ticketNumber')}>
                  ID
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="gap-1 -ml-3" onClick={() => handleSort('title')}>
                  Title
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead className="w-[100px]">
                <Button variant="ghost" className="gap-1 -ml-3" onClick={() => handleSort('priority')}>
                  Priority
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button variant="ghost" className="gap-1 -ml-3" onClick={() => handleSort('status')}>
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[140px]">Assignee</TableHead>
              <TableHead className="w-[60px]">SLA</TableHead>
              <TableHead className="w-[120px]">
                <Button variant="ghost" className="gap-1 -ml-3" onClick={() => handleSort('createdAt')}>
                  Created
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No tickets found</p>
                    <Button variant="outline" size="sm" onClick={() => router.push('/tickets/new')}>
                      Create your first ticket
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket, index) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="group cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedTickets.has(ticket.id)}
                      onCheckedChange={() => toggleSelect(ticket.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {ticket.ticketNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[300px]">{ticket.title}</span>
                      {ticket.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {ticket.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {ticket.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{ticket.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('text-sm', categoryConfig[ticket.category].color)}>
                      {categoryConfig[ticket.category].label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('font-medium', priorityConfig[ticket.priority].bgColor)}>
                      {priorityConfig[ticket.priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(statusConfig[ticket.status].bgColor, statusConfig[ticket.status].color)}>
                      {statusConfig[ticket.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ticket.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(ticket.assignee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate max-w-[80px]">{ticket.assignee.name.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getSLAIndicator(ticket)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/tickets/${ticket.id}`)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit ticket</DropdownMenuItem>
                        <DropdownMenuItem>Assign to...</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Close ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTickets.length} of {mockTickets.length} tickets
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  )
}
