"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { tools } from "@/lib/tools"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Reset collapsed state when switching between mobile and desktop
  useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  if (isMobile) return null

  return (
    <div
      className={cn(
        "hidden border-r bg-muted/40 md:flex md:flex-col transition-all duration-300",
        collapsed ? "md:w-16" : "md:w-64 lg:w-72",
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        <div className="flex justify-between items-center py-2">
          {!collapsed && <h2 className="px-2 text-lg font-semibold tracking-tight">Tools</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="space-y-1">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === tool.href ? "bg-accent text-accent-foreground" : "transparent",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? tool.name : undefined}
            >
              <tool.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{tool.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
