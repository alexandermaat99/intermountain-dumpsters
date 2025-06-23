'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartContext } from '@/lib/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CartIconProps {
  className?: string;
  showCount?: boolean;
}

export default function CartIcon({ className = '', showCount = true }: CartIconProps) {
  const { cart } = useCartContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className={`relative ${className}`}>
        <ShoppingCart className="h-5 w-5" />
        {isMounted && showCount && cart.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {cart.itemCount > 99 ? '99+' : cart.itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
} 