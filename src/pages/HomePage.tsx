"use client"

import { useState } from "react"
import { FontCodeEditor } from "@/components/FontCodeEditor"
import { FontDefDetails } from "@/components/FontDefDetails"
import { FontCharacterList } from "@/components/FontCharacterList"
import { FontCharacterEditor } from "@/components/FontCharacterEditor"
import { FontPreviewCard } from "@/components/FontPreviewCard"
import { type FontDef } from "@/types/font"

export default function HomePage() {
  const [font, setFont] = useState<FontDef>({
    name: "font5x7",
    width: 5,
    height: 7,
    firstChar: 32,
    lastChar: 34,
    characters: [
      { code: 32, bytes: [0x00, 0x00, 0x00, 0x00, 0x00] },
      { code: 33, bytes: [0x00, 0x00, 0x5f, 0x00, 0x00] },
      { code: 34, bytes: [0x00, 0x07, 0x00, 0x07, 0x00] },
    ],
  })

  const [selectedCode, setSelectedCode] = useState<number | null>(null)

  const handleFontChange = (updated: FontDef) => {
    setFont(updated)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header (already in AppHeader now, so skip if duplicated) */}
      {/* <header className="px-6 py-4 border-b flex-shrink-0">
        <h1 className="text-3xl font-bold">Font Editor</h1>
      </header> */}

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden px-4 lg:px-6 py-4 gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col flex-1 overflow-hidden pr-1">
          {/* Preview stays fixed */}
          <div className="flex-shrink-0">
            <FontPreviewCard font={font} />
          </div>

          {/* List fills remaining space */}
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
          {/* Fixed details + editor */}
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

          {/* Code editor fills remaining space */}
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
