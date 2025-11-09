export type TransportType = 'stdio' | 'sse' | 'http'

export type ServerStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface ServerConfig {
  id: string
  name: string
  description?: string
  transport: TransportType
  config: StdioConfig | SSEConfig | HTTPConfig
}

export interface StdioConfig {
  type: 'stdio'
  command: string
  args?: string[]
  env?: Record<string, string>
}

export interface SSEConfig {
  type: 'sse'
  url: string
}

export interface HTTPConfig {
  type: 'http'
  url: string
}

export interface ServerConnection {
  id: string
  config: ServerConfig
  status: ServerStatus
  error?: string
  capabilities?: {
    resources?: boolean
    prompts?: boolean
    tools?: boolean
  }
}

export interface Resource {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

export interface Prompt {
  name: string
  description?: string
  arguments?: Array<{
    name: string
    description?: string
    required?: boolean
  }>
}

export interface Tool {
  name: string
  description?: string
  inputSchema: object
}

export interface LogEntry {
  timestamp: Date
  serverId: string
  level: 'debug' | 'info' | 'warning' | 'error'
  message: string
  data?: unknown
}
