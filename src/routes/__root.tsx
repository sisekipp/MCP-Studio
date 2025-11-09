import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Server } from 'lucide-react'

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen w-full">
      <nav className="w-64 border-r bg-card flex flex-col shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Server className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold">MCP Studio</h2>
          </div>
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Navigation</p>
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&.active]:bg-primary [&.active]:text-primary-foreground"
                activeProps={{ className: 'active' }}
              >
                <Server className="h-4 w-4" />
                Servers
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">Version 0.1.0</p>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
})
