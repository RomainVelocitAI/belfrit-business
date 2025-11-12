'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/3.png"
              alt="BelFrit Business"
              width={120}
              height={120}
              className="h-24 w-24"
              priority
            />
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-red font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/catalogue"
              className="text-gray-700 hover:text-primary-red font-medium transition-colors"
            >
              Catalogue
            </Link>
            <Link
              href="/qui-sommes-nous"
              className="text-gray-700 hover:text-primary-red font-medium transition-colors"
            >
              Qui sommes-nous
            </Link>
            <Link
              href="/#contact"
              className="px-6 py-2 bg-primary-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Devenir partenaire
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-red"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-red font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/catalogue"
                className="text-gray-700 hover:text-primary-red font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catalogue
              </Link>
              <Link
                href="/qui-sommes-nous"
                className="text-gray-700 hover:text-primary-red font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Qui sommes-nous
              </Link>
              <Link
                href="/#contact"
                className="px-6 py-2 bg-primary-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Devenir partenaire
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
