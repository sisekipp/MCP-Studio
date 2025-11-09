import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

interface ServerConfig {
  id: string
  name: string
  transport: 'stdio' | 'sse' | 'http'
  config: StdioConfig | SSEConfig | HTTPConfig
}

interface StdioConfig {
  type: 'stdio'
  command: string
  args?: string[]
  env?: Record<string, string>
}

interface SSEConfig {
  type: 'sse'
  url: string
}

interface HTTPConfig {
  type: 'http'
  url: string
}

interface ServerInstance {
  id: string
  config: ServerConfig
  client: Client
  transport: StdioClientTransport
}

class MCPManager {
  private servers: Map<string, ServerInstance> = new Map()

  async connectServer(config: ServerConfig): Promise<void> {
    if (this.servers.has(config.id)) {
      throw new Error(`Server ${config.id} is already connected`)
    }

    if (config.transport !== 'stdio') {
      throw new Error(`Transport type ${config.transport} is not yet implemented`)
    }

    const stdioConfig = config.config as StdioConfig

    // Create transport
    const transport = new StdioClientTransport({
      command: stdioConfig.command,
      args: stdioConfig.args || [],
      env: stdioConfig.env || {}
    })

    // Create client
    const client = new Client({
      name: 'mcp-studio',
      version: '0.1.0'
    }, {
      capabilities: {
        roots: {
          listChanged: false
        }
      }
    })

    try {
      // Connect
      await client.connect(transport)

      // Store server instance
      this.servers.set(config.id, {
        id: config.id,
        config,
        client,
        transport
      })

      console.log(`Successfully connected to server: ${config.name}`)
    } catch (error) {
      // Clean up on error
      try {
        await transport.close()
      } catch (closeError) {
        console.error('Error closing transport:', closeError)
      }
      throw error
    }
  }

  async disconnectServer(serverId: string): Promise<void> {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    try {
      await server.client.close()
      await server.transport.close()
      this.servers.delete(serverId)
      console.log(`Disconnected from server: ${server.config.name}`)
    } catch (error) {
      console.error(`Error disconnecting from server ${serverId}:`, error)
      throw error
    }
  }

  async getResources(serverId: string) {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    const result = await server.client.listResources()
    return result.resources
  }

  async getPrompts(serverId: string) {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    const result = await server.client.listPrompts()
    return result.prompts
  }

  async getTools(serverId: string) {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    const result = await server.client.listTools()
    return result.tools
  }

  async callTool(serverId: string, toolName: string, args: unknown) {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    return await server.client.callTool({ name: toolName, arguments: args })
  }

  async getPrompt(serverId: string, promptName: string, args: Record<string, string>) {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    return await server.client.getPrompt({ name: promptName, arguments: args })
  }

  async readResource(serverId: string, uri: string) {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }

    return await server.client.readResource({ uri })
  }

  async cleanup() {
    const disconnectPromises = Array.from(this.servers.keys()).map(serverId =>
      this.disconnectServer(serverId).catch(error =>
        console.error(`Error disconnecting server ${serverId}:`, error)
      )
    )
    await Promise.all(disconnectPromises)
  }
}

export const mcpManager = new MCPManager()
