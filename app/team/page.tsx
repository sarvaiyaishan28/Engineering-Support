'use client'

import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockUsers, mockTickets } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  ENGINEERING: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  SUPPORT: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  PRODUCT: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  VIEWER: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

export default function TeamPage() {
  const engineers = mockUsers.filter(u => u.role === 'ENGINEERING' || u.role === 'ADMIN')

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getTicketStats = (userId: string) => {
    const assigned = mockTickets.filter(t => t.assigneeId === userId)
    const open = assigned.filter(t => !['RESOLVED', 'CLOSED'].includes(t.status))
    const resolved = assigned.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED')
    const breached = assigned.filter(t => t.slaBreached)
    
    return {
      total: assigned.length,
      open: open.length,
      resolved: resolved.length,
      breached: breached.length,
      workload: Math.min((open.length / 10) * 100, 100)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">
          Manage team workload and assignments
        </p>
      </motion.div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{engineers.length}</p>
                <p className="text-sm text-muted-foreground">Engineers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.2h</p>
                <p className="text-sm text-muted-foreground">Avg Resolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">96%</p>
                <p className="text-sm text-muted-foreground">SLA Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engineers Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Engineering Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {engineers.map((user, index) => {
            const stats = getTicketStats(user.id)
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Assign Tickets</DropdownMenuItem>
                          <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={roleColors[user.role]}>
                        {user.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold">{stats.open}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold">{stats.resolved}</p>
                        <p className="text-xs text-muted-foreground">Resolved</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold text-green-600">98%</p>
                        <p className="text-xs text-muted-foreground">SLA</p>
                      </div>
                    </div>

                    {/* Workload */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Workload</span>
                        <span className={cn(
                          'font-medium',
                          stats.workload > 80 ? 'text-red-600' :
                          stats.workload > 50 ? 'text-yellow-600' :
                          'text-green-600'
                        )}>
                          {Math.round(stats.workload)}%
                        </span>
                      </div>
                      <Progress 
                        value={stats.workload} 
                        className={cn(
                          'h-2',
                          stats.workload > 80 ? '[&>div]:bg-red-500' :
                          stats.workload > 50 ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-green-500'
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* All Team Members */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Team Members</h2>
        <Card>
          <div className="divide-y">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={roleColors[user.role]}>
                    {user.role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user.department}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
