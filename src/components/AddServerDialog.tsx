import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Server, Terminal, Radio, Globe } from 'lucide-react'
import type { TransportType, ServerConfig } from '@/types/server'

interface AddServerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddServer: (config: ServerConfig) => void
  onUpdateServer?: (config: ServerConfig) => void
  editingServer?: ServerConfig
}

export function AddServerDialog({ open, onOpenChange, onAddServer, onUpdateServer, editingServer }: AddServerDialogProps) {
  const isEditing = !!editingServer

  const [transport, setTransport] = useState<TransportType>(editingServer?.transport || 'stdio')
  const [name, setName] = useState(editingServer?.name || '')
  const [description, setDescription] = useState(editingServer?.description || '')
  const [command, setCommand] = useState(
    editingServer?.config.type === 'stdio' ? editingServer.config.command : ''
  )
  const [args, setArgs] = useState(
    editingServer?.config.type === 'stdio' ? editingServer.config.args?.join(' ') || '' : ''
  )
  const [url, setUrl] = useState(
    editingServer?.config.type === 'sse' || editingServer?.config.type === 'http' ? editingServer.config.url : ''
  )

  // Update form fields when editingServer changes
  useEffect(() => {
    if (editingServer) {
      setTransport(editingServer.transport)
      setName(editingServer.name)
      setDescription(editingServer.description || '')

      if (editingServer.config.type === 'stdio') {
        setCommand(editingServer.config.command)
        setArgs(editingServer.config.args?.join(' ') || '')
        setUrl('')
      } else if (editingServer.config.type === 'sse' || editingServer.config.type === 'http') {
        setUrl(editingServer.config.url)
        setCommand('')
        setArgs('')
      }
    } else {
      // Reset form when not editing
      setTransport('stdio')
      setName('')
      setDescription('')
      setCommand('')
      setArgs('')
      setUrl('')
    }
  }, [editingServer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const config: ServerConfig = {
      id: isEditing ? editingServer.id : `server-${Date.now()}`,
      name: name || 'Unnamed Server',
      description: description || undefined,
      transport,
      config:
        transport === 'stdio'
          ? {
              type: 'stdio',
              command,
              args: args ? args.split(' ').filter(Boolean) : [],
              env: {}
            }
          : transport === 'sse'
          ? {
              type: 'sse',
              url
            }
          : {
              type: 'http',
              url
            }
    }

    if (isEditing && onUpdateServer) {
      onUpdateServer(config)
    } else {
      onAddServer(config)
    }

    // Reset form
    setName('')
    setDescription('')
    setCommand('')
    setArgs('')
    setUrl('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Server bearbeiten' : 'MCP Server hinzufügen'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Bearbeite die Konfiguration des MCP Servers' : 'Konfiguriere eine neue Verbindung zu einem MCP Server'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Server Name</Label>
              <Input
                id="name"
                placeholder="z.B. File System Server"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Input
                id="description"
                placeholder="z.B. Zugriff auf lokales Dateisystem"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Tabs value={transport} onValueChange={(v) => setTransport(v as TransportType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stdio">
                  <Terminal className="h-4 w-4 mr-2" />
                  stdio
                </TabsTrigger>
                <TabsTrigger value="sse">
                  <Radio className="h-4 w-4 mr-2" />
                  SSE
                </TabsTrigger>
                <TabsTrigger value="http">
                  <Globe className="h-4 w-4 mr-2" />
                  HTTP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stdio" className="space-y-4 mt-4 min-h-[240px]">
                <div className="space-y-2">
                  <Label htmlFor="command">Command</Label>
                  <Input
                    id="command"
                    placeholder="npx"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Der auszuführende Befehl (z.B. npx, node, python)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="args">Argumente</Label>
                  <Input
                    id="args"
                    placeholder="-y @modelcontextprotocol/server-everything"
                    value={args}
                    onChange={(e) => setArgs(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Durch Leerzeichen getrennt (z.B. -y @modelcontextprotocol/server-everything)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="sse" className="space-y-4 mt-4 min-h-[240px]">
                <div className="space-y-2">
                  <Label htmlFor="sse-url">Server URL</Label>
                  <Input
                    id="sse-url"
                    type="url"
                    placeholder="http://localhost:3000/sse"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    SSE Endpoint URL
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="http" className="space-y-4 mt-4 min-h-[240px]">
                <div className="space-y-2">
                  <Label htmlFor="http-url">Server URL</Label>
                  <Input
                    id="http-url"
                    type="url"
                    placeholder="http://localhost:3000"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    HTTP Endpoint URL
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">
              <Server className="mr-2 h-4 w-4" />
              {isEditing ? 'Speichern' : 'Hinzufügen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
