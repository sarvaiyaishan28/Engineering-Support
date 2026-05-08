'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Command
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/lib/auth-context'
import { mockNotifications } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface HeaderProps {
  sidebarCollapsed?: boolean
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tickets?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-[#E5E7EB] bg-white transition-all",
        sidebarCollapsed ? "left-[72px]" : "left-[256px]"
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              type="search"
              placeholder="Search deals, entities, identities, organizations and m..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-16 bg-[#F8FAFC] border-[#E5E7EB] rounded-xl focus:border-[#10B65C] focus:ring-[#10B65C] text-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-[#94A3B8]">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6]"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6]">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 min-w-5 justify-center text-xs p-0 bg-[#EF4444] text-white border-2 border-white"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-xl border-[#E5E7EB]">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
                <h3 className="font-semibold text-[#0F172A]">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs text-[#10B65C] hover:text-[#0EA550] hover:bg-[#F0FDF4]">
                  Mark all read
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 border-b border-[#E5E7EB] last:border-0 cursor-pointer hover:bg-[#F8FAFC] transition-colors",
                      !notification.isRead && "bg-[#F0FDF4]"
                    )}
                  >
                    <div className={cn(
                      "h-2 w-2 rounded-full mt-2 shrink-0",
                      !notification.isRead ? "bg-[#10B65C]" : "bg-transparent"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{notification.title}</p>
                      <p className="text-xs text-[#64748B] truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E5E7EB] p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-[#10B65C] hover:text-[#0EA550] hover:bg-[#F0FDF4]" 
                  onClick={() => router.push('/notifications')}
                >
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 pl-2 pr-3 rounded-xl hover:bg-[#F3F4F6]">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-[#10B65C] text-white text-xs font-semibold">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-[#0F172A] hidden sm:inline-block">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="h-3 w-3 text-[#94A3B8]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-[#E5E7EB]">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-[#0F172A]">{user?.name}</span>
                  <span className="text-xs font-normal text-[#64748B]">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#E5E7EB]" />
              <DropdownMenuItem 
                onClick={() => router.push('/settings')}
                className="cursor-pointer text-[#64748B] hover:text-[#0F172A] focus:bg-[#F8FAFC]"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push('/settings')}
                className="cursor-pointer text-[#64748B] hover:text-[#0F172A] focus:bg-[#F8FAFC]"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#E5E7EB]" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-[#EF4444] hover:text-[#DC2626] focus:bg-[#FEE2E2]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
