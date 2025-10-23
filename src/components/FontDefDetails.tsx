"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { type FontDef } from "@/types/font"

interface FontDefDetailsProps {
  font: FontDef
}

export function FontDefDetails({ font }: FontDefDetailsProps) {
  const { name, width, height, firstChar, lastChar, characters } = font

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Font Definition</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <Label className="text-gray-500">Name</Label>
            <div className="font-mono">{name}</div>
          </div>

          <div>
            <Label className="text-gray-500">Width</Label>
            <div>{width}</div>
          </div>

          <div>
            <Label className="text-gray-500">Height</Label>
            <div>{height}</div>
          </div>

          <div>
            <Label className="text-gray-500">First Char</Label>
            <div>
              {firstChar} ({String.fromCharCode(firstChar)})
            </div>
          </div>

          <div>
            <Label className="text-gray-500">Last Char</Label>
            <div>
              {lastChar} ({String.fromCharCode(lastChar)})
            </div>
          </div>

          <div>
            <Label className="text-gray-500">Characters</Label>
            <div>{characters.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
