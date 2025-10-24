"use client"

import { cn } from "@/lib/utils"
import { FontCharacterIcon } from "@/components/FontCharacterIcon"
import { type FontDef } from "@/types/font"

interface FontCharacterItemProps {
  char: { code: number; bytes: number[] }
  font: FontDef
  isSelected: boolean
  onClick: () => void
  maxPixelSize?: number // Optional if you want to tune the visual size
}

/**
 * Displays one selectable character item with consistent dimensions.
 */
export function FontCharacterItem({
  char,
  font,
  isSelected,
  onClick,
  maxPixelSize = 8,
}: FontCharacterItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-md cursor-pointer transition select-none min-w-[50px] min-h-[50px]",
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
      )}
      style={{
        width: `${font.width * maxPixelSize + 10}px`,
        height: `${font.height * maxPixelSize + 30}px`,
      }}
    >
      <FontCharacterIcon
        char={char}
        width={font.width}
        height={font.height}
        pixelSize={maxPixelSize}
      />
      <div className="text-xs text-gray-600 mt-1">
        {char.code} ({String.fromCharCode(char.code)})
      </div>
    </div>
  )
}
