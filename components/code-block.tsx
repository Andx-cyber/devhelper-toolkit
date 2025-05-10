"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
  isDark: boolean
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language, isDark, showLineNumbers = true }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)

  // Basic syntax highlighting function
  const highlightCode = (code: string, language: string) => {
    // Split the code into lines for line numbers
    const lines = code.split("\n")

    // Simple syntax highlighting for common elements
    const highlightedLines = lines.map((line) => {
      let highlighted = line
        // Strings
        .replace(/(["'`])(.*?)\1/g, '<span class="text-green-500">$&</span>')
        // Keywords
        .replace(
          /\b(function|return|if|for|while|else|class|import|export|from|const|let|var|try|catch|finally|switch|case|break|continue|new|this|typeof|instanceof)\b/g,
          '<span class="text-purple-500">$&</span>',
        )
        // Numbers
        .replace(/\b(\d+)\b/g, '<span class="text-blue-500">$&</span>')
        // Comments
        .replace(/\/\/(.*)/g, '<span class="text-gray-500">$&</span>')
        // Function calls
        .replace(/(\w+)(\s*\()/g, '<span class="text-yellow-500">$1</span>$2')

      // Language-specific highlighting
      if (language === "javascript" || language === "typescript") {
        highlighted = highlighted
          // JS/TS specific keywords
          .replace(/\b(async|await|Promise|null|undefined|true|false)\b/g, '<span class="text-purple-500">$&</span>')
      } else if (language === "python") {
        highlighted = highlighted
          // Python specific keywords
          .replace(
            /\b(def|import|from|as|None|True|False|and|or|not|in|is)\b/g,
            '<span class="text-purple-500">$&</span>',
          )
      } else if (language === "html" || language === "xml") {
        highlighted = highlighted
          // HTML/XML tags
          .replace(/(&lt;[^&]*&gt;)/g, '<span class="text-red-500">$&</span>')
          // HTML/XML attributes
          .replace(/(\s+\w+)=["'][^"']*["']/g, '<span class="text-blue-500">$&</span>')
      } else if (language === "css") {
        highlighted = highlighted
          // CSS properties
          .replace(/(\w+-?\w+)(?=\s*:)/g, '<span class="text-blue-500">$&</span>')
          // CSS values
          .replace(/:\s*([^;]+);/g, ': <span class="text-green-500">$1</span>;')
      } else if (language === "sql") {
        highlighted = highlighted
          // SQL keywords
          .replace(
            /\b(SELECT|FROM|WHERE|JOIN|ON|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW)\b/gi,
            '<span class="text-purple-500">$&</span>',
          )
      }

      return highlighted
    })

    return highlightedLines
  }

  useEffect(() => {
    if (preRef.current) {
      const highlightedLines = highlightCode(code, language)

      // Create line numbers if needed
      let lineNumbersHtml = ""
      if (showLineNumbers) {
        lineNumbersHtml = `<div class="select-none text-gray-500 pr-4 text-right" style="user-select: none; min-width: 40px;">
          ${highlightedLines.map((_, i) => i + 1).join("<br>")}
        </div>`
      }

      // Create the code content
      const codeContentHtml = `<div class="overflow-x-auto">
        ${highlightedLines.join("<br>")}
      </div>`

      // Combine line numbers and code content
      preRef.current.innerHTML = `
        <div class="flex">
          ${showLineNumbers ? lineNumbersHtml : ""}
          ${codeContentHtml}
        </div>
      `
    }
  }, [code, language, showLineNumbers])

  return (
    <pre
      ref={preRef}
      className={cn(
        "p-4 font-mono text-sm overflow-auto",
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800",
      )}
    />
  )
}
