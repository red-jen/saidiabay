// 'use client';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import React from 'react';

// const navigation = [
//   { name: 'Tableau de bord', href: '/dashboard', icon: '📊' },
//   { name: 'Propriétés', href: '/properties', icon: '🏠' },
//   { name: 'Villes', href: '/cities', icon: '🏙️' },
//   { name: 'Réservations', href: '/reservations', icon: '📅' },
//   { name: 'Leads', href: '/leads', icon: '🎯' },
//   { name: 'Statistiques', href: '/statistics', icon: '📈' },
// ];

// export const Sidebar: React.FC = () => {
//   const pathname = usePathname();

//   return (
//     <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">Immobilier</h1>
//         <p className="text-xs text-gray-400 mt-1">Panneau Admin</p>
//       </div>
      
//       <nav className="mt-6">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center gap-3 px-6 py-3 transition-colors ${
//                 isActive
//                   ? 'bg-blue-600 text-white border-l-4 border-blue-400'
//                   : 'text-gray-300 hover:bg-gray-800 border-l-4 border-transparent'
//               }`}
//             >
//               <span className="text-xl">{item.icon}</span>
//               <span className="font-medium">{item.name}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
//         <div className="text-xs text-gray-500">
//           <p className="font-semibold text-gray-400 mb-1">Plateforme Immobilière</p>
//           <p>v2.0.0</p>
//         </div>
//       </div>
//     </aside>
//   );
// };

'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { logout } from '@/lib/auth/session';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const navItems = [
    {
      // icon: '📊',
      label: 'Tableau de bord',
      href: '/dashboard'
    },
    {
      // icon: '🏠',
      label: 'Propriétés',
      href: '/properties'
    },
    {
      // icon: '📅',
      label: 'Réservations',
      href: '/reservations'
    },
    {
      // icon: '💼',
      label: 'Leads (Ventes)',
      href: '/leads'
    },
    {
      // icon: '📝',
      label: 'Articles de Blog',
      href: '/blogs'
    },
    {
      // icon: '🎨',
      label: 'Images Hero',
      href: '/heroes'
    },
    {
      // icon: '🌍',
      label: 'Villes',
      href: '/cities'
    },
    {
      // icon: '📈',
      label: 'Statistiques',
      href: '/statistics'
    },
    {
      // icon: '👤',
      label: 'Mon Profil',
      href: '/profile'
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            🏠 Admin Panel
          </h1>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'primary' : 'ghost'}
                className="w-full justify-start"
              >
                {/* <span className="mr-3">{item.icon}</span> */}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/" target="_blank">
            <Button variant="ghost" className="w-full justify-start">
              <span className="mr-3">🌐</span>
              Voir le site
            </Button>
          </Link>

          <Button
            onClick={() => logout()}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 mt-2"
          >
            <span className="mr-3">🚪</span>
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}