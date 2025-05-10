"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"

const templates = [
  { id: "node", label: "Node.js" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "react", label: "React" },
  { id: "angular", label: "Angular" },
  { id: "vue", label: "Vue" },
  { id: "dotnet", label: ".NET" },
  { id: "go", label: "Go" },
  { id: "ruby", label: "Ruby" },
  { id: "rust", label: "Rust" },
  { id: "macos", label: "macOS" },
  { id: "windows", label: "Windows" },
  { id: "linux", label: "Linux" },
  { id: "vscode", label: "VS Code" },
  { id: "jetbrains", label: "JetBrains IDEs" },
]

export default function GitignoreGeneratorPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [gitignore, setGitignore] = useState("")

  const handleTemplateChange = (templateId: string, checked: boolean) => {
    if (checked) {
      setSelected([...selected, templateId])
    } else {
      setSelected(selected.filter((id) => id !== templateId))
    }
  }

  const generateGitignore = () => {
    // TODO: Implement actual gitignore generation
    const content = selected.map((id) => `# ${id} specific ignores\n# Add ${id} specific patterns here\n\n`).join("")
    setGitignore(content || "# No templates selected")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gitignore)
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">.gitignore Generator</h1>
        <p className="text-muted-foreground">
          Generate a .gitignore file based on your project's languages and frameworks
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Templates</CardTitle>
            <CardDescription>Choose the languages and frameworks for your project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={template.id}
                    checked={selected.includes(template.id)}
                    onCheckedChange={(checked) => handleTemplateChange(template.id, checked as boolean)}
                  />
                  <Label htmlFor={template.id}>{template.label}</Label>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" onClick={generateGitignore}>
              Generate .gitignore
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Generated .gitignore</span>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 gap-1">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={gitignore} readOnly className="font-mono text-sm min-h-[300px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
