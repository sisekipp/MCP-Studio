import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // MCP Server Operations
  connectToServer: (config: any) => ipcRenderer.invoke('mcp:connect', config),
  disconnectFromServer: (serverId: string) => ipcRenderer.invoke('mcp:disconnect', serverId),
  getServerResources: (serverId: string) => ipcRenderer.invoke('mcp:getResources', serverId),
  getServerPrompts: (serverId: string) => ipcRenderer.invoke('mcp:getPrompts', serverId),
  getServerTools: (serverId: string) => ipcRenderer.invoke('mcp:getTools', serverId),
  callTool: (serverId: string, toolName: string, args: any) =>
    ipcRenderer.invoke('mcp:callTool', serverId, toolName, args),
  getPrompt: (serverId: string, promptName: string, args: any) =>
    ipcRenderer.invoke('mcp:getPrompt', serverId, promptName, args),
  readResource: (serverId: string, uri: string) =>
    ipcRenderer.invoke('mcp:readResource', serverId, uri),
})
