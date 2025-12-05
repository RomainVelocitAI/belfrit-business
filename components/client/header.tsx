'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Menu,
  X,
  LogOut,
  ShoppingCart,
  Package,
  FileText,
  User,
  Percent,
} from 'lucide-react'
import type { Client, ZoneLivraison } from '@/types/database'

interface ClientHeaderProps {
  client: Client & { zones_livraison?: ZoneLivraison | null }
}

const navigation = [
  { name: 'Catalogue', href: '/espace-client', icon: Package },
  { name: 'Mon panier', href: '/espace-client/panier', icon: ShoppingCart },
  { name: 'Mes commandes', href: '/espace-client/commandes', icon: FileText },
  { name: 'Mon profil', href: '/espace-client/profil', icon: User },
]

const CART_KEY = 'belfrit_cart'

export function ClientHeader({ client }: ClientHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Charger le compteur de panier
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem(CART_KEY)
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        const count = cart.reduce((sum: number, item: any) => sum + item.quantite, 0)
        setCartCount(count)
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()

    // Écouter les mises à jour du panier
    window.addEventListener('cart-updated', updateCartCount)
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('cart-updated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo mobile */}
          <Link href="/espace-client" className="lg:hidden">
            <Image
              src="/3.png"
              alt="BelFrit"
              width={40}
              height={40}
            />
          </Link>

          {/* Titre page (desktop) */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-medium text-gray-900">
              Bienvenue, {client.raison_sociale}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Remise badge */}
            {client.pourcentage_remise > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                <Percent className="w-3 h-3" />
                -{client.pourcentage_remise}%
              </div>
            )}

            {/* Panier */}
            <Link
              href="/espace-client/panier"
              className="p-2 text-gray-500 hover:text-belfrit-red transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-belfrit-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-belfrit-red transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <Image
                src="/3.png"
                alt="BelFrit"
                width={40}
                height={40}
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Client info */}
            <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
              <p className="font-medium text-gray-900 truncate">{client.raison_sociale}</p>
              <p className="text-sm text-gray-500 truncate">{client.email}</p>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/espace-client' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-belfrit-red text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-belfrit-red transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
