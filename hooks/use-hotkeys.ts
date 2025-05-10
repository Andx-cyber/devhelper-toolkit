"use client"

import { useEffect } from "react"

interface HotkeyConfig {
  keys: string
  callback: () => void
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
}

export function useHotkeys(hotkeys: HotkeyConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger hotkeys when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      for (const hotkey of hotkeys) {
        const keys = hotkey.keys.toLowerCase().split("+")
        const key = keys[keys.length - 1]

        const ctrlRequired = keys.includes("ctrl") || hotkey.ctrlKey
        const altRequired = keys.includes("alt") || hotkey.altKey
        const shiftRequired = keys.includes("shift") || hotkey.shiftKey

        if (
          event.key.toLowerCase() === key &&
          event.ctrlKey === !!ctrlRequired &&
          event.altKey === !!altRequired &&
          event.shiftKey === !!shiftRequired
        ) {
          event.preventDefault()
          hotkey.callback()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [hotkeys])
}
