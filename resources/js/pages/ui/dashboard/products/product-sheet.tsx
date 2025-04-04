import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { X, Upload, Plus, Trash2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "./color-picker";
import { SizePicker } from "./size-picker";

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  categories: { id: number | string; name: string }[];
}

// Define form validation schema based on your model
const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  quantity: z.coerce.number().int().nonnegative("Quantity must be 0 or higher"),
  category_id: z.string().min(1, "Please select a category"),
  type: z.string().min(1, "Please enter a product type"),
  cover_image: z.string().min(1, "Cover image is required"),
  preview_images: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof formSchema>;

export function ProductSheet({ isOpen, onOpenChange, onSuccess, categories }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      category_id: "",
      type: "",
      cover_image: "",
      preview_images: [],
      colors: [],
      sizes: [],
      is_featured: false,
      is_active: true,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    try {
      setIsSubmitting(true);
      await axios.post("/api/products", values);
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        // Map backend validation errors to form fields
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            form.setError(key as any, {
              type: "backend",
              message: value[0] as string,
            });
          }
        });
      } else {
        console.error("Error creating product:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle image upload (in a real app, this would upload to your server or cloud storage)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "cover_image" | "preview_images") => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real application, you'd upload the file and get back a URL
      // For this example, we'll use a placeholder URL
      if (field === "cover_image") {
        form.setValue("cover_image", URL.createObjectURL(e.target.files[0]));
      } else {
        const currentImages = form.getValues("preview_images") || [];
        const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
        form.setValue("preview_images", [...currentImages, ...newImages]);
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-6 md:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Fill out the form below to add a new product to your inventory.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <Separator />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Shoes, Shirt, Jewelry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Colors & Sizes Section */}
                <div className="space-y-4 md:col-span-2 pt-4">
                  <h3 className="text-lg font-medium">Variants</h3>
                  <Separator />
                </div>

                {/* Replace the old colors input with our new ColorPicker */}
                <div className="md:col-span-2">
                  <ColorPicker />
                </div>

                {/* Replace the old sizes field with our new SizePicker */}
                <div className="md:col-span-2">
                  <SizePicker />
                </div>

                {/* Images Section */}
                <div className="space-y-4 md:col-span-2 pt-4">
                  <h3 className="text-lg font-medium">Product Images</h3>
                  <Separator />
                </div>

                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          {field.value && (
                            <div className="relative w-full h-64 bg-muted rounded-md overflow-hidden">
                              <img
                                src={field.value}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => form.setValue("cover_image", "")}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          )}
                          {!field.value && (
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG or WebP (MAX. 2MB)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, "cover_image")}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preview_images"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Preview Images (Optional)</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {field.value?.map((image, index) => (
                              <div key={index} className="relative bg-muted rounded-md overflow-hidden aspect-square">
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={() => {
                                    const newImages = [...field.value || []];
                                    newImages.splice(index, 1);
                                    form.setValue("preview_images", newImages);
                                  }}
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                              <div className="flex flex-col items-center justify-center py-2 px-1">
                                <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                                <p className="text-xs text-center text-muted-foreground">Add Image</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "preview_images")}
                                multiple
                              />
                            </label>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add up to 6 additional preview images
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status Section */}
                <div className="space-y-4 md:col-span-2 pt-4">
                  <h3 className="text-lg font-medium">Product Status</h3>
                  <Separator />
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Make this product visible to customers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Product</FormLabel>
                        <FormDescription>
                          Display this product in featured sections
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
