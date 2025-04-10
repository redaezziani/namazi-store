import React, { useState } from 'react';
import axios from 'axios';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface BulkDeleteProductsProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    productIds: (string | number)[];
    productCount: number;
    onSuccess: () => void;
}

export default function BulkDeleteProducts({ isOpen, onOpenChange, productIds, productCount, onSuccess }: BulkDeleteProductsProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (productIds.length === 0) return;

        try {
            setIsDeleting(true);
            setError(null);

            // Get the CSRF token from the cookie
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            // Decode the URI component if token exists
            const csrfToken = token ? decodeURIComponent(token) : null;

            await axios.delete('/api/products', {
                data: { ids: productIds },
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Important for sending cookies with the request
            });

            onSuccess();
        } catch (err: any) {
            console.error('Error deleting products:', err);
            if (err.response?.status === 401) {
                setError('You are not authenticated. Please log in and try again.');
            } else {
                setError(err.response?.data?.message || 'Failed to delete products. Please try again.');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {productCount} Product{productCount !== 1 ? 's' : ''}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {productCount} selected product{productCount !== 1 ? 's' : ''}? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className=""
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
