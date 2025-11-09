import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollText } from 'lucide-react'

export const Route = createFileRoute('/logs')({
  component: Logs,
})

function Logs() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Logs & Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Zeige alle Logs und Benachrichtigungen von MCP Servern in Echtzeit
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Server Logs</CardTitle>
            <CardDescription>
              Echtzeit-Logs von allen verbundenen MCP Servern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ScrollText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">Keine Logs verfügbar</p>
              <p className="text-sm text-muted-foreground">
                Logs erscheinen hier sobald ein Server verbunden ist
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
