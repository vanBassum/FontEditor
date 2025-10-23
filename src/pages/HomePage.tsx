"use client"

import { useEffect, useState } from "react"
import { FontCodeEditor } from "@/components/FontCodeEditor"
import { FontDefDetails } from "@/components/FontDefDetails"
import { FontCharacterList } from "@/components/FontCharacterList"
import { FontCharacterEditor } from "@/components/FontCharacterEditor"
import { FontPreviewCard } from "@/components/FontPreviewCard"
import { type FontDef } from "@/types/font"
import { parseCFont } from "@/lib/fontParser"

// 👇 Import .h file as raw text
import defaultFontFile from "@/assets/fonts/font5x7.h?raw"

export default function HomePage() {
  const [font, setFont] = useState<FontDef | null>(null)
  const [selectedCode, setSelectedCode] = useState<number | null>(null)

  // Load default .h font once
  useEffect(() => {
    try {
      const parsed = parseCFont(defaultFontFile)
      if (parsed) setFont(parsed)
    } catch (e) {
      console.error("Failed to parse default font:", e)
    }
  }, [])

  // Wait until font is loaded
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
      <main className="flex flex-1 overflow-hidden px-4 lg:px-6 py-4 gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col flex-1 overflow-hidden pr-1">
          <div className="flex-shrink-0">
            <FontPreviewCard font={font} />
          </div>

          <div className="flex-1 min-h-0 mt-4 overflow-auto">
            <FontCharacterList
              font={font}
              selectedCode={selectedCode}
              onSelect={setSelectedCode}
              onChange={handleFontChange}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col flex-1 overflow-hidden pl-1">
          <div className="flex-shrink-0">
            <FontDefDetails font={font} onChange={handleFontChange} />
          </div>

          <div className="flex-shrink-0 mt-4">
            <FontCharacterEditor
              font={font}
              selectedCode={selectedCode}
              onChange={handleFontChange}
            />
          </div>

          <div className="flex-1 min-h-0 mt-4 overflow-auto">
            <FontCodeEditor
              value={font}
              onChange={handleFontChange}
              debounceMs={200}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
