import { FileJson, Regex, FileCode, FileText, KeyRound, Binary, Palette, Code } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface ToolType {
  name: string
  href: string
  icon: LucideIcon
  description: string
}

export const tools: ToolType[] = [
  {
    name: "JSON ↔️ YAML ↔️ CSV Converter",
    href: "/tools/json-converter",
    icon: FileJson,
    description: "Convert between JSON, YAML, and CSV formats with ease",
  },
  {
    name: "Regex Builder",
    href: "/tools/regex-builder",
    icon: Regex,
    description: "Build and test regular expressions with real-time preview and explanation",
  },
  {
    name: ".gitignore Generator",
    href: "/tools/gitignore-generator",
    icon: FileCode,
    description: "Generate a .gitignore file based on your project's languages and frameworks",
  },
  {
    name: "README.md Generator",
    href: "/tools/readme-generator",
    icon: FileText,
    description: "Generate a professional README.md file for your project",
  },
  {
    name: "UUID Generator",
    href: "/tools/uuid-generator",
    icon: KeyRound,
    description: "Generate random UUIDs for your applications",
  },
  {
    name: "Base64 Encoder/Decoder",
    href: "/tools/base64-encoder",
    icon: Binary,
    description: "Encode or decode text using Base64",
  },
  {
    name: "Color Picker & Gradient Generator",
    href: "/tools/color-picker",
    icon: Palette,
    description: "Pick colors and create beautiful gradients for your projects",
  },
  {
    name: "Code Snippets Library",
    href: "/tools/code-snippets",
    icon: Code,
    description: "Store and organize your frequently used code snippets",
  },
]
