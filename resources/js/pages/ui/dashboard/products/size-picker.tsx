'use client'

import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormLabel, FormItem } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'

// Predefined size groups
const SIZES = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
  shoes: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
  kids: ['2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14'],
  dimensions: ['One Size', 'Universal', 'Standard']
}

interface SizePickerProps {
  // Optional props if needed
}

export function SizePicker({}: SizePickerProps) {
  const { setValue, getValues, watch } = useFormContext()
  const [customSize, setCustomSize] = useState('')
  const [activeTab, setActiveTab] = useState<keyof typeof SIZES>('clothing')

  // Watch for changes to sizes array in the form
  const formSizes = watch('sizes') || []

  // Add size to form
  const addSize = (size: string) => {
    const currentSizes = getValues('sizes') || []
    if (size.trim() && !currentSizes.includes(size.trim())) {
      setValue('sizes', [...currentSizes, size.trim()])
    }
  }

  // Remove size from form
  const removeSize = (size: string) => {
    const currentSizes = getValues('sizes') || []
    setValue('sizes', currentSizes.filter(s => s !== size))
  }

  const handleAddCustomSize = () => {
    if (customSize.trim()) {
      addSize(customSize)
      setCustomSize('')
    }
  }

  return (
    <FormItem className="space-y-4">
      <FormLabel>Available Sizes</FormLabel>
      <div className="space-y-4">
        {/* Selected Sizes */}
        <div className="flex flex-wrap gap-2">
          {formSizes.map((size: string) => (
            <Badge key={size} variant="outline" className="px-3 py-0.5 h-7">
              {size}
              <button
                type="button"
                onClick={() => removeSize(size)}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>

        {/* Size Category Tabs */}
        <div className="flex border-b">
          {Object.keys(SIZES).map(key => (
            <button
              key={key}
              type="button"

              onClick={() => setActiveTab(key as keyof typeof SIZES)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                activeTab === key
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Size Grid for current category */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {SIZES[activeTab].map((size) => (
            <Button
              key={size}
              type="button"
              variant="outline"
              className={cn(
                "w-full h-8 px-1 text-sm shadow-none rounded-full font-medium",
                formSizes.includes(size) && "bg-primary text-primary-foreground"
              )}
              onClick={() => addSize(size)}
              aria-pressed={formSizes.includes(size)}
              aria-label={`Select size ${size}`}
            >
              {formSizes.includes(size) ? (
                <span className="flex items-center">
                  {size}
                  <Check size={14} className="ml-1" />
                </span>
              ) : (
                size
              )}
            </Button>
          ))}
        </div>

        {/* Custom Size Input */}
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Custom size (e.g. 42, XXL)"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCustomSize()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCustomSize}
            disabled={!customSize.trim()}
          >
            Add Custom
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Select from common sizes or add your own custom sizes.
        </p>
      </div>
    </FormItem>
  )
}
