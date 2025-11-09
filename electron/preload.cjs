const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // MCP Server Operations
  connectToServer: (config) => ipcRenderer.invoke('mcp:connect', config),
  disconnectFromServer: (serverId) => ipcRenderer.invoke('mcp:disconnect', serverId),
  getServerResources: (serverId) => ipcRenderer.invoke('mcp:getResources', serverId),
  getServerPrompts: (serverId) => ipcRenderer.invoke('mcp:getPrompts', serverId),
  getServerTools: (serverId) => ipcRenderer.invoke('mcp:getTools', serverId),
  callTool: (serverId, toolName, args) =>
    ipcRenderer.invoke('mcp:callTool', serverId, toolName, args),
  getPrompt: (serverId, promptName, args) =>
    ipcRenderer.invoke('mcp:getPrompt', serverId, promptName, args),
  readResource: (serverId, uri) =>
    ipcRenderer.invoke('mcp:readResource', serverId, uri),
})
