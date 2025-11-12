import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Play, CheckCircle2, XCircle } from 'lucide-react'
import type { Tool } from '@/types/server'

interface ToolExecutionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tool: Tool | null
  serverId: string
  onExecute: (toolName: string, args: unknown) => Promise<unknown>
}

export function ToolExecutionDialog({
  open,
  onOpenChange,
  tool,
  serverId,
  onExecute
}: ToolExecutionDialogProps) {
  const [params, setParams] = useState<Record<string, string>>({})
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; data: unknown } | null>(null)

  if (!tool) return null

  // Extract parameter info from JSON Schema
  const schema = tool.inputSchema as { properties?: Record<string, { type?: string; description?: string }>; required?: string[] } | undefined
  const properties = schema?.properties || {}
  const requiredFields = schema?.required || []

  const handleExecute = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      // Convert params to proper types based on schema
      const typedParams: Record<string, unknown> = {}
      Object.entries(params).forEach(([key, value]) => {
        const propType = properties[key]?.type
        if (propType === 'number' || propType === 'integer') {
          typedParams[key] = value ? Number(value) : undefined
        } else if (propType === 'boolean') {
          typedParams[key] = value === 'true'
        } else if (propType === 'object' || propType === 'array') {
          try {
            typedParams[key] = value ? JSON.parse(value) : undefined
          } catch {
            typedParams[key] = value
          }
        } else {
          typedParams[key] = value
        }
      })

      const data = await onExecute(tool.name, typedParams)
      setResult({ success: true, data })
    } catch (error) {
      setResult({ success: false, data: error })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleClose = () => {
    setParams({})
    setResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Execute Tool: {tool.name}</DialogTitle>
          <DialogDescription>
            {tool.description || 'Enter parameters to execute this tool'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Parameters Form */}
          {Object.keys(properties).length === 0 ? (
            <p className="text-sm text-muted-foreground">No parameters required</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(properties).map(([key, prop]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key}
                    {requiredFields.includes(key) && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {prop.description && (
                    <p className="text-xs text-muted-foreground">{prop.description}</p>
                  )}
                  <Input
                    id={key}
                    value={params[key] || ''}
                    onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                    placeholder={prop.type || 'string'}
                    disabled={isExecuting}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success ? 'border-green-500 bg-green-500/10' : 'border-destructive bg-destructive/10'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {result.success ? 'Execution Successful' : 'Execution Failed'}
                  </p>
                </div>
              </div>
              <pre className="text-xs bg-background/50 p-3 rounded overflow-x-auto mt-2">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isExecuting}>
            Close
          </Button>
          <Button onClick={handleExecute} disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
