'use client'

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SketchPicker } from 'react-color';

export function ColorPicker() {
  const form = useFormContext();
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>('#000000');

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: any) => {
    setCurrentColor(color.hex);
  };

  const handleAddColor = () => {
    const currentColors = form.getValues('colors') || [];
    if (currentColor && !currentColors.includes(currentColor)) {
      form.setValue('colors', [...currentColors, currentColor]);
      setCurrentColor('#000000');
      setDisplayColorPicker(false);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    const currentColors = form.getValues('colors') || [];
    form.setValue(
      'colors',
      currentColors.filter(color => color !== colorToRemove)
    );
  };

  return (
    <FormField
      control={form.control}
      name="colors"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Available Colors</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(field.value || []).map((color: string, index: number) => (
                  <div key={index} className="relative flex items-center">
                    <div
                      className="h-8 w-8 rounded-md border"
                      style={{ backgroundColor: color }}
                    ></div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 absolute -top-2 -right-2"
                      onClick={() => handleRemoveColor(color)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>
                ))}
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleClick}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {displayColorPicker && (
                    <div className="absolute z-10">
                      <div className="fixed inset-0" onClick={handleClose} />
                      <div className="relative">
                        <SketchPicker
                          color={currentColor}
                          onChange={handleChange}
                        />
                        <Button
                          type="button"
                          className="mt-2 w-full"
                          onClick={handleAddColor}
                        >
                          Add Color
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
