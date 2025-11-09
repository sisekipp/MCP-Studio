import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { ServerConnection, ServerConfig, Resource, Prompt, Tool, LogEntry } from '@/types/server'

interface ServerContextType {
  servers: ServerConnection[]
  logs: LogEntry[]
  addServer: (config: ServerConfig) => void
  updateServer: (config: ServerConfig) => void
  connectToServer: (serverId: string) => Promise<void>
  disconnectServer: (serverId: string) => Promise<void>
  removeServer: (serverId: string) => void
  getServerResources: (serverId: string) => Promise<Resource[]>
  getServerPrompts: (serverId: string) => Promise<Prompt[]>
  getServerTools: (serverId: string) => Promise<Tool[]>
}

const ServerContext = createContext<ServerContextType | undefined>(undefined)

export function ServerProvider({ children }: { children: ReactNode }) {
  const [servers, setServers] = useState<ServerConnection[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const addLog = useCallback((log: Omit<LogEntry, 'timestamp'>) => {
    setLogs(prev => [...prev, { ...log, timestamp: new Date() }])
  }, [])

  // Load servers from electron-store on mount
  useEffect(() => {
    const loadServers = async () => {
      try {
        const savedConfigs = await window.electronAPI.loadServers()
        if (savedConfigs && savedConfigs.length > 0) {
          const loadedServers: ServerConnection[] = savedConfigs.map(config => ({
            id: config.id,
            config,
            status: 'disconnected'
          }))
          setServers(loadedServers)
          addLog({
            serverId: 'system',
            level: 'info',
            message: `Loaded ${savedConfigs.length} server configuration(s) from storage`
          })
        }
      } catch (error) {
        console.error('Failed to load servers from storage:', error)
        addLog({
          serverId: 'system',
          level: 'error',
          message: 'Failed to load server configurations from storage'
        })
      } finally {
        setIsLoaded(true)
      }
    }
    loadServers()
  }, [addLog])

  // Save servers to electron-store whenever they change
  useEffect(() => {
    if (!isLoaded) return // Don't save on initial load

    const saveServers = async () => {
      try {
        const configs = servers.map(s => s.config)
        await window.electronAPI.saveServers(configs)
      } catch (error) {
        console.error('Failed to save servers to storage:', error)
      }
    }
    saveServers()
  }, [servers, isLoaded])

  const addServer = useCallback((config: ServerConfig) => {
    // Add server with disconnected status (not connected yet)
    setServers(prev => [...prev, {
      id: config.id,
      config,
      status: 'disconnected'
    }])

    addLog({
      serverId: config.id,
      level: 'info',
      message: `Server configuration added: ${config.name}`
    })
  }, [addLog])

  const updateServer = useCallback((config: ServerConfig) => {
    // Update existing server config
    setServers(prev => prev.map(s =>
      s.id === config.id ? { ...s, config } : s
    ))

    addLog({
      serverId: config.id,
      level: 'info',
      message: `Server configuration updated: ${config.name}`
    })
  }, [addLog])

  const connectToServer = useCallback(async (serverId: string) => {
    const server = servers.find(s => s.id === serverId)
    if (!server) {
      throw new Error('Server not found')
    }

    // Update status to connecting
    setServers(prev => prev.map(s =>
      s.id === serverId ? { ...s, status: 'connecting' } : s
    ))

    addLog({
      serverId,
      level: 'info',
      message: `Connecting to server: ${server.config.name}`
    })

    try {
      // Call IPC to connect to server in main process
      await window.electronAPI.connectToServer(server.config)

      // Update status to connected
      setServers(prev => prev.map(s =>
        s.id === serverId ? { ...s, status: 'connected' } : s
      ))

      addLog({
        serverId,
        level: 'info',
        message: `Successfully connected to: ${server.config.name}`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      setServers(prev => prev.map(s =>
        s.id === serverId
          ? { ...s, status: 'error', error: errorMessage }
          : s
      ))

      addLog({
        serverId,
        level: 'error',
        message: `Failed to connect: ${errorMessage}`,
        data: error
      })

      throw error
    }
  }, [servers, addLog])

  const disconnectServer = useCallback(async (serverId: string) => {
    const server = servers.find(s => s.id === serverId)
    if (!server) return

    addLog({
      serverId,
      level: 'info',
      message: `Disconnecting from: ${server.config.name}`
    })

    try {
      await window.electronAPI.disconnectFromServer(serverId)

      // Update status to disconnected (don't remove from list)
      setServers(prev => prev.map(s =>
        s.id === serverId ? { ...s, status: 'disconnected' } : s
      ))

      addLog({
        serverId,
        level: 'info',
        message: `Disconnected from: ${server.config.name}`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      addLog({
        serverId,
        level: 'error',
        message: `Failed to disconnect: ${errorMessage}`,
        data: error
      })

      throw error
    }
  }, [servers, addLog])

  const removeServer = useCallback((serverId: string) => {
    const server = servers.find(s => s.id === serverId)
    if (!server) return

    // Remove server from list
    setServers(prev => prev.filter(s => s.id !== serverId))

    addLog({
      serverId,
      level: 'info',
      message: `Server removed: ${server.config.name}`
    })
  }, [servers, addLog])

  const getServerResources = useCallback(async (serverId: string): Promise<Resource[]> => {
    try {
      const resources = await window.electronAPI.getServerResources(serverId)
      return resources
    } catch (error) {
      addLog({
        serverId,
        level: 'error',
        message: 'Failed to fetch resources',
        data: error
      })
      return []
    }
  }, [addLog])

  const getServerPrompts = useCallback(async (serverId: string): Promise<Prompt[]> => {
    try {
      const prompts = await window.electronAPI.getServerPrompts(serverId)
      return prompts
    } catch (error) {
      addLog({
        serverId,
        level: 'error',
        message: 'Failed to fetch prompts',
        data: error
      })
      return []
    }
  }, [addLog])

  const getServerTools = useCallback(async (serverId: string): Promise<Tool[]> => {
    try {
      const tools = await window.electronAPI.getServerTools(serverId)
      return tools
    } catch (error) {
      addLog({
        serverId,
        level: 'error',
        message: 'Failed to fetch tools',
        data: error
      })
      return []
    }
  }, [addLog])

  return (
    <ServerContext.Provider
      value={{
        servers,
        logs,
        addServer,
        updateServer,
        connectToServer,
        disconnectServer,
        removeServer,
        getServerResources,
        getServerPrompts,
        getServerTools,
      }}
    >
      {children}
    </ServerContext.Provider>
  )
}

export function useServers() {
  const context = useContext(ServerContext)
  if (context === undefined) {
    throw new Error('useServers must be used within a ServerProvider')
  }
  return context
}
