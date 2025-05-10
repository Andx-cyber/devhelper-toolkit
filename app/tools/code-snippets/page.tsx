"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Plus, Search, Trash, Download, Edit, Share, Tag, X, Clock, Star, StarOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, formatDate } from "@/lib/utils"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { useTheme } from "next-themes"
import { CodeBlock } from "@/components/code-block"

// Define types
interface Snippet {
  id: string
  title: string
  language: string
  code: string
  description: string
  tags: string[]
  createdAt: string
  updatedAt: string
  favorite: boolean
  category: string
}

interface Category {
  id: string
  name: string
  color: string
}

// Sample languages for the demo
const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "php",
  "ruby",
  "go",
  "rust",
  "html",
  "css",
  "sql",
  "bash",
  "json",
  "yaml",
  "markdown",
  "xml",
  "c",
  "cpp",
  "swift",
  "kotlin",
  "dart",
]

// Sample categories
const defaultCategories: Category[] = [
  { id: "general", name: "General", color: "bg-gray-500" },
  { id: "frontend", name: "Frontend", color: "bg-blue-500" },
  { id: "backend", name: "Backend", color: "bg-green-500" },
  { id: "devops", name: "DevOps", color: "bg-orange-500" },
  { id: "database", name: "Database", color: "bg-purple-500" },
]

