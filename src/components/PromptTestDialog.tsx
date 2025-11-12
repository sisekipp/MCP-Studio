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
import type { Prompt } from '@/types/server'

interface PromptTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt: Prompt | null
  serverId: string
  onExecute: (promptName: string, args: Record<string, string>) => Promise<unknown>
}

export function PromptTestDialog({
  open,
  onOpenChange,
  prompt,
  serverId,
  onExecute
}: PromptTestDialogProps) {
  const [args, setArgs] = useState<Record<string, string>>({})
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; data: unknown } | null>(null)

  if (!prompt) return null

  const arguments_ = prompt.arguments || []

  const handleExecute = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      const data = await onExecute(prompt.name, args)
      setResult({ success: true, data })
    } catch (error) {
      setResult({ success: false, data: error })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleClose = () => {
    setArgs({})
    setResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Prompt: {prompt.name}</DialogTitle>
          <DialogDescription>
            {prompt.description || 'Enter arguments to test this prompt'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Arguments Form */}
          {arguments_.length === 0 ? (
            <p className="text-sm text-muted-foreground">No arguments required</p>
          ) : (
            <div className="space-y-3">
              {arguments_.map((arg) => (
                <div key={arg.name} className="space-y-2">
                  <Label htmlFor={arg.name}>
                    {arg.name}
                    {arg.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {arg.description && (
                    <p className="text-xs text-muted-foreground">{arg.description}</p>
                  )}
                  <Input
                    id={arg.name}
                    value={args[arg.name] || ''}
                    onChange={(e) => setArgs({ ...args, [arg.name]: e.target.value })}
                    placeholder={arg.description || arg.name}
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
                    {result.success ? 'Prompt Retrieved Successfully' : 'Failed to Get Prompt'}
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
                Getting Prompt...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Get Prompt
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
