'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FolderTree,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import type { Admin } from '@/types/database'

interface AdminHeaderProps {
  admin: Admin
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Produits', href: '/admin/produits', icon: Package },
  { name: 'Catégories', href: '/admin/categories', icon: FolderTree },
  { name: 'Zones', href: '/admin/zones', icon: MapPin },
]

export function AdminHeader({ admin }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/connexion')
    router.refresh()
  }

  // Trouver le titre de la page actuelle
  const currentPage = navigation.find(
    (item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
  )

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile menu button + titre */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo mobile */}
          <Link href="/admin" className="lg:hidden">
            <Image src="/3.png" alt="BelFrit" width={40} height={40} />
          </Link>

          {/* Titre page */}
          <h1 className="hidden sm:block text-lg font-heading text-gray-900">
            {currentPage?.name || 'Administration'}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Lien vers le site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-500 hover:text-belfrit-red transition-colors"
          >
            Voir le site
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Notifications (placeholder) */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-belfrit-red rounded-full"></span>
          </button>

          {/* Menu utilisateur */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-belfrit-red flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {admin.nom.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {admin.nom.split(' ')[0]}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{admin.nom}</p>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-belfrit-red text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
