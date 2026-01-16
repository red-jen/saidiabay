'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = AUTH_ROUTES.some(route => pathname?.startsWith(route));

    return (
        <>
            {!isAuthPage && <Header />}
            <main className="min-h-screen">{children}</main>
            {!isAuthPage && <Footer />}
        </>
    );
}
