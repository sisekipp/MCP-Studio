import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, MessageSquare, Wrench, ScrollText, ArrowLeft, Circle, FileText, Loader2, Settings, RefreshCw } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useServers } from '@/contexts/ServerContext'
import { useEffect, useState } from 'react'
import type { Resource, Prompt, Tool, ServerConfig } from '@/types/server'
import { AddServerDialog } from '@/components/AddServerDialog'

export const Route = createFileRoute('/servers/$serverId')({
  component: ServerDetail,
})

function ServerDetail() {
  const { serverId } = Route.useParams()
  const navigate = useNavigate()
  const { servers, connectToServer, disconnectServer, updateServer, getServerResources, getServerPrompts, getServerTools, logs } = useServers()

  const server = servers.find(s => s.id === serverId)

  const [resources, setResources] = useState<Resource[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState({ resources: false, prompts: false, tools: false })
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Connect to server when component mounts if not connected
  useEffect(() => {
    if (server && server.status === 'disconnected') {
      connectToServer(serverId)
    }
  }, [server, serverId, connectToServer])

  // Load data when server is connected
  useEffect(() => {
    if (server && server.status === 'connected') {
      loadServerData()
    }
  }, [server?.status, serverId])

  const loadServerData = async () => {
    try {
      // Load resources
      setLoading(prev => ({ ...prev, resources: true }))
      const resourcesData = await getServerResources(serverId)
      setResources(resourcesData)
      setLoading(prev => ({ ...prev, resources: false }))

      // Load prompts
      setLoading(prev => ({ ...prev, prompts: true }))
      const promptsData = await getServerPrompts(serverId)
      setPrompts(promptsData)
      setLoading(prev => ({ ...prev, prompts: false }))

      // Load tools
      setLoading(prev => ({ ...prev, tools: true }))
      const toolsData = await getServerTools(serverId)
      setTools(toolsData)
      setLoading(prev => ({ ...prev, tools: false }))
    } catch (error) {
      console.error('Failed to load server data:', error)
      setLoading({ resources: false, prompts: false, tools: false })
    }
  }

  // Redirect if server not found
  if (!server) {
    navigate({ to: '/' })
    return null
  }

  const handleDisconnect = async () => {
    await disconnectServer(serverId)
    navigate({ to: '/' })
  }

  const handleReconnect = async () => {
    // If already connected, disconnect first
    if (server.status === 'connected' || server.status === 'error') {
      await disconnectServer(serverId)
    }
    // Then connect
    await connectToServer(serverId)
  }

  const handleUpdateServer = async (config: ServerConfig) => {
    const wasConnected = server.status === 'connected' || server.status === 'error'

    // Update the server configuration
    updateServer(config)

    // If server was connected, reconnect automatically
    if (wasConnected) {
      // Wait a bit for the state to update
      setTimeout(async () => {
        await handleReconnect()
      }, 100)
    }
  }

  const getServerInfo = () => {
    if (server.config.config.type === 'stdio') {
      return `${server.config.config.command} ${server.config.config.args?.join(' ') || ''}`
    } else {
      return server.config.config.url
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{server.config.name}</h1>
            <Badge
              variant={
                server.status === 'connected' ? 'default' :
                server.status === 'connecting' ? 'secondary' :
                server.status === 'error' ? 'destructive' : 'secondary'
              }
              className="flex items-center gap-1"
            >
              <Circle className="h-2 w-2 fill-current" />
              {server.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReconnect}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={server.status === 'disconnected' || server.status === 'connecting'}
            >
              Disconnect
            </Button>
          </div>
        </div>

        {/* Server Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Transport</p>
                <Badge variant="outline" className="font-mono">
                  {server.config.transport}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Beschreibung</p>
                <p className="text-sm">{server.config.description || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {server.config.config.type === 'stdio' ? 'Command' : 'URL'}
                </p>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {getServerInfo()}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="resources" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Verfügbare Ressourcen</CardTitle>
                <CardDescription>
                  Zeige alle Ressourcen von diesem MCP Server an
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.resources ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground">Lade Ressourcen...</p>
                  </div>
                ) : resources.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Database className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">Keine Ressourcen verfügbar</p>
                    <p className="text-sm text-muted-foreground">
                      Dieser Server stellt keine Ressourcen bereit
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resources.map((resource, index) => (
                      <Card key={index} className="hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{resource.name}</p>
                              {resource.description && (
                                <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                              )}
                              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                                {resource.uri}
                              </code>
                              {resource.mimeType && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {resource.mimeType}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Templates</CardTitle>
                <CardDescription>
                  Verfügbare Prompts von diesem MCP Server
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.prompts ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground">Lade Prompts...</p>
                  </div>
                ) : prompts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">Keine Prompts verfügbar</p>
                    <p className="text-sm text-muted-foreground">
                      Dieser Server stellt keine Prompt-Templates bereit
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prompts.map((prompt, index) => (
                      <Card key={index} className="hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{prompt.name}</p>
                              {prompt.description && (
                                <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
                              )}
                              {prompt.arguments && prompt.arguments.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">Argumente:</p>
                                  <div className="space-y-1">
                                    {prompt.arguments.map((arg, argIndex) => (
                                      <div key={argIndex} className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          {arg.name}
                                          {arg.required && <span className="text-destructive ml-1">*</span>}
                                        </Badge>
                                        {arg.description && (
                                          <span className="text-xs text-muted-foreground">{arg.description}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle>Verfügbare Tools</CardTitle>
                <CardDescription>
                  Liste aller Tools von diesem MCP Server
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.tools ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground">Lade Tools...</p>
                  </div>
                ) : tools.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Wrench className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">Keine Tools verfügbar</p>
                    <p className="text-sm text-muted-foreground">
                      Dieser Server stellt keine Tools bereit
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tools.map((tool, index) => (
                      <Card key={index} className="hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Wrench className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{tool.name}</p>
                              {tool.description && (
                                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                              )}
                              {tool.inputSchema && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">Input Schema:</p>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                    {JSON.stringify(tool.inputSchema, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Server Logs</CardTitle>
                <CardDescription>
                  Echtzeit-Logs und Benachrichtigungen von diesem Server
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logs.filter(log => log.serverId === serverId).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <ScrollText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">Keine Logs verfügbar</p>
                    <p className="text-sm text-muted-foreground">
                      Logs erscheinen hier sobald der Server Nachrichten sendet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs
                      .filter(log => log.serverId === serverId)
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((log, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded border ${
                            log.level === 'error' ? 'border-destructive bg-destructive/10' :
                            log.level === 'warning' ? 'border-yellow-500 bg-yellow-500/10' :
                            log.level === 'info' ? 'border-blue-500 bg-blue-500/10' :
                            'border-muted bg-muted'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Badge
                              variant={log.level === 'error' ? 'destructive' : 'secondary'}
                              className="text-xs mt-0.5"
                            >
                              {log.level}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{log.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {log.timestamp.toLocaleString()}
                              </p>
                              {log.data && (
                                <pre className="text-xs bg-background/50 p-2 rounded mt-2 overflow-x-auto">
                                  {JSON.stringify(log.data, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddServerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onAddServer={() => {}}
        onUpdateServer={handleUpdateServer}
        editingServer={server.config}
      />
    </div>
  )
}
