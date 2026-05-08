'use client'

import { motion } from 'framer-motion'
import {
  Check,
  ExternalLink,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and create tickets from Slack messages',
    icon: '/slack.svg',
    color: 'bg-[#4A154B]',
    connected: true,
    features: ['Notifications', 'Create tickets', 'Status updates']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Link pull requests and commits to tickets automatically',
    icon: '/github.svg',
    color: 'bg-[#24292e]',
    connected: true,
    features: ['PR linking', 'Commit tracking', 'Auto-close tickets']
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Sync tickets bi-directionally with Jira issues',
    icon: '/jira.svg',
    color: 'bg-[#0052CC]',
    connected: false,
    features: ['Two-way sync', 'Status mapping', 'Field mapping']
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Create tickets from Datadog alerts automatically',
    icon: '/datadog.svg',
    color: 'bg-[#632CA6]',
    connected: false,
    features: ['Auto-create tickets', 'Alert linking', 'Metrics']
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Link error tracking to support tickets',
    icon: '/sentry.svg',
    color: 'bg-[#362D59]',
    connected: true,
    features: ['Error linking', 'Auto-create', 'Stack traces']
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    description: 'Escalate critical tickets to on-call engineers',
    icon: '/pagerduty.svg',
    color: 'bg-[#06AC38]',
    connected: false,
    features: ['Escalation', 'On-call', 'Incidents']
  }
]

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your favorite tools to streamline your workflow
        </p>
      </motion.div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Connected</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.filter(i => i.connected).map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="relative overflow-hidden">
                <div className={cn('absolute top-0 left-0 right-0 h-1', integration.color)} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center text-white', integration.color)}>
                        <span className="text-lg font-bold">{integration.name[0]}</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200 mt-1">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{integration.description}</CardDescription>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Settings className="h-4 w-4" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.filter(i => !i.connected).map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center text-white', integration.color)}>
                      <span className="text-lg font-bold">{integration.name[0]}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{integration.description}</CardDescription>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* API Section */}
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Build custom integrations using our REST API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted font-mono text-sm">
            <p className="text-muted-foreground mb-2">API Endpoint:</p>
            <p>https://api.allocations.com/v1</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">View Documentation</Button>
            <Button variant="outline">Generate API Key</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
