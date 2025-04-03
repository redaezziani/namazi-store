import { Toaster } from '@/components/ui/sonner';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => (
    <div className="flex flex-col flex-1 w-full h-full overflow-hidden" {...props}>
        <Toaster />
        {children}
    </div>
);
