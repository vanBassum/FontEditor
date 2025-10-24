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
import { FontCharacterItem } from "@/components/FontCharacterItem"
import { type FontDef } from "@/types/font"
import { cn } from "@/lib/utils"

interface FontCharacterListProps {
  font: FontDef
  selectedCode: number | null
  className?: string
  onSelect: (code: number | null) => void
  onChange: (newFont: FontDef) => void
}

export function FontCharacterList({
  font,
  selectedCode,
  className,
  onSelect,
  onChange,
}: FontCharacterListProps) {
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

  return (
    <Card className={cn("w-full h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row justify-between items-center flex-shrink-0">
        <CardTitle>Characters</CardTitle>
        <Button size="sm" variant="outline" onClick={handleAdd}>
          Add
        </Button>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {font.characters.map((ch) => (
              <FontCharacterItem
                key={ch.code}
                char={ch}
                font={font}
                isSelected={ch.code === selectedCode}
                onClick={() => handleSelect(ch.code)}
              />
            ))}
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
