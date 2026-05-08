// Mock data for Allocations.com Engineering Support Ticket Tool

import type { 
  User, 
  Ticket, 
  Comment, 
  Activity, 
  Notification,
  DashboardStats,
  TicketsByStatusData,
  TicketsByPriorityData,
  WeeklyTrendData,
  EngineerWorkloadData
} from './types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@allocations.com',
    role: 'ADMIN',
    avatarUrl: null,
    department: 'Engineering',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Michael Torres',
    email: 'michael.torres@allocations.com',
    role: 'ENGINEERING',
    avatarUrl: null,
    department: 'Backend',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@allocations.com',
    role: 'ENGINEERING',
    avatarUrl: null,
    department: 'Frontend',
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@allocations.com',
    role: 'SUPPORT',
    avatarUrl: null,
    department: 'Customer Support',
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@allocations.com',
    role: 'PRODUCT',
    avatarUrl: null,
    department: 'Product',
    isActive: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james.wilson@allocations.com',
    role: 'ENGINEERING',
    avatarUrl: null,
    department: 'Infrastructure',
    isActive: true,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  },
  {
    id: '7',
    name: 'Anna Martinez',
    email: 'anna.martinez@allocations.com',
    role: 'ENGINEERING',
    avatarUrl: null,
    department: 'Backend',
    isActive: true,
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15')
  },
  {
    id: '8',
    name: 'Robert Brown',
    email: 'robert.brown@allocations.com',
    role: 'VIEWER',
    avatarUrl: null,
    department: 'Finance',
    isActive: true,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01')
  }
]

