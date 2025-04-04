import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ColorPicker } from './color-picker';
import { SizePicker } from './size-picker';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFormProps {
    isOpen?: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    categories: { id: number | string; name: string }[];
}

// Define form validation schema based on your model
const formSchema = z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().positive('Price must be positive'),
    quantity: z.coerce.number().int().nonnegative('Quantity must be 0 or higher'),
    category_id: z.string().min(1, 'Please select a category'),
    type: z.string().min(1, 'Please enter a product type'),
    cover_image: z.string().min(1, 'Cover image is required'),
    preview_images: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    is_featured: z.boolean().default(false),
    is_active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof formSchema>;

function BasicInfoSection({ form }: { form: any }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <Separator />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter product description" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

function PricingSection({ form }: { form: any }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing</h3>
            <Separator />
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
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
                            <Input type="number" min="0" step="1" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

function CategorySection({ form, categories }: { form: any; categories: { id: number | string; name: string }[] }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Category</h3>
            <Separator />
            <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

function ProductTypeSection({ form }: { form: any }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Type</h3>
            <Separator />
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
        </div>
    );
}

function VariantsSection({ form }: { form: any }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Variants</h3>
            <Separator />
            <div className="space-y-4">
                <ColorPicker />
                <SizePicker />
            </div>
        </div>
    );
}

function ImagesSection({ form, handleImageUpload }: { form: any; handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: 'cover_image' | 'preview_images') => void }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Images</h3>
            <Separator />
            <FormField
                control={form.control}
                name="cover_image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                            <div className="flex flex-col gap-4">
                                {field.value && (
                                    <div className="bg-muted relative h-64 w-full overflow-hidden rounded-md">
                                        <img src={field.value} alt="Cover preview" className="h-full w-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => form.setValue('cover_image', '')}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                )}
                                {!field.value && (
                                    <div className="flex w-full items-center justify-center">
                                        <label className="bg-muted/50 hover:bg-muted flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="text-muted-foreground mb-4 h-8 w-8" />
                                                <p className="text-muted-foreground mb-2 text-sm">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-muted-foreground text-xs">PNG, JPG or WebP (MAX. 2MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'cover_image')}
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
                    <FormItem>
                        <FormLabel>Preview Images (Optional)</FormLabel>
                        <FormControl>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {field.value?.map((image, index) => (
                                        <div key={index} className="bg-muted relative aspect-square overflow-hidden rounded-md">
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() => {
                                                    const newImages = [...(field.value || [])];
                                                    newImages.splice(index, 1);
                                                    form.setValue('preview_images', newImages);
                                                }}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    <label className="bg-muted/50 hover:bg-muted flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                        <div className="flex flex-col items-center justify-center px-1 py-2">
                                            <Plus className="text-muted-foreground mb-2 h-8 w-8" />
                                            <p className="text-muted-foreground text-center text-xs">Add Image</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'preview_images')}
                                            multiple
                                        />
                                    </label>
                                </div>
                            </div>
                        </FormControl>
                        <FormDescription>Add up to 6 additional preview images</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

function ProductStatusSection({ form }: { form: any }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Status</h3>
            <Separator />
            <div className="flex gap-x-2">

            <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                    <FormItem className=" flex justify-start items-center gap-2">
                        <FormControl>
                            <Checkbox
                                
                                className="h-4 w-4 accent-primary"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target)}
                            />
                        </FormControl>
                        <FormLabel className="text-base">Active Status</FormLabel>
                        
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                    <FormItem className=" flex justify-start items-center gap-2">
                        <FormControl>
                            <Checkbox
                                className="h-4 w-4 accent-primary"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target)}
                            />
                        </FormControl>
                        <FormLabel className="text-base">Featured Product</FormLabel>
                        
                    </FormItem>
                )}
            />
            </div>

        </div>
    );
}

export function ProductSheet({ isOpen = false, onOpenChange, onSuccess, categories }: ProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            quantity: 0,
            category_id: '',
            type: '',
            cover_image: '',
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
            await axios.post('/api/products', values);
            form.reset();
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                        form.setError(key as any, {
                            type: 'backend',
                            message: value[0] as string,
                        });
                    }
                });
            } else {
                console.error('Error creating product:', error);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover_image' | 'preview_images') => {
        if (e.target.files && e.target.files.length > 0) {
            if (field === 'cover_image') {
                form.setValue('cover_image', URL.createObjectURL(e.target.files[0]));
            } else {
                const currentImages = form.getValues('preview_images') || [];
                const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
                form.setValue('preview_images', [...currentImages, ...newImages]);
            }
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="w-full sm:w-auto">Add Product</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full overflow-y-auto p-6 sm:max-w-xl md:max-w-2xl">
                <SheetHeader>
                    <SheetTitle>Add New Product</SheetTitle>
                    <SheetDescription>Fill out the form below to add a new product.</SheetDescription>
                </SheetHeader>

                <FormProvider {...form}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
                            <BasicInfoSection form={form} />
                            <PricingSection form={form} />
                            <CategorySection form={form} categories={categories} />
                            <ProductTypeSection form={form} />
                            <VariantsSection form={form} />
                            <ImagesSection form={form} handleImageUpload={handleImageUpload} />
                            <ProductStatusSection form={form} />
                            <SheetFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                                    {isSubmitting ? 'Creating...' : 'Create Product'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </FormProvider>
            </SheetContent>
        </Sheet>
    );
}
