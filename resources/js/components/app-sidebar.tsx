import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Calendar, FileText, GraduationCap } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'لوحة المعلومات',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'الطلاب',
        href: '/students',
        icon: Users,
    },
    {
        title: 'الفصول الدراسية',
        href: '/classrooms',
        icon: GraduationCap,
    },
    {
        title: 'الجدول الدراسي',
        href: '/schedule',
        icon: Calendar,
    },
    {
        title: 'الاختبارات',
        href: '/exams',
        icon: FileText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'المساعدة',
        href: '/help',
        icon: Folder,
    },
    {
        title: 'دليل المستخدم',
        href: '/user-guide',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
        side='right'
        className=' text-right'
        lang='ar'
        collapsible="icon" variant="inset">
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
