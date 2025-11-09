import type { ServerConfig, Resource, Prompt, Tool } from './server'

export interface ElectronAPI {
  connectToServer: (config: ServerConfig) => Promise<void>
  disconnectFromServer: (serverId: string) => Promise<void>
  getServerResources: (serverId: string) => Promise<Resource[]>
  getServerPrompts: (serverId: string) => Promise<Prompt[]>
  getServerTools: (serverId: string) => Promise<Tool[]>
  callTool: (serverId: string, toolName: string, args: unknown) => Promise<unknown>
  getPrompt: (serverId: string, promptName: string, args: Record<string, string>) => Promise<unknown>
  readResource: (serverId: string, uri: string) => Promise<unknown>
  loadServers: () => Promise<ServerConfig[]>
  saveServers: (servers: ServerConfig[]) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
