'use client';

import { usePathname } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHeroPage = ['/', '/contact', '/about'].includes(pathname);

    return (
        <main className={`min-h-screen ${isHeroPage ? 'pt-0' : 'pt-24 lg:pt-28'}`}>
            {children}
        </main>
    );
}
