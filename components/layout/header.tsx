"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Code2, Github } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-200",
        scrolled && "shadow-sm",
      )}
    >
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Code2 className="h-5 w-5" />
          <span>DevHelper</span>
        </Link>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:gap-4">
          <nav className="flex items-center gap-4 ml-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tools/json-converter"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/tools") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Tools
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="https://github.com/Andx-cyber" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col gap-4 py-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/tools/json-converter"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/tools") ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tools
            </Link>
            <Link
              href="https://github.com/Andx-cyber"
              target="_blank"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
