import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export const Route = createFileRoute('/prompts')({
  component: Prompts,
})

function Prompts() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground mt-2">
            Teste Prompt-Templates mit benutzerdefinierten Argumenten
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Templates</CardTitle>
            <CardDescription>
              Verfügbare Prompts von verbundenen MCP Servern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">Keine Prompts verfügbar</p>
              <p className="text-sm text-muted-foreground">
                Verbinde dich mit einem MCP Server, um Prompts anzuzeigen
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
