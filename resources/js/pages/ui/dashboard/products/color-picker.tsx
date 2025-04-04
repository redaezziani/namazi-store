'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormLabel, FormItem } from '@/components/ui/form'

// Predefined color palette
const COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#008080', // Teal
  '#FF6347', // Tomato
  '#4B0082', // Indigo
  '#7CFC00', // Lawn Green
  '#808080', // Gray
  '#A52A2A', // Brown
]

interface ColorPickerProps {
  // If you need to pass additional props
}

export function ColorPicker({}: ColorPickerProps) {
  const { setValue, getValues, watch } = useFormContext()
  const [customColor, setCustomColor] = useState('#000000')

  // Watch for changes to colors array in the form
  const formColors = watch('colors') || []

  // Validate if a hex color is valid
  const isValidHexColor = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  }

  // Add color to form
  const addColor = (color: string) => {
    const currentColors = getValues('colors') || []
    if (isValidHexColor(color) && !currentColors.includes(color.toUpperCase())) {
      setValue('colors', [...currentColors, color.toUpperCase()])
    }
  }

  // Remove color from form
  const removeColor = (color: string) => {
    const currentColors = getValues('colors') || []
    setValue('colors', currentColors.filter((c) => c !== color))
  }

  return (
    <FormItem className="space-y-4">
      <FormLabel>Color Picker</FormLabel>
      <div className="space-y-4">
        {/* Selected Colors */}
        <div className="flex flex-wrap gap-2">
          {formColors.map((color: string) => (
            <div
              key={color}
              className="flex items-center gap-2 border rounded-md p-1 pr-2"
            >
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono">{color}</span>
              <button
                type="button"
                onClick={() => removeColor(color)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Color Palette */}
        <div className="grid grid-cols-8 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                'w-8 h-8 rounded-md border flex items-center justify-center',
                color === '#FFFFFF' && 'border-gray-200'
              )}
              style={{ backgroundColor: color }}
              onClick={() => addColor(color)}
              aria-label={`Select color ${color}`}
            >
              {formColors.includes(color) && (
                <Check
                  size={16}
                  className={
                    color === '#FFFFFF' || color === '#FFFF00' || color === '#00FF00'
                      ? 'text-black'
                      : 'text-white'
                  }
                />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="flex gap-2 items-center">
          <div
            className="w-8 h-8 rounded-md border"
            style={{ backgroundColor: customColor }}
          />
          <Input
            type="text"
            placeholder="#RRGGBB"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="font-mono"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            maxLength={7}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (isValidHexColor(customColor)) {
                addColor(customColor)
              }
            }}
            disabled={!isValidHexColor(customColor)}
          >
            Add Custom
          </Button>
        </div>

        {/* Color Input Tips */}
        <p className="text-xs text-muted-foreground">
          Use hex format (#RRGGBB) for custom colors. Click on a color to add it to the product.
        </p>
      </div>
    </FormItem>
  )
}
