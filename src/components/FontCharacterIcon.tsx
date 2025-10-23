"use client"

import React from "react"
import { type CharacterDef } from "@/types/font"

interface FontCharacterIconProps {
  char: CharacterDef
  width: number
  height: number
  pixelSize?: number
}

/**
 * Displays a bitmap of one character.
 * - bits in each byte represent vertical pixels (LSB = top row)
 */
export function FontCharacterIcon({
  char,
  width,
  height,
  pixelSize = 10,
}: FontCharacterIconProps) {
  const { bytes } = char

  return (
    <div
      className="relative border border-gray-300"
      style={{
        width: width * pixelSize,
        height: height * pixelSize,
        backgroundColor: "white",
        display: "grid",
        gridTemplateColumns: `repeat(${width}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${height}, ${pixelSize}px)`,
      }}
    >
      {Array.from({ length: height }).map((_, row) =>
        Array.from({ length: width }).map((_, col) => {
          const bitOn = (bytes[col] >> row) & 1
          return (
            <div
              key={`${row}-${col}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: bitOn ? "black" : "white",
                boxSizing: "border-box",
                border: "1px solid #eee",
              }}
            />
          )
        })
      )}
    </div>
  )
}