// Sample snippets for the demo
const sampleSnippets: Snippet[] = [
  {
    id: "1",
    title: "React useState Hook",
    language: "javascript",
    code: "const [state, setState] = useState(initialState);",
    description: "Basic React useState hook example",
    tags: ["react", "hooks", "state"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: true,
    category: "frontend",
  },
  {
    id: "2",
    title: "Python List Comprehension",
    language: "python",
    code: "squares = [x**2 for x in range(10)]",
    description: "Create a list of squares using list comprehension",
    tags: ["python", "list", "comprehension"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: false,
    category: "backend",
  },
  {
    id: "3",
    title: "SQL SELECT Query",
    language: "sql",
    code: "SELECT column1, column2\nFROM table_name\nWHERE condition;",
    description: "Basic SQL SELECT query with WHERE clause",
    tags: ["sql", "query", "select"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: false,
    category: "database",
  },
  {
    id: "4",
    title: "Docker Compose Example",
    language: "yaml",
    code: "version: '3'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - \"80:80\"\n  db:\n    image: postgres:13\n    environment:\n      POSTGRES_PASSWORD: example",
    description: "Simple Docker Compose file with Nginx and Postgres",
    tags: ["docker", "compose", "yaml"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: true,
    category: "devops",
  },
]

// Utility functions
const generateId = () => Math.random().toString(36).substring(2, 10)

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy text: ", error)
    return false
  }
}

const downloadAsFile = (content: string, filename: string, contentType = "text/plain") => {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Language display names
const languageDisplayNames: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  bash: "Bash",
  json: "JSON",
  yaml: "YAML",
  markdown: "Markdown",
  xml: "XML",
  c: "C",
  cpp: "C++",
  swift: "Swift",
  kotlin: "Kotlin",
  dart: "Dart",
}

export default function CodeSnippetsPage() {
  // Theme
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // State
  const { toast } = useToast()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest")
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [activeTab, setActiveTab] = useState("browse")
  const [isEditing, setIsEditing] = useState(false)
  const [showTagsPopover, setShowTagsPopover] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const emptySnippet = {
    title: "",
    language: "",
    code: "",
    description: "",
    tags: "",
    category: "general",
  }
  const [newSnippet, setNewSnippet] = useState(emptySnippet)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)

  // Load snippets and categories from localStorage on mount
  useEffect(() => {
    try {
      const savedSnippets = localStorage.getItem("code-snippets")
      if (savedSnippets) {
        setSnippets(JSON.parse(savedSnippets))
      } else {
        setSnippets(sampleSnippets)
      }

      const savedCategories = localStorage.getItem("snippet-categories")
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error)
      setSnippets(sampleSnippets)
    }
  }, [])

  // Save snippets and categories to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("code-snippets", JSON.stringify(snippets))
      localStorage.setItem("snippet-categories", JSON.stringify(categories))
    } catch (error) {
      console.error("Failed to save data to localStorage:", error)
    }
  }, [snippets, categories])

  // Extract all unique tags from snippets
  useEffect(() => {
    const tags = new Set<string>()
    snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => tags.add(tag))
    })
    setAllTags(Array.from(tags).sort())
  }, [snippets])

  // Filter snippets based on search term, language, category, tags, and favorites
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      searchTerm === "" ||
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLanguage = !selectedLanguage || selectedLanguage === "all" || snippet.language === selectedLanguage
    const matchesCategory = !selectedCategory || selectedCategory === "all" || snippet.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => snippet.tags.includes(tag))
    const matchesFavorite = !showFavoritesOnly || snippet.favorite

    return matchesSearch && matchesLanguage && matchesCategory && matchesTags && matchesFavorite
  })

  // Sort snippets
  const sortedSnippets = [...filteredSnippets].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "oldest":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case "az":
        return a.title.localeCompare(b.title)
      case "za":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  // Set the first snippet as selected when the filtered list changes
  useEffect(() => {
    if (sortedSnippets.length > 0 && !selectedSnippet) {
      setSelectedSnippet(sortedSnippets[0])
    } else if (sortedSnippets.length > 0 && selectedSnippet) {
      // Check if the currently selected snippet is still in the filtered list
      const stillExists = sortedSnippets.some((s) => s.id === selectedSnippet.id)
      if (!stillExists) {
        setSelectedSnippet(sortedSnippets[0])
      }
    } else {
      setSelectedSnippet(null)
    }
  }, [sortedSnippets, selectedSnippet])

  // Keyboard shortcuts
  useHotkeys([
    { keys: "ctrl+f", callback: () => searchInputRef.current?.focus() },
    { keys: "ctrl+n", callback: () => setActiveTab("add") },
    { keys: "escape", callback: () => setSearchTerm("") },
    { keys: "ctrl+s", callback: () => selectedSnippet && handleToggleFavorite(selectedSnippet.id) },
    { keys: "ctrl+e", callback: () => selectedSnippet && handleEditSnippet(selectedSnippet) },
    { keys: "ctrl+d", callback: () => selectedSnippet && handleDeleteSnippet(selectedSnippet.id) },
    { keys: "ctrl+c", callback: () => selectedSnippet && handleCopySnippet(selectedSnippet.code) },
  ])

  const handleNewSnippetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewSnippet({
      ...newSnippet,
      [name]: value,
    })
  }

  const handleEditingSnippetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingSnippet) return

    const { name, value } = e.target
    setEditingSnippet({
      ...editingSnippet,
      [name]: value,
    })
  }

  const addSnippet = () => {
    if (!newSnippet.title || !newSnippet.language || !newSnippet.code) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title, language, and code fields",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()
    const newSnippetObj: Snippet = {
      id: generateId(),
      title: newSnippet.title,
      language: newSnippet.language,
      code: newSnippet.code,
      description: newSnippet.description,
      tags: newSnippet.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: now,
      updatedAt: now,
      favorite: false,
      category: newSnippet.category || "general",
    }

    setSnippets([...snippets, newSnippetObj])
    setNewSnippet(emptySnippet)
    setActiveTab("browse")
    setSelectedSnippet(newSnippetObj)

    toast({
      title: "Snippet added",
      description: `"${newSnippetObj.title}" has been added to your library`,
    })
  }

  const updateSnippet = () => {
    if (!editingSnippet) return

    if (!editingSnippet.title || !editingSnippet.language || !editingSnippet.code) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title, language, and code fields",
        variant: "destructive",
      })
      return
    }

    const updatedSnippet: Snippet = {
      ...editingSnippet,
      updatedAt: new Date().toISOString(),
      tags:
        typeof editingSnippet.tags === "string"
          ? (editingSnippet.tags as string)
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : editingSnippet.tags,
    }

    setSnippets(snippets.map((s) => (s.id === updatedSnippet.id ? updatedSnippet : s)))
    setSelectedSnippet(updatedSnippet)
    setEditingSnippet(null)
    setIsEditing(false)

    toast({
      title: "Snippet updated",
      description: `"${updatedSnippet.title}" has been updated`,
    })
  }

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet({
      ...snippet,
      tags: Array.isArray(snippet.tags) ? snippet.tags.join(", ") : snippet.tags,
    })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setEditingSnippet(null)
    setIsEditing(false)
  }

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter((snippet) => snippet.id !== id))

    if (selectedSnippet && selectedSnippet.id === id) {
      setSelectedSnippet(null)
    }

    toast({
      title: "Snippet deleted",
      description: "The snippet has been removed from your library",
    })
  }

  const handleToggleFavorite = (id: string) => {
    setSnippets(snippets.map((snippet) => (snippet.id === id ? { ...snippet, favorite: !snippet.favorite } : snippet)))

    if (selectedSnippet && selectedSnippet.id === id) {
      setSelectedSnippet({ ...selectedSnippet, favorite: !selectedSnippet.favorite })
    }
  }

  const handleCopySnippet = async (code: string) => {
    const success = await copyToClipboard(code)

    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "The code snippet has been copied to your clipboard",
      })
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const exportSnippets = () => {
    const data = JSON.stringify(snippets, null, 2)
    downloadAsFile(data, "code-snippets.json", "application/json")

    toast({
      title: "Snippets exported",
      description: `${snippets.length} snippets exported to code-snippets.json`,
    })
  }

  const importSnippets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedSnippets = JSON.parse(event.target?.result as string) as Snippet[]
        setSnippets([...snippets, ...importedSnippets])

        toast({
          title: "Snippets imported",
          description: `${importedSnippets.length} snippets imported successfully`,
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset the input
    e.target.value = ""
  }

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      color,
    }
    setCategories([...categories, newCategory])
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.color || "bg-gray-500"
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "General"
  }

  const handleShareSnippet = (snippet: Snippet) => {
    // Create a shareable URL with the snippet data encoded
    const snippetData = encodeURIComponent(
      JSON.stringify({
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        description: snippet.description,
        tags: snippet.tags,
      }),
    )

    const shareUrl = `${window.location.origin}/tools/code-snippets?share=${snippetData}`

    copyToClipboard(shareUrl)
    toast({
      title: "Share link copied",
      description: "A link to this snippet has been copied to your clipboard",
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedLanguage(undefined)
    setSelectedCategory(undefined)
    setSelectedTags([])
    setShowFavoritesOnly(false)
    setSortBy("newest")
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Code Snippets Library</h1>
        <p className="text-muted-foreground">Store and organize your frequently used code snippets</p>
      </div>

      <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Snippets</TabsTrigger>
          <TabsTrigger value="add">Add Snippet</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Search Snippets</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportSnippets} className="gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      id="import-file"
                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      accept=".json"
                      onChange={importSnippets}
                    />
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Import
                    </Button>
                  </div>
                </div>
              </CardTitle>
              <CardDescription>Find snippets by title, description, tags, or content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search snippets... (Ctrl+F)"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ref={searchInputRef}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="az">A to Z</SelectItem>
                      <SelectItem value="za">Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={resetFilters} title="Reset filters">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {languageDisplayNames[language] || language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover open={showTagsPopover} onOpenChange={setShowTagsPopover}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                      {selectedTags.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedTags.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search tags..." />
                      <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup>
                          {allTags.map((tag) => (
                            <CommandItem
                              key={tag}
                              onSelect={() => {
                                setSelectedTags(
                                  selectedTags.includes(tag)
                                    ? selectedTags.filter((t) => t !== tag)
                                    : [...selectedTags, tag],
                                )
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedTags.includes(tag)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedTags([...selectedTags, tag])
                                    } else {
                                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                                    }
                                  }}
                                />
                                <span>{tag}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                      {selectedTags.length > 0 && (
                        <div className="border-t p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-center"
                            onClick={() => setSelectedTags([])}
                          >
                            Clear all
                          </Button>
                        </div>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>

                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star className="h-4 w-4" />
                  Favorites
                </Button>
              </div>
            </CardContent>
          </Card>

          {sortedSnippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h3 className="mt-2 text-lg font-semibold">No snippets found</h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">Try adjusting your search or add a new snippet.</p>
              <Button onClick={() => setActiveTab("add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Snippet
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Snippet List</h3>
                  <span className="text-sm text-muted-foreground">{sortedSnippets.length} snippets</span>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {sortedSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className={cn(
                          "rounded-lg border p-3 cursor-pointer transition-colors hover:bg-muted/50",
                          selectedSnippet?.id === snippet.id ? "bg-muted" : "",
                          "relative",
                        )}
                        onClick={() => setSelectedSnippet(snippet)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{snippet.title}</h4>
                              {snippet.favorite && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{snippet.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className="capitalize">
                              {languageDisplayNames[snippet.language] || snippet.language}
                            </Badge>
                            <Badge className={cn("text-white", getCategoryColor(snippet.category))}>
                              {getCategoryName(snippet.category)}
                            </Badge>
                          </div>
                        </div>
                        {snippet.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {snippet.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {snippet.tags.length > 3 && (
                              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                +{snippet.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(new Date(snippet.updatedAt))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                {selectedSnippet ? (
                  isEditing ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Edit Snippet</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            name="title"
                            value={editingSnippet?.title || ""}
                            onChange={handleEditingSnippetChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-language">Language</Label>
                            <Select
                              value={editingSnippet?.language || ""}
                              onValueChange={(value) =>
                                setEditingSnippet((prev) => (prev ? { ...prev, language: value } : null))
                              }
                            >
                              <SelectTrigger id="edit-language">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.map((language) => (
                                  <SelectItem key={language} value={language}>
                                    {languageDisplayNames[language] || language}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                              value={editingSnippet?.category || "general"}
                              onValueChange={(value) =>
                                setEditingSnippet((prev) => (prev ? { ...prev, category: value } : null))
                              }
                            >
                              <SelectTrigger id="edit-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-code">Code</Label>
                          <Textarea
                            id="edit-code"
                            name="code"
                            className="font-mono min-h-[200px]"
                            value={editingSnippet?.code || ""}
                            onChange={handleEditingSnippetChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description (optional)</Label>
                          <Textarea
                            id="edit-description"
                            name="description"
                            value={editingSnippet?.description || ""}
                            onChange={handleEditingSnippetChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-tags">Tags (comma separated, optional)</Label>
                          <Input
                            id="edit-tags"
                            name="tags"
                            value={
                              typeof editingSnippet?.tags === "string"
                                ? editingSnippet.tags
                                : editingSnippet?.tags.join(", ") || ""
                            }
                            onChange={handleEditingSnippetChange}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button onClick={updateSnippet}>Save Changes</Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {selectedSnippet.title}
                              {selectedSnippet.favorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {languageDisplayNames[selectedSnippet.language] || selectedSnippet.language}
                              </Badge>
                              <Badge className={cn("text-white", getCategoryColor(selectedSnippet.category))}>
                                {getCategoryName(selectedSnippet.category)}
                              </Badge>
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleFavorite(selectedSnippet.id)}
                              title={selectedSnippet.favorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              {selectedSnippet.favorite ? (
                                <StarOff className="h-4 w-4" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopySnippet(selectedSnippet.code)}
                              title="Copy code"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSnippet(selectedSnippet)}
                              title="Edit snippet"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShareSnippet(selectedSnippet)}
                              title="Share snippet"
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="Delete snippet">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Snippet</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete "{selectedSnippet.title}"? This action cannot be
                                    undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {}}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleDeleteSnippet(selectedSnippet.id)}>
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-md overflow-hidden border">
                          <CodeBlock code={selectedSnippet.code} language={selectedSnippet.language} isDark={isDark} />
                        </div>

                        {selectedSnippet.description && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{selectedSnippet.description}</p>
                          </div>
                        )}

                        {selectedSnippet.tags.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedSnippet.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground pt-2 border-t flex justify-between">
                          <span>Created: {formatDate(new Date(selectedSnippet.createdAt))}</span>
                          <span>Updated: {formatDate(new Date(selectedSnippet.updatedAt))}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Select a snippet to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Snippet</CardTitle>
              <CardDescription>Save a new code snippet to your library</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Snippet title"
                  value={newSnippet.title}
                  onChange={handleNewSnippetChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={newSnippet.language}
                    onValueChange={(value) => setNewSnippet({ ...newSnippet, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {languageDisplayNames[language] || language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newSnippet.category}
                    onValueChange={(value) => setNewSnippet({ ...newSnippet, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Textarea
                  id="code"
                  name="code"
                  placeholder="Paste your code here"
                  className="font-mono min-h-[200px]"
                  value={newSnippet.code}
                  onChange={handleNewSnippetChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what this code does"
                  value={newSnippet.description}
                  onChange={handleNewSnippetChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated, optional)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="react, hooks, state"
                  value={newSnippet.tags}
                  onChange={handleNewSnippetChange}
                />
              </div>

              <Button onClick={addSnippet} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Snippet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>Create and organize categories for your snippets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", category.color)} />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="outline">{snippets.filter((s) => s.category === category.id).length}</Badge>
                    </div>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>Create a new category to organize your snippets</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input id="category-name" placeholder="e.g., Frontend, Backend, DevOps" />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            "bg-red-500",
                            "bg-blue-500",
                            "bg-green-500",
                            "bg-yellow-500",
                            "bg-purple-500",
                            "bg-pink-500",
                            "bg-indigo-500",
                            "bg-gray-500",
                            "bg-orange-500",
                            "bg-teal-500",
                          ].map((color) => (
                            <div
                              key={color}
                              className={cn(
                                "w-8 h-8 rounded-full cursor-pointer border-2",
                                color,
                                "hover:opacity-80 transition-opacity",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Keyboard shortcuts help dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="fixed bottom-4 right-4">
            Keyboard Shortcuts
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Use these keyboard shortcuts to work more efficiently</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl+F
                </Badge>
                <span>Focus search</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl+N
                </Badge>
                <span>New snippet</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Esc
                </Badge>
                <span>Clear search</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl+S
                </Badge>
                <span>Toggle favorite</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl+E
                </Badge>
                <span>Edit snippet</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl+D
                </Badge>
                <span>Delete snippet</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Ctrl+C
                </Badge>
                <span>Copy code</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
