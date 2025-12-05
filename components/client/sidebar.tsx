'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ShoppingBag,
  Package,
  FileText,
  User,
  ShoppingCart,
  Percent,
} from 'lucide-react'
import type { Client, ZoneLivraison } from '@/types/database'

interface ClientSidebarProps {
  client: Client & { zones_livraison?: ZoneLivraison | null }
}

const navigation = [
  { name: 'Catalogue', href: '/espace-client', icon: Package },
  { name: 'Mon panier', href: '/espace-client/panier', icon: ShoppingCart },
  { name: 'Mes commandes', href: '/espace-client/commandes', icon: FileText },
  { name: 'Mon profil', href: '/espace-client/profil', icon: User },
]

export function ClientSidebar({ client }: ClientSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-4 border-b border-gray-200">
            <Link href="/espace-client">
              <Image
                src="/3.png"
                alt="BelFrit Business"
                width={60}
                height={60}
              />
            </Link>
          </div>

          {/* Client info */}
          <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
            <p className="font-medium text-gray-900 truncate">{client.raison_sociale}</p>
            <p className="text-sm text-gray-500 truncate">{client.email}</p>
            {client.pourcentage_remise > 0 && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                <Percent className="w-3 h-3" />
                Remise {client.pourcentage_remise}%
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/espace-client' && pathname.startsWith(item.href))
              const isExactCatalogue = item.href === '/espace-client' && pathname === '/espace-client'

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive || isExactCatalogue
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

          {/* Zone info */}
          {client.zones_livraison && (
            <div className="px-4 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Zone de livraison</p>
              <p className="text-sm font-medium text-gray-900">{client.zones_livraison.nom}</p>
              {client.zones_livraison.jours_livraison && (
                <p className="text-xs text-gray-500 mt-1">
                  {client.zones_livraison.jours_livraison.join(', ')}
                </p>
              )}
              {client.zones_livraison.seuil_franco && client.zones_livraison.seuil_franco > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Franco à partir de {client.zones_livraison.seuil_franco}€
                </p>
              )}
            </div>
          )}

          {/* Retour site */}
          <div className="px-4 py-4 border-t border-gray-200">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-belfrit-red transition-colors"
            >
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile navigation will be in header */}
    </>
  )
}
