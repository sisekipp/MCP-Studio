import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, FileText, XCircle } from 'lucide-react'
import type { Resource } from '@/types/server'

interface ResourceViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: Resource | null
  serverId: string
  onRead: (uri: string) => Promise<unknown>
}

export function ResourceViewerDialog({
  open,
  onOpenChange,
  resource,
  serverId,
  onRead
}: ResourceViewerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && resource) {
      loadResource()
    } else {
      setContent(null)
      setError(null)
    }
  }, [open, resource])

  const loadResource = async () => {
    if (!resource) return

    setIsLoading(true)
    setError(null)
    setContent(null)

    try {
      const data = await onRead(resource.uri)
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resource')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setContent(null)
    setError(null)
    onOpenChange(false)
  }

  if (!resource) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {resource.name}
          </DialogTitle>
          <DialogDescription>
            {resource.description || resource.uri}
            {resource.mimeType && (
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">
                {resource.mimeType}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Loading resource...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-lg border border-destructive bg-destructive/10">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-destructive">Failed to Load Resource</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : content ? (
            <div className="border rounded-lg">
              <div className="bg-muted px-3 py-2 border-b">
                <code className="text-xs">{resource.uri}</code>
              </div>
              <pre className="text-sm p-4 overflow-x-auto max-h-[500px]">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
