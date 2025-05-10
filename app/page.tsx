import ToolGrid from "@/components/tool-grid"
import { tools } from "@/lib/tools"

export default function Home() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">DevHelper</h1>
        <p className="text-muted-foreground">A collection of useful tools for developers</p>
      </div>
      <ToolGrid tools={tools} />
    </div>
  )
}
