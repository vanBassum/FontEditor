"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { FontCharacterIcon } from "@/components/FontCharacterIcon"
import { type FontDef } from "@/types/font"
import { useState } from "react"

interface FontCharacterListProps {
  font: FontDef
  selectedCode: number | null
  onSelect: (code: number | null) => void
  onChange: (newFont: FontDef) => void
}

export function FontCharacterList({
  font,
  selectedCode,
  onSelect,
  onChange,
}: FontCharacterListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleSelect = (code: number) => {
    onSelect(code === selectedCode ? null : code)
  }

  const handleAdd = () => {
    const last = font.characters.at(-1)
    const newCode = (last?.code ?? font.lastChar) + 1
    const newChar = { code: newCode, bytes: new Array(font.width).fill(0) }
    onChange({
      ...font,
      lastChar: newCode,
      characters: [...font.characters, newChar],
    })
    onSelect(newCode)
  }

  const handleDelete = () => {
    if (selectedCode == null) return
    const updated = font.characters.filter((c) => c.code !== selectedCode)
    const lastChar =
      updated.length > 0 ? updated[updated.length - 1].code : font.firstChar
    onChange({ ...font, characters: updated, lastChar })
    onSelect(null)
  }

  // ---- Drag & Drop ----
  const handleDragStart = (index: number) => () => setDragIndex(index)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()
  const handleDrop = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    const reordered = [...font.characters]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(index, 0, moved)

    const updated = reordered.map((c, i) => ({
      ...c,
      code: font.firstChar + i,
    }))

    onChange({
      ...font,
      characters: updated,
      lastChar: font.firstChar + updated.length - 1,
    })
    onSelect(moved.code)
    setDragIndex(null)
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center flex-shrink-0">
        <CardTitle>Characters</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleAdd}>
            Add
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={selectedCode == null}
          >
            Delete
          </Button>
        </div>
      </CardHeader>

      {/* 👇 This section expands and scrolls internally */}
      <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-4 p-4">
            {font.characters.map((ch, index) => {
              const isSelected = ch.code === selectedCode
              const isDragging = dragIndex === index

              return (
                <div
                  key={ch.code}
                  draggable
                  onDragStart={handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop(index)}
                  onClick={() => handleSelect(ch.code)}
                  className={`flex flex-col items-center justify-center text-center rounded-md cursor-pointer transition ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  } ${isDragging ? "opacity-50" : ""}`}
                >
                  <FontCharacterIcon
                    char={ch}
                    width={font.width}
                    height={font.height}
                    pixelSize={8}
                  />
                  <div className="text-xs text-gray-600 mt-1 select-none">
                    {String.fromCharCode(ch.code)} ({ch.code})
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex-shrink-0 text-sm text-gray-600">
        {selectedCode != null ? (
          <span>
            Selected: <b>{String.fromCharCode(selectedCode)}</b> ({selectedCode})
          </span>
        ) : (
          <span>No character selected</span>
        )}
      </CardFooter>
    </Card>
  )
}