// Helper to get user by ID
export const getUserById = (id: string): User | undefined => mockUsers.find(u => u.id === id)

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'ALLOC-1001',
    title: 'Payment gateway timeout during peak hours',
    description: 'Users are experiencing payment failures due to gateway timeouts when traffic exceeds 1000 concurrent requests. The Stripe webhook is returning 504 errors intermittently.',
    status: 'CRITICAL' as unknown as 'IN_PROGRESS',
    priority: 'CRITICAL',
    category: 'PAYMENTS',
    environment: 'PRODUCTION',
    tags: ['payments', 'urgent', 'stripe'],
    impact: 'High - Revenue loss estimated at $50k/hour',
    stepsToReproduce: '1. Generate high traffic load\n2. Attempt multiple payments\n3. Observe timeout errors',
    browserInfo: 'All browsers affected',
    slaDueAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins from now
    slaBreached: false,
    reporterId: '4',
    reporter: mockUsers[3],
    assigneeId: '2',
    assignee: mockUsers[1],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '2',
    ticketNumber: 'ALLOC-1002',
    title: 'Dashboard charts not loading in Safari',
    description: 'The analytics dashboard charts fail to render in Safari 17.x. Console shows WebGL context creation failed error.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'FRONTEND',
    environment: 'PRODUCTION',
    tags: ['safari', 'charts', 'webgl'],
    impact: 'Medium - 15% of users affected',
    stepsToReproduce: '1. Open Safari 17\n2. Navigate to Dashboard\n3. Charts show blank',
    browserInfo: 'Safari 17.x on macOS Sonoma',
    slaDueAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '5',
    reporter: mockUsers[4],
    assigneeId: '3',
    assignee: mockUsers[2],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '3',
    ticketNumber: 'ALLOC-1003',
    title: 'API rate limiting not working correctly',
    description: 'The rate limiter is allowing more requests than configured. Set to 100 req/min but seeing 500+ go through.',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'API',
    environment: 'PRODUCTION',
    tags: ['rate-limiting', 'security', 'api'],
    impact: 'High - Security vulnerability',
    stepsToReproduce: '1. Send 150 requests in 1 minute\n2. All requests succeed\n3. No 429 errors returned',
    browserInfo: null,
    slaDueAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '6',
    reporter: mockUsers[5],
    assigneeId: null,
    assignee: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '4',
    ticketNumber: 'ALLOC-1004',
    title: 'Database connection pool exhaustion',
    description: 'PostgreSQL connection pool is being exhausted during batch operations. Max connections (100) reached and queries start failing.',
    status: 'QA_REVIEW',
    priority: 'CRITICAL',
    category: 'DATABASE',
    environment: 'PRODUCTION',
    tags: ['database', 'postgresql', 'performance'],
    impact: 'Critical - Full service degradation',
    stepsToReproduce: '1. Run batch import of 10k records\n2. Monitor connection count\n3. Service becomes unresponsive',
    browserInfo: null,
    slaDueAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago - breached
    slaBreached: true,
    reporterId: '2',
    reporter: mockUsers[1],
    assigneeId: '6',
    assignee: mockUsers[5],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '5',
    ticketNumber: 'ALLOC-1005',
    title: 'User authentication fails after password reset',
    description: 'Users cannot log in after resetting their password. The new password hash is not being stored correctly.',
    status: 'RESOLVED',
    priority: 'HIGH',
    category: 'AUTHENTICATION',
    environment: 'PRODUCTION',
    tags: ['auth', 'password', 'security'],
    impact: 'High - Users locked out',
    stepsToReproduce: '1. Request password reset\n2. Set new password\n3. Try to log in - fails',
    browserInfo: 'All browsers',
    slaDueAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '4',
    reporter: mockUsers[3],
    assigneeId: '7',
    assignee: mockUsers[6],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
  },
  {
    id: '6',
    ticketNumber: 'ALLOC-1006',
    title: 'Implement dark mode for mobile app',
    description: 'Feature request to add dark mode support to the mobile application. Should sync with system preferences.',
    status: 'PENDING',
    priority: 'MEDIUM',
    category: 'FEATURE_REQUEST',
    environment: 'DEVELOPMENT',
    tags: ['mobile', 'ui', 'dark-mode'],
    impact: 'Low - Enhancement request',
    stepsToReproduce: null,
    browserInfo: null,
    slaDueAt: new Date(Date.now() + 10 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '5',
    reporter: mockUsers[4],
    assigneeId: '3',
    assignee: mockUsers[2],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '7',
    ticketNumber: 'ALLOC-1007',
    title: 'Slow page load on investor portal',
    description: 'The investor portal takes 8+ seconds to load. Lighthouse performance score is 32. Need to optimize.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    category: 'PERFORMANCE',
    environment: 'PRODUCTION',
    tags: ['performance', 'frontend', 'optimization'],
    impact: 'Medium - Poor user experience',
    stepsToReproduce: '1. Navigate to /investor-portal\n2. Measure load time\n3. Run Lighthouse audit',
    browserInfo: 'Chrome 120',
    slaDueAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '5',
    reporter: mockUsers[4],
    assigneeId: '3',
    assignee: mockUsers[2],
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '8',
    ticketNumber: 'ALLOC-1008',
    title: 'CI/CD pipeline failing on main branch',
    description: 'The GitHub Actions workflow is failing intermittently. Tests pass locally but fail in CI with memory errors.',
    status: 'BLOCKED',
    priority: 'HIGH',
    category: 'DEPLOYMENT',
    environment: 'STAGING',
    tags: ['ci-cd', 'github-actions', 'testing'],
    impact: 'High - Deployments blocked',
    stepsToReproduce: '1. Push to main branch\n2. Watch CI run\n3. Fails at test step',
    browserInfo: null,
    slaDueAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '2',
    reporter: mockUsers[1],
    assigneeId: '6',
    assignee: mockUsers[5],
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '9',
    ticketNumber: 'ALLOC-1009',
    title: 'REST API returning inconsistent date formats',
    description: 'Some endpoints return ISO 8601 dates, others return Unix timestamps. Need to standardize across all endpoints.',
    status: 'OPEN',
    priority: 'LOW',
    category: 'API',
    environment: 'PRODUCTION',
    tags: ['api', 'dates', 'consistency'],
    impact: 'Low - Developer experience issue',
    stepsToReproduce: '1. Call /api/v1/users\n2. Call /api/v1/transactions\n3. Compare date formats',
    browserInfo: null,
    slaDueAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '7',
    reporter: mockUsers[6],
    assigneeId: null,
    assignee: null,
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 120 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '10',
    ticketNumber: 'ALLOC-1010',
    title: 'Email notifications not sending',
    description: 'Transactional emails (password reset, welcome) are not being delivered. SendGrid API returning 200 but emails not received.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'BACKEND',
    environment: 'PRODUCTION',
    tags: ['email', 'sendgrid', 'notifications'],
    impact: 'High - Critical user flows broken',
    stepsToReproduce: '1. Trigger password reset\n2. Check email inbox\n3. Email never arrives',
    browserInfo: null,
    slaDueAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '4',
    reporter: mockUsers[3],
    assigneeId: '2',
    assignee: mockUsers[1],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '11',
    ticketNumber: 'ALLOC-1011',
    title: 'Kubernetes pod memory leak',
    description: 'API pods are gradually consuming more memory over time. Need to restart every 24 hours or pods get OOMKilled.',
    status: 'OPEN',
    priority: 'MEDIUM',
    category: 'INFRASTRUCTURE',
    environment: 'PRODUCTION',
    tags: ['kubernetes', 'memory', 'infrastructure'],
    impact: 'Medium - Manual intervention required',
    stepsToReproduce: '1. Monitor pod memory over 24h\n2. Observe gradual increase\n3. Pod eventually crashes',
    browserInfo: null,
    slaDueAt: new Date(Date.now() + 10 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '6',
    reporter: mockUsers[5],
    assigneeId: null,
    assignee: null,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    resolvedAt: null
  },
  {
    id: '12',
    ticketNumber: 'ALLOC-1012',
    title: 'Mobile app crashes on iOS 17',
    description: 'The React Native app crashes immediately on launch for iOS 17 users. Crash logs show null pointer exception in navigation.',
    status: 'CLOSED',
    priority: 'CRITICAL',
    category: 'BUG',
    environment: 'PRODUCTION',
    tags: ['mobile', 'ios', 'crash'],
    impact: 'Critical - 40% of mobile users affected',
    stepsToReproduce: '1. Install app on iOS 17 device\n2. Launch app\n3. App crashes',
    browserInfo: 'iOS 17.x',
    slaDueAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    slaBreached: false,
    reporterId: '4',
    reporter: mockUsers[3],
    assigneeId: '3',
    assignee: mockUsers[2],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
  }
]

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    message: 'I\'ve identified the root cause. The Stripe webhook handler is not properly handling concurrent requests. Working on a fix now.',
    isInternal: false,
    ticketId: '1',
    userId: '2',
    user: mockUsers[1],
    parentId: null,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '2',
    message: 'Thanks for the update! Finance team is asking for an ETA.',
    isInternal: false,
    ticketId: '1',
    userId: '4',
    user: mockUsers[3],
    parentId: null,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: '3',
    message: 'Should have a hotfix ready in ~30 minutes. Will need emergency deployment approval.',
    isInternal: false,
    ticketId: '1',
    userId: '2',
    user: mockUsers[1],
    parentId: '2',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '4',
    message: 'Internal note: This might be related to the infrastructure changes we made last week. Need to check with James.',
    isInternal: true,
    ticketId: '1',
    userId: '1',
    user: mockUsers[0],
    parentId: null,
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000)
  }
]

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    action: 'created',
    metadata: { title: 'Payment gateway timeout during peak hours' },
    ticketId: '1',
    userId: '4',
    user: mockUsers[3],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    action: 'assigned',
    metadata: { assignee: 'Michael Torres' },
    ticketId: '1',
    userId: '1',
    user: mockUsers[0],
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
  },
  {
    id: '3',
    action: 'status_changed',
    metadata: { from: 'OPEN', to: 'IN_PROGRESS' },
    ticketId: '1',
    userId: '2',
    user: mockUsers[1],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '4',
    action: 'comment_added',
    metadata: { preview: 'I\'ve identified the root cause...' },
    ticketId: '1',
    userId: '2',
    user: mockUsers[1],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '5',
    action: 'priority_changed',
    metadata: { from: 'HIGH', to: 'CRITICAL' },
    ticketId: '1',
    userId: '1',
    user: mockUsers[0],
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  }
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'TICKET_ASSIGNED',
    title: 'New ticket assigned to you',
    message: 'ALLOC-1001: Payment gateway timeout during peak hours',
    ticketId: '1',
    isRead: false,
    userId: '2',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'SLA_WARNING',
    title: 'SLA Warning',
    message: 'ALLOC-1001 has 30 minutes remaining before SLA breach',
    ticketId: '1',
    isRead: false,
    userId: '2',
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '3',
    type: 'NEW_COMMENT',
    title: 'New comment on your ticket',
    message: 'David Kim commented on ALLOC-1001',
    ticketId: '1',
    isRead: true,
    userId: '2',
    createdAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: '4',
    type: 'SLA_BREACHED',
    title: 'SLA Breached',
    message: 'ALLOC-1004 has breached its SLA deadline',
    ticketId: '4',
    isRead: false,
    userId: '6',
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '5',
    type: 'STATUS_CHANGED',
    title: 'Ticket status updated',
    message: 'ALLOC-1005 has been resolved',
    ticketId: '5',
    isRead: true,
    userId: '4',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
  }
]

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  openTickets: 7,
  inProgress: 4,
  resolvedToday: 2,
  criticalIssues: 2,
  slaBreached: 1,
  avgResolutionTime: 4.2
}

