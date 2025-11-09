import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, MessageSquare, Wrench, ScrollText, ArrowLeft, Circle } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/servers/$serverId')({
  component: ServerDetail,
})

function ServerDetail() {
  const { serverId } = Route.useParams()

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Server: {serverId}</h1>
              <Badge variant="default" className="flex items-center gap-1">
                <Circle className="h-2 w-2 fill-current" />
                Connected
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              stdio • localhost
            </p>
          </div>
          <Button variant="outline">Disconnect</Button>
        </div>

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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Database className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">Keine Ressourcen verfügbar</p>
                  <p className="text-sm text-muted-foreground">
                    Dieser Server stellt keine Ressourcen bereit
                  </p>
                </div>
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">Keine Prompts verfügbar</p>
                  <p className="text-sm text-muted-foreground">
                    Dieser Server stellt keine Prompt-Templates bereit
                  </p>
                </div>
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Wrench className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">Keine Tools verfügbar</p>
                  <p className="text-sm text-muted-foreground">
                    Dieser Server stellt keine Tools bereit
                  </p>
                </div>
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ScrollText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">Keine Logs verfügbar</p>
                  <p className="text-sm text-muted-foreground">
                    Logs erscheinen hier sobald der Server Nachrichten sendet
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
