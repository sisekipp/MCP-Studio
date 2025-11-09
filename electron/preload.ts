import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // Example: Send message to main process
  sendMessage: (channel: string, data: any) => {
    // Whitelist channels
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },

  // Example: Receive message from main process
  onMessage: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      // Strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})

// Type definitions for TypeScript
export interface IElectronAPI {
  platform: string
  sendMessage: (channel: string, data: any) => void
  onMessage: (channel: string, func: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
