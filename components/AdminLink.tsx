'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Settings } from 'lucide-react';

export default function AdminLink() {
  const { user, loading } = useAuth();

  // Don't show anything while loading or if no user
  if (loading || !user) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors hover:underline hover:scale-105"
    >
      <Settings className="h-4 w-4" />
      Admin
    </Link>
  );
} 