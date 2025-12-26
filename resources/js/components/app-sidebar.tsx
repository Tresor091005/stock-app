import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as categoriesIndex } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import { index as ordersIndex } from '@/routes/orders';
import { index as usersIndex } from '@/routes/users';
import { index as shopIndex } from '@/routes/shop';
import { index as emailLogsIndex } from '@/routes/email-logs';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Store, Mail, ShoppingCart, Users, FolderTree, Package } from 'lucide-react';
import AppLogo from './app-logo';

const baseMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
        adminOnly: true
    },
    {
        title: 'Shop',
        href: shopIndex().url,
        icon: Store
    },
    {
        title: 'Orders',
        href: ordersIndex().url,
        icon: ShoppingCart,
    },
    {
        title: 'Categories',
        href: categoriesIndex().url,
        icon: FolderTree,
        adminOnly: true,
    },
    {
        title: 'Products',
        href: productsIndex().url,
        icon: Package,
        adminOnly: true,
    },
    {
        title: 'Users',
        href: usersIndex().url,
        icon: Users,
        adminOnly: true,
    },
    {
        title: 'Email Logs',
        href: emailLogsIndex().url,
        icon: Mail,
        adminOnly: true,
    }
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const is_admin = auth.user?.role === 'admin';

    const currentMainNavItems = is_admin ? baseMainNavItems : baseMainNavItems.filter(item => !item.adminOnly);

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={currentMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}