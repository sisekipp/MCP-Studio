import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Server } from 'lucide-react'

export const Route = createFileRoute('/servers')({
  component: Servers,
})

function Servers() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Server Management</h1>
            <p className="text-muted-foreground mt-2">
              Verwalte deine MCP Server Verbindungen
            </p>
          </div>
          <Button>
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
            <CardTitle>Aktive Verbindungen</CardTitle>
            <CardDescription>
              Liste aller aktuell verbundenen MCP Server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Server className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">Keine Server verbunden</p>
              <p className="text-sm text-muted-foreground mb-4">
                Füge eine neue Server-Verbindung hinzu, um zu starten
              </p>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Ersten Server hinzufügen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
