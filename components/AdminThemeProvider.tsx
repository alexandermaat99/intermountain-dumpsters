'use client';

import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminThemeProviderProps {
  children: React.ReactNode;
}

export default function AdminThemeProvider({ children }: AdminThemeProviderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Check if current page is an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force light mode for admin pages
  useEffect(() => {
    if (mounted && isAdminPage) {
      // Remove any existing theme classes
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [mounted, isAdminPage, pathname]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={isAdminPage ? "light" : "system"}
      enableSystem={!isAdminPage}
      disableTransitionOnChange
      forcedTheme={isAdminPage ? "light" : undefined}
    >
      {children}
    </ThemeProvider>
  );
} 