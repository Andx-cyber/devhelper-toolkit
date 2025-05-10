"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, FileDown } from "lucide-react"

export default function ReadmeGeneratorPage() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    installation: "",
    usage: "",
    features: "",
    contributing: "",
    license: "MIT",
  })
  const [readme, setReadme] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const generateReadme = () => {
    // TODO: Implement actual README generation
    const content = `# ${formData.projectName}

${formData.description}

## Features

${formData.features}

## Installation

\`\`\`bash
${formData.installation}
\`\`\`

## Usage

${formData.usage}

## Contributing

${formData.contributing}

## License

${formData.license}
`
    setReadme(content)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readme)
  }

  const downloadReadme = () => {
    const element = document.createElement("a")
    const file = new Blob([readme], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "README.md"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">README.md Generator</h1>
        <p className="text-muted-foreground">Generate a professional README.md file for your project</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Fill in the details about your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="My Awesome Project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A brief description of what your project does"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features</Label>
              <Textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="- Feature 1\n- Feature 2\n- Feature 3"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installation">Installation</Label>
              <Textarea
                id="installation"
                name="installation"
                value={formData.installation}
                onChange={handleInputChange}
                placeholder="npm install my-package"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usage">Usage</Label>
              <Textarea
                id="usage"
                name="usage"
                value={formData.usage}
                onChange={handleInputChange}
                placeholder="How to use your project"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contributing">Contributing</Label>
              <Textarea
                id="contributing"
                name="contributing"
                value={formData.contributing}
                onChange={handleInputChange}
                placeholder="Guidelines for contributing to your project"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License</Label>
              <Input
                id="license"
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                placeholder="MIT"
              />
            </div>
            <Button className="w-full" onClick={generateReadme}>
              Generate README
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Generated README.md</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 gap-1">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadReadme} className="h-8 gap-1">
                  <FileDown className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={readme} readOnly className="font-mono text-sm min-h-[500px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
