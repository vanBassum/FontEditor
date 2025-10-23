"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type FontDef } from "@/types/font"

interface FontCharacterEditorProps {
  font: FontDef
  selectedCode: number | null
  onChange: (newFont: FontDef) => void
}

/**
 * Displays a pixel grid to edit one character's bitmap.
 * Each bit in bytes[col] represents a pixel (row bit 0 = top).
 */
export function FontCharacterEditor({
  font,
  selectedCode,
  onChange,
}: FontCharacterEditorProps) {
  if (selectedCode == null)
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Character Editor</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-500 text-sm">
          Select a character to edit.
        </CardContent>
      </Card>
    )

  const charIndex = font.characters.findIndex((c) => c.code === selectedCode)
  if (charIndex === -1)
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Character Editor</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-500 text-sm">
          Character not found.
        </CardContent>
      </Card>
    )

  const character = font.characters[charIndex]
  const { width, height } = font

  // Toggle pixel in a specific (col, row)
  const togglePixel = (col: number, row: number) => {
    const newFont = structuredClone(font)
    const char = newFont.characters[charIndex]
    const mask = 1 << row
    char.bytes[col] ^= mask // toggle bit
    onChange(newFont)
  }

  // Clear / Fill helpers
  const clearChar = () => {
    const newFont = structuredClone(font)
    newFont.characters[charIndex].bytes = new Array(width).fill(0)
    onChange(newFont)
  }

  const fillChar = () => {
    const newFont = structuredClone(font)
    newFont.characters[charIndex].bytes = new Array(width).fill(
      (1 << height) - 1
    )
    onChange(newFont)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>
          Editing: '{String.fromCharCode(selectedCode)}' ({selectedCode})
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={clearChar}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={fillChar}>
            Fill
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className="inline-grid border border-gray-300 bg-white"
          style={{
            gridTemplateColumns: `repeat(${width}, 20px)`,
            gridTemplateRows: `repeat(${height}, 20px)`,
          }}
        >
          {Array.from({ length: height }).map((_, row) =>
            Array.from({ length: width }).map((_, col) => {
              const bitOn = (character.bytes[col] >> row) & 1
              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => togglePixel(col, row)}
                  className={`w-[20px] h-[20px] border border-gray-200 cursor-pointer ${
                    bitOn ? "bg-black" : "bg-white hover:bg-gray-100"
                  }`}
                />
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
