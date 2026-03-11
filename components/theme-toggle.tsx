"use client"

import React, { useState, useEffect } from "react"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button" // Added import for Button component

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative flex items-center gap-1 p-1 rounded-full bg-secondary/50 border border-border/50">
      <ThemeButton
        active={theme === "light"}
        onClick={() => setTheme("light")}
        icon={<Sun className="w-4 h-4" />}
        label="Light mode"
      />
      <ThemeButton
        active={theme === "system"}
        onClick={() => setTheme("system")}
        icon={<Monitor className="w-4 h-4" />}
        label="System theme"
      />
      <ThemeButton
        active={theme === "dark"}
        onClick={() => setTheme("dark")}
        icon={<Moon className="w-4 h-4" />}
        label="Dark mode"
      />
    </div>
  )
}

function ThemeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300",
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary",
      )}
      aria-label={label}
    >
      {icon}
    </button>
  )
}
