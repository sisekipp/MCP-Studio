import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { mcpManager } from './mcp-manager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Disable security warnings in development
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    autoHideMenuBar: true,
    show: false // Don't show until ready
  })

  // Show window when ready to prevent flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Load the app
  if (!app.isPackaged) {
    // Development mode - load from Vite dev server
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // Production mode
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Setup IPC handlers
function setupIPCHandlers() {
  ipcMain.handle('mcp:connect', async (_event, config) => {
    return await mcpManager.connectServer(config)
  })

  ipcMain.handle('mcp:disconnect', async (_event, serverId) => {
    return await mcpManager.disconnectServer(serverId)
  })

  ipcMain.handle('mcp:getResources', async (_event, serverId) => {
    return await mcpManager.getResources(serverId)
  })

  ipcMain.handle('mcp:getPrompts', async (_event, serverId) => {
    return await mcpManager.getPrompts(serverId)
  })

  ipcMain.handle('mcp:getTools', async (_event, serverId) => {
    return await mcpManager.getTools(serverId)
  })

  ipcMain.handle('mcp:callTool', async (_event, serverId, toolName, args) => {
    return await mcpManager.callTool(serverId, toolName, args)
  })

  ipcMain.handle('mcp:getPrompt', async (_event, serverId, promptName, args) => {
    return await mcpManager.getPrompt(serverId, promptName, args)
  })

  ipcMain.handle('mcp:readResource', async (_event, serverId, uri) => {
    return await mcpManager.readResource(serverId, uri)
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  setupIPCHandlers()
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Cleanup before quit
app.on('before-quit', async (event) => {
  event.preventDefault()
  await mcpManager.cleanup()
  app.exit()
})

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})
