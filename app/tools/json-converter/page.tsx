"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { copyToClipboard, downloadAsFile, safeJsonParse } from "@/lib/utils"
import yaml from "js-yaml"
import Papa from "papaparse"

export default function JsonConverterPage() {
  const { toast } = useToast()
  const [input, setInput] = useLocalStorage("json-converter-input", "")
  const [output, setOutput] = useState("")
  const [format, setFormat] = useState("json")
  const [targetFormat, setTargetFormat] = useState("yaml")
  const [error, setError] = useState<string | null>(null)

  // Convert between formats
  const handleConvert = () => {
    setError(null)

    try {
      if (!input.trim()) {
        setOutput("")
        return
      }

      // Parse input based on format
      let parsedData: any

      if (format === "json") {
        const result = safeJsonParse(input)
        if (result.error) {
          throw new Error(`Invalid JSON: ${result.error.message}`)
        }
        parsedData = result.data
      } else if (format === "yaml") {
        parsedData = yaml.load(input)
      } else if (format === "csv") {
        const result = Papa.parse(input, { header: true })
        if (result.errors.length > 0) {
          throw new Error(`CSV parsing error: ${result.errors[0].message}`)
        }
        parsedData = result.data
      }

      // Convert to target format
      if (targetFormat === "json") {
        setOutput(JSON.stringify(parsedData, null, 2))
      } else if (targetFormat === "yaml") {
        setOutput(yaml.dump(parsedData))
      } else if (targetFormat === "csv") {
        // For CSV, we need to handle nested objects differently
        // This is a simple implementation that works for flat objects
        if (!Array.isArray(parsedData)) {
          parsedData = [parsedData]
        }
        setOutput(Papa.unparse(parsedData))
      }

      toast({
        title: "Conversion successful",
        description: `Converted from ${format.toUpperCase()} to ${targetFormat.toUpperCase()}`,
        variant: "success",
      })
    } catch (err) {
      setError((err as Error).message)
      setOutput("")
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!output) return

    const success = await copyToClipboard(output)
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "The converted content has been copied to your clipboard",
      })
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle download
  const handleDownload = () => {
    if (!output) return

    const extensions = {
      json: "json",
      yaml: "yml",
      csv: "csv",
    }

    downloadAsFile(output, `converted.${extensions[targetFormat as keyof typeof extensions]}`)

    toast({
      title: "Downloaded",
      description: `File saved as converted.${extensions[targetFormat as keyof typeof extensions]}`,
    })
  }

  // Auto-convert when input, format, or targetFormat changes
  useEffect(() => {
    if (input) {
      handleConvert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, targetFormat])

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">JSON ↔️ YAML ↔️ CSV Converter</h1>
        <p className="text-muted-foreground">Convert between JSON, YAML, and CSV formats with ease</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Converter</CardTitle>
          <CardDescription>
            Paste your content in the input field and select the formats to convert between
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Tabs defaultValue="json" value={format} onValueChange={setFormat}>
                <TabsList>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="yaml">YAML</TabsTrigger>
                  <TabsTrigger value="csv">CSV</TabsTrigger>
                </TabsList>
                <TabsContent value="json" className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Enter valid JSON data. Objects and arrays are supported.
                  </p>
                </TabsContent>
                <TabsContent value="yaml" className="mt-2">
                  <p className="text-sm text-muted-foreground">Enter valid YAML data. Indentation is important.</p>
                </TabsContent>
                <TabsContent value="csv" className="mt-2">
                  <p className="text-sm text-muted-foreground">Enter CSV data with headers in the first row.</p>
                </TabsContent>
              </Tabs>
              <Textarea
                placeholder={`Paste your ${format.toUpperCase()} content here...`}
                className="min-h-[200px] font-mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={handleConvert} className="gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Convert
              </Button>
            </div>

            <div className="grid gap-2">
              <Tabs defaultValue="yaml" value={targetFormat} onValueChange={setTargetFormat}>
                <TabsList>
                  <TabsTrigger value="json" disabled={format === "json"}>
                    JSON
                  </TabsTrigger>
                  <TabsTrigger value="yaml" disabled={format === "yaml"}>
                    YAML
                  </TabsTrigger>
                  <TabsTrigger value="csv" disabled={format === "csv"}>
                    CSV
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {error ? (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              ) : (
                <>
                  <Textarea
                    placeholder="Output will appear here..."
                    className="min-h-[200px] font-mono"
                    value={output}
                    readOnly
                  />
                  {output && (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
