"use client"

import { useState, useEffect, useRef } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { type FontDef } from "@/types/font"
import { parseCFont, toCFont } from "@/lib/fontParser"
import { FontCodeHelpModal } from "./FontCodeHelpModal"
import { HelpCircle } from "lucide-react"
import { Button } from "./ui/button"

interface FontCodeEditorProps {
    value: FontDef
    onChange: (newFont: FontDef) => void
    debounceMs?: number // default 100ms
}

/**
 * FontCodeEditor
 * - Smooth bidirectional sync between text and FontDef.
 * - Dynamically grows/shrinks within flex containers.
 */
export function FontCodeEditor({
    value,
    onChange,
    debounceMs = 100,
}: FontCodeEditorProps) {
    const [code, setCode] = useState<string>(toCFont(value))
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleTextChange = (newCode: string) => {
        setCode(newCode)
        setIsEditing(true)

        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            try {
                const parsed = parseCFont(newCode)
                if (parsed) {
                    onChange(parsed)
                    setError(null)
                } else {
                    setError("Parsing failed: could not interpret C font structure.")
                }
            } catch (e: any) {
                console.error(e)
                setError(e.message || "Parsing failed.")
            }
        }, debounceMs)
    }

    // Only update from parent when not editing and code differs
    useEffect(() => {
        const generated = toCFont(value)
        if (!isEditing && generated !== code) {
            setCode(generated)
        }
    }, [value])

    // Reset isEditing after short idle
    useEffect(() => {
        if (!isEditing) return
        const id = setTimeout(() => setIsEditing(false), 2 * debounceMs)
        return () => clearTimeout(id)
    }, [isEditing, code, debounceMs])

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Font C Code</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHelp(true)}
                    className="flex items-center gap-1"
                >
                    <HelpCircle className="w-4 h-4" /> Example code
                </Button>
            </CardHeader>

            {/* 👇 Makes the editor expand */}
            <CardContent className="flex-1 min-h-0 flex flex-col">
                <div className="space-y-2 flex-1 flex flex-col min-h-0">
                    <Label htmlFor="font-code">Font definition (C code)</Label>
                    <Textarea
                        id="font-code"
                        value={code}
                        onChange={(e) => handleTextChange(e.target.value)}
                        className="flex-1 min-h-0 font-mono text-sm resize-none overflow-auto"
                    />
                </div>
                <FontCodeHelpModal open={showHelp} onOpenChange={setShowHelp} />
            </CardContent>

            {error && (
                <CardFooter className="bg-red-100 text-red-700 font-mono text-xs py-2 px-4 border-t border-red-300">
                    {error}
                </CardFooter>
            )}
        </Card>
    )
}
