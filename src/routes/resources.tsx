import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from 'lucide-react'

export const Route = createFileRoute('/resources')({
  component: Resources,
})

function Resources() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground mt-2">
            Inspiziere und verwalte verfügbare Ressourcen von MCP Servern
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verfügbare Ressourcen</CardTitle>
            <CardDescription>
              Zeige alle Ressourcen von verbundenen MCP Servern an
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">Keine Ressourcen verfügbar</p>
              <p className="text-sm text-muted-foreground">
                Verbinde dich mit einem MCP Server, um Ressourcen anzuzeigen
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
