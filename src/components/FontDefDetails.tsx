"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { type FontDef } from "@/types/font"

interface FontDefDetailsProps {
  font: FontDef
  onChange: (newFont: FontDef) => void
}

export function FontDefDetails({ font, onChange }: FontDefDetailsProps) {
  const handleTextChange = (key: "name") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    if (value.length === 0) return
    onChange({
      ...font,
      name: value,
    })
  }

  const handleNumberChange =
    (key: "width" | "height" | "firstChar") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (isNaN(value) || value <= 0) return

      let updated = { ...font }

      if (key === "width") {
        // Adjust column count
        updated = {
          ...font,
          width: value,
          characters: font.characters.map((ch) => {
            const newBytes = [...ch.bytes]
            if (value > newBytes.length) {
              newBytes.push(...new Array(value - newBytes.length).fill(0))
            } else if (value < newBytes.length) {
              newBytes.length = value
            }
            return { ...ch, bytes: newBytes }
          }),
        }
      } else if (key === "height") {
        updated = { ...font, height: value }
      } else if (key === "firstChar") {
        // Shift all char codes and recalc lastChar
        const delta = value - font.firstChar
        updated = {
          ...font,
          firstChar: value,
          lastChar: value + font.characters.length - 1,
          characters: font.characters.map((ch) => ({
            ...ch,
            code: ch.code + delta,
          })),
        }
      }

      onChange(updated)
    }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Font Definition</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label>Font Name</Label>
          <Input
            type="text"
            value={font.name}
            onChange={handleTextChange("name")}
            placeholder="Font5x7"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>Array Name</Label>
          <Input
            type="text"
            value={`${font.name}_charset`}
            readOnly
            className="bg-muted text-muted-foreground"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>Width</Label>
          <Input
            type="number"
            value={font.width}
            onChange={handleNumberChange("width")}
            min={1}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>Height</Label>
          <Input
            type="number"
            value={font.height}
            onChange={handleNumberChange("height")}
            min={1}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>First Char</Label>
          <Input
            type="number"
            value={font.firstChar}
            onChange={handleNumberChange("firstChar")}
            min={0}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>Last Char</Label>
          <Input type="number" value={font.lastChar} readOnly />
        </div>
      </CardContent>
    </Card>
  )
}
