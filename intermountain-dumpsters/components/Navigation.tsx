'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import CartIcon from "./CartIcon";
import Image from "next/image";

interface NavigationProps {
  currentPage: 'home' | 'book' | 'service-areas' | 'contact' | 'cart';
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home", page: 'home' as const },
    { href: "/book", label: "Book Now", page: 'book' as const },
    { href: "/service-areas", label: "Service Areas", page: 'service-areas' as const },
    { href: "/contact", label: "Contact", page: 'contact' as const },
  ];

  // Determine which logo to use based on theme
  const logoSrc = mounted && theme === 'dark' 
    ? "/WhiteHorizontalLogo.svg" 
    : "/GreenHorizontalLogo.svg";

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-20">
      <div className="w-full max-w-6xl flex justify-between items-center px-5 py-3 text-sm">
        {/* Logo */}
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"} className="text-xl font-bold" onClick={closeMenu}>
            <Image
              src={logoSrc}
              alt="Intermountain Dumpsters Logo"
              width={200}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:underline transition-all duration-200 hover:scale-105 ${
                currentPage === item.page ? 'font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          <CartIcon />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <CartIcon />
          <button
            className="p-2 hover:bg-accent rounded-md transition-all duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu 
                className={`absolute inset-0 transition-all duration-200 ${
                  isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                }`}
              />
              <X 
                className={`absolute inset-0 transition-all duration-200 ${
                  isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ease-out ${
          isMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/95 backdrop-blur-sm"
          onClick={closeMenu}
        />
        
        {/* Menu Content */}
        <div className="relative h-full flex flex-col">
          {/* Header with close button only */}
          <div className="flex justify-end items-center p-4 border-b border-b-foreground/10">
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg py-3 px-4 rounded-lg hover:bg-accent transition-all duration-200 transform ${
                  currentPage === item.page 
                    ? 'bg-accent font-semibold' 
                    : ''
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                  opacity: isMenuOpen ? 1 : 0,
                }}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 