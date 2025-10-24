"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { type FontDef } from "@/types/font"

interface FontPreviewCardProps {
  font: FontDef
  pixelSize?: number // default 10
  className?: string // ✅ allow parent to pass Tailwind classes
}

/**
 * FontPreviewCard
 * - Live preview of typed text using the current font.
 */
export function FontPreviewCard({
  font,
  pixelSize = 10,
  className,
}: FontPreviewCardProps) {
  const [text, setText] = useState("Hello world!")
  const [showGrid, setShowGrid] = useState(true)

  const getGlyphByCode = (code: number) =>
    font.characters.find((c) => c.code === code) || null

  return (
    <Card className={cn("w-full h-full flex flex-col", className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something…"
          className="font-mono w-auto sm:w-48"
        />
        <div className="flex items-center space-x-2">
          <Label htmlFor="show-grid" className="text-sm">
            Show Grid
          </Label>
          <Switch
            id="show-grid"
            checked={showGrid}
            onCheckedChange={setShowGrid}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">


          <div className="overflow-auto bg-white p-2">
            <div className="flex flex-row items-start flex-wrap gap-0">
              {Array.from(text).map((ch, idx) => {
                const code = ch.charCodeAt(0)
                const glyph = getGlyphByCode(code)
                const isLast = idx === text.length - 1

                if (!glyph) {
                  return (
                    <div
                      key={idx}
                      className="inline-block"
                      style={{
                        width: font.width * pixelSize,
                        height: font.height * pixelSize,
                        lineHeight: 0,
                      }}
                      title={`(missing ${code})`}
                    />
                  )
                }

                return (
                  <div key={idx} className="flex">
                    <div
                      className="inline-grid"
                      style={{
                        gridTemplateColumns: `repeat(${font.width}, ${pixelSize}px)`,
                        gridTemplateRows: `repeat(${font.height}, ${pixelSize}px)`,
                        lineHeight: 0,
                      }}
                      title={`'${ch}' (${glyph.code})`}
                    >
                      {Array.from({ length: font.height }).map((_, row) =>
                        Array.from({ length: font.width }).map((_, col) => {
                          const bitOn = (glyph.bytes[col] >> row) & 1
                          return (
                            <div
                              key={`${idx}-${row}-${col}`}
                              style={{
                                width: pixelSize,
                                height: pixelSize,
                                backgroundColor: bitOn ? "#000" : "#fff",
                                border: showGrid ? "1px solid #e5e7eb" : "none",
                                boxSizing: "border-box",
                              }}
                            />
                          )
                        })
                      )}
                    </div>

                    {/* 👇 add 1 pixel-wide spacer grid column */}
                    {!isLast && (
                      <div
                        style={{
                          width: pixelSize,
                          height: font.height * pixelSize,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
