"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FontCodeHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FontCodeHelpModal({ open, onOpenChange }: FontCodeHelpModalProps) {
  const usageExample = `#include "FontDef.h"
#include <stdint.h>

// drawPixel() must be implemented for your display
void drawPixel(int x, int y, uint16_t color);

void drawChar(const FontDef* font, int x, int y, char c)
{
    if (!font) return;
    if (c < font->firstChar || c > font->lastChar) return;

    const uint8_t* glyph = font->table + (c - font->firstChar) * font->width;

    for (int col = 0; col < font->width; ++col)
    {
        uint8_t bits = glyph[col];
        for (int row = 0; row < font->height; ++row)
        {
            if (bits & (1 << row))
                drawPixel(x + col, y + row, 1);
        }
    }
}

void drawText(const FontDef* font, int x, int y, const char* str)
{
    if (!font || !str) return;
    int cursorX = x;
    while (*str)
    {
        drawChar(font, cursorX, y, *str++);
        cursorX += font->width + 1;
    }
}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ this overrides shadcn’s internal sizing */}
      <DialogContent
        className="!max-w-none !w-[90vw] sm:!w-[85vw] lg:!w-[80vw] xl:!w-[70vw] !p-0"
        style={{
          // Fallback CSS for edge cases
          maxWidth: "90vw",
          width: "90vw",
        }}
      >
        <DialogHeader className="px-6 pt-4 pb-2">
          <DialogTitle>Example Usage</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto whitespace-pre h-[70vh]">
            {usageExample}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}
