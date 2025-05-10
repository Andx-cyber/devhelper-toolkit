"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, RefreshCw } from "lucide-react"

export default function ColorPickerPage() {
  const [color, setColor] = useState("#3b82f6")
  const [gradientColors, setGradientColors] = useState(["#3b82f6", "#8b5cf6"])
  const [gradientDirection, setGradientDirection] = useState("to right")
  const [gradientType, setGradientType] = useState("linear")

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  const handleGradientColorChange = (index: number, value: string) => {
    const newColors = [...gradientColors]
    newColors[index] = value
    setGradientColors(newColors)
  }

  const addGradientColor = () => {
    if (gradientColors.length < 5) {
      setGradientColors([...gradientColors, "#ffffff"])
    }
  }

  const removeGradientColor = (index: number) => {
    if (gradientColors.length > 2) {
      const newColors = [...gradientColors]
      newColors.splice(index, 1)
      setGradientColors(newColors)
    }
  }

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const generateRandomColors = () => {
    setColor(getRandomColor())
    setGradientColors(gradientColors.map(() => getRandomColor()))
  }

  const copyColorToClipboard = () => {
    navigator.clipboard.writeText(color)
  }

  const getGradientCSS = () => {
    const colorStops = gradientColors.join(", ")
    if (gradientType === "linear") {
      return `background: linear-gradient(${gradientDirection}, ${colorStops});`
    } else {
      return `background: radial-gradient(circle, ${colorStops});`
    }
  }

  const copyGradientCSS = () => {
    navigator.clipboard.writeText(getGradientCSS())
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Color Picker & Gradient Generator</h1>
        <p className="text-muted-foreground">Pick colors and create beautiful gradients for your projects</p>
      </div>

      <Tabs defaultValue="color">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="color">Color Picker</TabsTrigger>
          <TabsTrigger value="gradient">Gradient Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Picker</CardTitle>
              <CardDescription>Select a color or enter a hex value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-32 rounded-md border" style={{ backgroundColor: color }} />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="colorPicker">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="colorPicker"
                      value={color}
                      onChange={handleColorChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input type="text" value={color} onChange={handleColorChange} className="font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={generateRandomColors} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Random
                    </Button>
                    <Button variant="outline" onClick={copyColorToClipboard} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gradient" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Generator</CardTitle>
              <CardDescription>Create and customize gradients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="w-full h-32 rounded-md border"
                style={{
                  background:
                    gradientType === "linear"
                      ? `linear-gradient(${gradientDirection}, ${gradientColors.join(", ")})`
                      : `radial-gradient(circle, ${gradientColors.join(", ")})`,
                }}
              />

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Gradient Type</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={gradientType === "linear" ? "default" : "outline"}
                        onClick={() => setGradientType("linear")}
                        className="flex-1"
                      >
                        Linear
                      </Button>
                      <Button
                        variant={gradientType === "radial" ? "default" : "outline"}
                        onClick={() => setGradientType("radial")}
                        className="flex-1"
                      >
                        Radial
                      </Button>
                    </div>
                  </div>

                  {gradientType === "linear" && (
                    <div className="space-y-2">
                      <Label>Direction</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "to top",
                          "to right top",
                          "to right",
                          "to right bottom",
                          "to bottom",
                          "to left bottom",
                          "to left",
                          "to left top",
                        ].map((direction) => (
                          <Button
                            key={direction}
                            variant={gradientDirection === direction ? "default" : "outline"}
                            onClick={() => setGradientDirection(direction)}
                            className="text-xs h-8"
                          >
                            {direction.replace("to ", "").replace(" ", "-")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Colors</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addGradientColor}
                        disabled={gradientColors.length >= 5}
                      >
                        Add Color
                      </Button>
                      <Button variant="outline" size="sm" onClick={generateRandomColors}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {gradientColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={color}
                          onChange={(e) => handleGradientColorChange(index, e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={color}
                          onChange={(e) => handleGradientColorChange(index, e.target.value)}
                          className="font-mono"
                        />
                        {gradientColors.length > 2 && (
                          <Button variant="ghost" size="icon" onClick={() => removeGradientColor(index)}>
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>CSS</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={getGradientCSS()} className="font-mono text-sm" />
                    <Button variant="outline" onClick={copyGradientCSS} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
