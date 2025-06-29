'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Truck, ClipboardList } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminSidebarProps {
  user?: User | null;
}

const navItems = [
  {
    label: 'Manage Admin',
    href: '/admin',
    icon: <Settings className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Dumpsters',
    href: '/admin/dumpsters',
    icon: <Truck className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Rentals',
    href: '/admin/rentals',
    icon: <ClipboardList className="h-5 w-5 mr-2" />,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <aside className="w-56 min-h-full bg-white border-r flex flex-col py-8 px-4 shadow-sm">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors text-base
                ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 