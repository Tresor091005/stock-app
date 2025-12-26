import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author:string };
    auth: Auth;
    sidebarOpen: boolean;
    success?: { message: string, id: string };
    error?: { message: string, id: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock_quantity: number;
    image: string | null;
    category_id: number;
    category: Category;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    user: User;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface EmailLog {
    id: number;
    type: string;
    recipient: string;
    subject: string;
    content: string;
    sent_at: string;
    created_at: string;
    updated_at: string;
}
