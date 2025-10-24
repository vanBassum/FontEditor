"use client"

import { Badge } from "@/components/ui/badge"

interface FontCharacterBadgeProps {
  code: number
}

export function FontCharacterBadge({ code }: FontCharacterBadgeProps) {
  const char = String.fromCharCode(code)

  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className="text-sm">{code}</span>
      <Badge variant="secondary" className="font-mono text-base px-2 py-0.5">
        {char}
      </Badge>
    </span>
  )
}
