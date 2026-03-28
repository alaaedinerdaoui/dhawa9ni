
"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from './cart-context';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'اطلب الآن', href: '/commander' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group transition-transform hover:scale-105">
          <span className="text-2xl md:text-3xl font-headline font-bold tracking-tight">
            <span className="text-primary">dhawa9ni</span>
            <span className="text-accent italic">.tn</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12 space-x-reverse">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="hidden lg:flex items-center gap-2 border-primary/20 text-primary">
                <ShieldCheck className="h-4 w-4" />
                لوحة التحكم
              </Button>
            </Link>
            <Link href="/panier">
              <Button variant="ghost" className="relative flex items-center gap-2 px-3 hover:bg-accent/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="font-medium">السلة</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4 space-x-reverse">
          <Link href="/panier" className="relative p-2 flex items-center gap-1">
            <ShoppingBag className="h-6 w-6 text-primary" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "md:hidden absolute top-20 left-0 w-full bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="flex flex-col p-4 space-y-4 text-right">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium p-2 hover:bg-muted rounded-md"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/admin"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg font-medium p-2 text-primary flex items-center gap-2 justify-end"
          >
            لوحة التحكم <ShieldCheck className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
