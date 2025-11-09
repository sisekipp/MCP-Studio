import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Server, Circle, Trash2, Settings } from 'lucide-react'
import { useServers } from '@/contexts/ServerContext'
import { useState } from 'react'
import { AddServerDialog } from '@/components/AddServerDialog'
import type { ServerConfig, ServerConnection } from '@/types/server'

export const Route = createFileRoute('/')({
  component: Servers,
})

function Servers() {
  const { servers, addServer, updateServer, removeServer } = useServers()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingServer, setEditingServer] = useState<ServerConfig | undefined>(undefined)

  const handleEditServer = (e: React.MouseEvent, server: ServerConnection) => {
    e.preventDefault() // Prevent navigation to server detail
    e.stopPropagation()

    setEditingServer(server.config)
    setDialogOpen(true)
  }

  const handleDeleteServer = (e: React.MouseEvent, serverId: string) => {
    e.preventDefault() // Prevent navigation to server detail
    e.stopPropagation()

    if (confirm('Möchtest du diesen Server wirklich löschen?')) {
      removeServer(serverId)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingServer(undefined)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Server hinzufügen
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>MCP Server Verbindung</CardTitle>
            <CardDescription>
              Konfiguriere und verbinde dich mit MCP Servern über verschiedene Transport-Protokolle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2 border-dashed hover:border-primary cursor-pointer transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">stdio</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Lokale Prozess-Kommunikation
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed hover:border-primary cursor-pointer transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">SSE</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Server-Sent Events
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed hover:border-primary cursor-pointer transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">HTTP</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Streamable HTTP
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konfigurierte Server</CardTitle>
            <CardDescription>
              Verwalte deine MCP Server Konfigurationen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Server className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">Keine Server konfiguriert</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Füge einen Server hinzu, um zu starten
                </p>
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ersten Server hinzufügen
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {servers.map(server => (
                  <Link
                    key={server.id}
                    to="/servers/$serverId"
                    params={{ serverId: server.id }}
                    className="block"
                  >
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Server className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{server.config.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {server.config.transport}{server.config.description && ` • ${server.config.description}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={server.status === 'connected' ? 'default' : server.status === 'error' ? 'destructive' : 'secondary'}>
                            <Circle className="h-2 w-2 fill-current mr-1" />
                            {server.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={(e) => handleEditServer(e, server)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => handleDeleteServer(e, server.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddServerDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        onAddServer={addServer}
        onUpdateServer={updateServer}
        editingServer={editingServer}
      />
    </div>
  )
}
