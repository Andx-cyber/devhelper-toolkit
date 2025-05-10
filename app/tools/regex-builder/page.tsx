"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function RegexBuilderPage() {
  const [pattern, setPattern] = useState("")
  const [testString, setTestString] = useState("")
  const [flags, setFlags] = useState("g")
  const [matches, setMatches] = useState<string[]>([])
  const [explanation, setExplanation] = useState("")

  // Placeholder for regex testing logic
  const testRegex = () => {
    try {
      if (!pattern) return

      const regex = new RegExp(pattern, flags)
      const matches = testString.match(regex) || []
      setMatches(matches)

      // TODO: Implement actual regex explanation
      setExplanation("This regex pattern matches specific characters or patterns in the text.")
    } catch (error) {
      setMatches([])
      setExplanation(`Error: ${(error as Error).message}`)
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Regex Builder</h1>
        <p className="text-muted-foreground">
          Build and test regular expressions with real-time preview and explanation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pattern</CardTitle>
            <CardDescription>Enter your regular expression pattern</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Regular expression pattern"
                  value={pattern}
                  onChange={(e) => {
                    setPattern(e.target.value)
                    testRegex()
                  }}
                />
              </div>
              <div>
                <Input
                  placeholder="Flags"
                  value={flags}
                  onChange={(e) => {
                    setFlags(e.target.value)
                    testRegex()
                  }}
                  className="w-20"
                />
              </div>
            </div>
            <div>
              <Textarea
                placeholder="Test string"
                value={testString}
                onChange={(e) => {
                  setTestString(e.target.value)
                  testRegex()
                }}
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Matches and explanation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Matches ({matches.length})</h3>
              <div className="flex flex-wrap gap-2">
                {matches.length > 0 ? (
                  matches.map((match, index) => (
                    <Badge key={index} variant="secondary">
                      {match}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No matches found</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Explanation</h3>
              <p className="text-sm text-muted-foreground">{explanation}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
