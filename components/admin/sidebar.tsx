'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FolderTree,
  MapPin,
  Settings,
} from 'lucide-react'
import type { Admin } from '@/types/database'

interface AdminSidebarProps {
  admin: Admin
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Produits', href: '/admin/produits', icon: Package },
  { name: 'Catégories', href: '/admin/categories', icon: FolderTree },
  { name: 'Zones de livraison', href: '/admin/zones', icon: MapPin },
]

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-belfrit-black">
          {/* Logo */}
          <div className="flex h-20 items-center justify-center border-b border-gray-800">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/3.png"
                alt="BelFrit"
                width={50}
                height={50}
                className="rounded"
              />
              <div>
                <span className="text-white font-heading text-lg">BelFrit</span>
                <span className="block text-belfrit-yellow text-xs font-medium">Back-office</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-belfrit-red text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Infos admin */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-belfrit-red flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {admin.nom.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{admin.nom}</p>
                <p className="text-gray-400 text-xs capitalize">{admin.role}</p>
              </div>
              <Link
                href="/admin/parametres"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
