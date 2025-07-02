'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Truck, ClipboardList, Menu, X, MapPin, LogOut, MessageSquare } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  user?: User | null;
}

const navItems = [
  {
    label: 'Rentals',
    href: '/admin/rentals',
    icon: <ClipboardList className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Contact Messages',
    href: '/admin/contact-messages',
    icon: <MessageSquare className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Manage Admin',
    href: '/admin/dash',
    icon: <Settings className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Service Areas',
    href: '/admin/service-areas',
    icon: <MapPin className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Dumpster Types',
    href: '/admin/dumpster-types',
    icon: <ClipboardList className="h-5 w-5 mr-2" />,
  },
  {
    label: 'Dumpsters',
    href: '/admin/dumpsters',
    icon: <Truck className="h-5 w-5 mr-2" />,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { signOut } = useAuth();

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  // Hamburger for mobile
  const Hamburger = (
    <button
      className="md:hidden p-2 m-2 rounded hover:bg-gray-100 focus:outline-none"
      onClick={() => setDrawerOpen(true)}
      aria-label="Open admin menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  );

  // Drawer for mobile
  const Drawer = (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${drawerOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />
      {/* Drawer content */}
      <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold">Admin Menu</span>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors text-base
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'}`}
                onClick={() => setDrawerOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* Sign out button at bottom */}
        <div className="mt-auto pt-4 border-t">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </div>
  );

  // Sidebar for desktop
  const DesktopSidebar = (
    <aside className="hidden md:flex w-56 min-h-full bg-white border-r flex-col py-8 px-4 shadow-sm">
      <nav className="flex flex-col gap-2 flex-1">
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
      {/* Sign out button at bottom */}
      <div className="mt-auto pt-4 border-t">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      {Hamburger}
      {/* Drawer for mobile */}
      {Drawer}
      {/* Sidebar for desktop */}
      {DesktopSidebar}
    </>
  );
} 