"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw, Download } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { copyToClipboard, downloadAsFile } from "@/lib/utils"
import { v1 as uuidv1, v4 as uuidv4 } from "uuid"

export default function UuidGeneratorPage() {
  const { toast } = useToast()
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState("v4")
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [braces, setBraces] = useState(false)

  const generateUuids = () => {
    const newUuids = Array.from({ length: count }, () => {
      // Generate UUID based on version
      let uuid = version === "v1" ? uuidv1() : uuidv4()

      // Apply formatting options
      if (uppercase) {
        uuid = uuid.toUpperCase()
      }

      if (!hyphens) {
        uuid = uuid.replace(/-/g, "")
      }

      if (braces) {
        uuid = `{${uuid}}`
      }

      return uuid
    })

    setUuids(newUuids)

    toast({
      title: "UUIDs Generated",
      description: `Generated ${count} UUID${count > 1 ? "s" : ""}`,
    })
  }

  const copyToClipboardHandler = async (uuid: string) => {
    const success = await copyToClipboard(uuid)

    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "UUID has been copied to your clipboard",
      })
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy UUID to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyAllToClipboard = async () => {
    const success = await copyToClipboard(uuids.join("\n"))

    if (success) {
      toast({
        title: "All UUIDs copied",
        description: `${uuids.length} UUID${uuids.length > 1 ? "s" : ""} copied to clipboard`,
      })
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy UUIDs to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadUuids = () => {
    downloadAsFile(uuids.join("\n"), "uuids.txt")

    toast({
      title: "UUIDs Downloaded",
      description: `${uuids.length} UUID${uuids.length > 1 ? "s" : ""} saved to uuids.txt`,
    })
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">UUID Generator</h1>
        <p className="text-muted-foreground">Generate random UUIDs for your applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate UUIDs</CardTitle>
          <CardDescription>Select options and generate one or more UUIDs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="count">Number of UUIDs</Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>UUID Version</Label>
                <RadioGroup value={version} onValueChange={setVersion}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="v1" id="v1" />
                    <Label htmlFor="v1">Version 1 (time-based)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="v4" id="v4" />
                    <Label htmlFor="v4">Version 4 (random)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Format Options</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                  <Label htmlFor="uppercase">Uppercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} />
                  <Label htmlFor="hyphens">Include hyphens</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="braces" checked={braces} onCheckedChange={setBraces} />
                  <Label htmlFor="braces">Add braces {"{}"}</Label>
                </div>
              </div>

              <Button onClick={generateUuids} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Generate
              </Button>
            </div>
            <div className="space-y-4">
              {uuids.length > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <Label>Generated UUIDs</Label>
                    <div className="flex gap-2">
                      {uuids.length > 1 && (
                        <Button variant="outline" size="sm" onClick={copyAllToClipboard} className="gap-1">
                          <Copy className="h-4 w-4" />
                          Copy All
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={downloadUuids} className="gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {uuids.map((uuid, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={uuid} readOnly className="font-mono text-sm" />
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboardHandler(uuid)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
