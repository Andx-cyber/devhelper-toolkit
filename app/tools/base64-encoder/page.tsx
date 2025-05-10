"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ArrowDownUp } from "lucide-react"

export default function Base64EncoderPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState("encode")

  const handleEncode = () => {
    try {
      // TODO: Implement actual Base64 encoding
      setOutput(`Encoded: ${input}`)
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`)
    }
  }

  const handleDecode = () => {
    try {
      // TODO: Implement actual Base64 decoding
      setOutput(`Decoded: ${input}`)
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`)
    }
  }

  const handleProcess = () => {
    if (mode === "encode") {
      handleEncode()
    } else {
      handleDecode()
    }
  }

  const switchMode = () => {
    setMode(mode === "encode" ? "decode" : "encode")
    setInput(output)
    setOutput("")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">Encode or decode text using Base64</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base64 Converter</CardTitle>
          <CardDescription>Enter text to encode or Base64 to decode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Textarea
              placeholder={mode === "encode" ? "Enter text to encode" : "Enter Base64 to decode"}
              className="min-h-[150px] font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={handleProcess}>{mode === "encode" ? "Encode" : "Decode"}</Button>
            <Button variant="outline" onClick={switchMode} className="gap-2">
              <ArrowDownUp className="h-4 w-4" />
              Swap
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Result</span>
              {output && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 gap-1">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              readOnly
              placeholder="Result will appear here"
              className="min-h-[150px] font-mono"
              value={output}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
