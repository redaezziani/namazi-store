import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ShoppingBag, Tag, LayoutGrid, Users, ShoppingCart, Heart, Percent, Ticket, Layers } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/dashboard/products',
        icon: ShoppingBag,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: Layers,
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Customers',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Discounts',
        href: '/discounts',
        icon: Percent,
    },
    {
        title: 'Coupons',
        href: '/coupons',
        icon: Ticket,
    },
    {
        title: 'Favorites',
        href: '/favorites',
        icon: Heart,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Reports',
        href: '/reports',
        icon: Tag,
    },
    {
        title: 'Store Settings',
        href: '/settings',
        icon: ShoppingBag,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
        side="left"
        collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
