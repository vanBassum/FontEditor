"use client"

import { useEffect, useState } from "react"
import { FontCodeEditor } from "@/components/FontCodeEditor"
import { FontDefDetails } from "@/components/FontDefDetails"
import { FontCharacterList } from "@/components/FontCharacterList"
import { FontCharacterEditor } from "@/components/FontCharacterEditor"
import { FontPreviewCard } from "@/components/FontPreviewCard"
import { type FontDef } from "@/types/font"
import { parseCFont } from "@/lib/fontParser"
import defaultFontFile from "@/assets/fonts/font5x7.h?raw"

export default function HomePage() {
  const [font, setFont] = useState<FontDef | null>(null)
  const [selectedCode, setSelectedCode] = useState<number | null>(null)

  useEffect(() => {
    try {
      const parsed = parseCFont(defaultFontFile)
      if (parsed) setFont(parsed)
    } catch (e) {
      console.error("Failed to parse default font:", e)
    }
  }, [])

  if (!font) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading default font...
      </div>
    )
  }

  const handleFontChange = (updated: FontDef) => setFont(updated)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className="flex-1 overflow-auto px-4 lg:px-6 py-4 space-y-6">
        {/* === Row 1 === */}
        <div className="grid grid-cols-12 items-stretch gap-6">
          <div className="col-span-12 md:col-span-3 h-full">
            <FontDefDetails font={font} onChange={handleFontChange} className="h-full" />
          </div>
          <div className="col-span-12 md:col-span-3 h-full">
            <FontCharacterEditor
              font={font}
              selectedCode={selectedCode}
              onChange={handleFontChange}
              className="h-full"
            />
          </div>
          <div className="col-span-12 md:col-span-6 h-full">
            <FontPreviewCard font={font} className="h-full" />
          </div>
        </div>

        {/* === Row 2 === */}
        <div className="grid grid-cols-12 items-stretch gap-6">
          <div className="col-span-12 md:col-span-6 h-full">
            <FontCharacterList
              font={font}
              selectedCode={selectedCode}
              onSelect={setSelectedCode}
              onChange={handleFontChange}
              className="h-full"
            />
          </div>
          <div className="col-span-12 md:col-span-6 h-full">
            <FontCodeEditor
              value={font}
              onChange={handleFontChange}
              debounceMs={200}
              className="h-full"
            />
          </div>
        </div>
      </main>
    </div>

  )
}