// Chart Data
export const mockTicketsByStatus: TicketsByStatusData[] = [
  { status: 'Open', count: 3, fill: 'var(--color-chart-1)' },
  { status: 'In Progress', count: 4, fill: 'var(--color-chart-2)' },
  { status: 'Pending', count: 1, fill: 'var(--color-chart-3)' },
  { status: 'QA Review', count: 1, fill: 'var(--color-chart-4)' },
  { status: 'Blocked', count: 1, fill: 'var(--color-chart-5)' },
  { status: 'Resolved', count: 1, fill: 'hsl(142, 76%, 36%)' },
  { status: 'Closed', count: 1, fill: 'hsl(215, 14%, 45%)' }
]

export const mockTicketsByPriority: TicketsByPriorityData[] = [
  { priority: 'Critical', count: 2, fill: 'hsl(0, 84%, 60%)' },
  { priority: 'High', count: 5, fill: 'hsl(25, 95%, 53%)' },
  { priority: 'Medium', count: 3, fill: 'hsl(217, 91%, 60%)' },
  { priority: 'Low', count: 2, fill: 'hsl(215, 14%, 45%)' }
]

export const mockWeeklyTrend: WeeklyTrendData[] = [
  { day: 'Mon', created: 8, resolved: 5 },
  { day: 'Tue', created: 12, resolved: 9 },
  { day: 'Wed', created: 6, resolved: 8 },
  { day: 'Thu', created: 10, resolved: 7 },
  { day: 'Fri', created: 14, resolved: 11 },
  { day: 'Sat', created: 3, resolved: 4 },
  { day: 'Sun', created: 2, resolved: 3 }
]

export const mockEngineerWorkload: EngineerWorkloadData[] = [
  { name: 'Michael T.', tickets: 8, avgTime: 3.2 },
  { name: 'Emily R.', tickets: 6, avgTime: 4.1 },
  { name: 'James W.', tickets: 5, avgTime: 5.5 },
  { name: 'Anna M.', tickets: 4, avgTime: 2.8 }
]

// Current logged in user (for demo)
export const currentUser: User = mockUsers[0] // Sarah Chen - Admin
