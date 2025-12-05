'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { DevBanner } from '@/components/dev-banner'
import Footer from '@/components/footer'

// Routes qui n'affichent pas le header/footer principal
const B2B_ROUTES = [
  '/espace-client',
  '/admin',
  '/connexion',
  '/inscription',
  '/en-attente',
  '/admin-login',
]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Vérifier si on est sur une route B2B
  const isB2BRoute = B2B_ROUTES.some(route => pathname.startsWith(route))

  if (isB2BRoute) {
    // Pages B2B : pas de header/footer vitrine
    return <>{children}</>
  }

  // Pages vitrine : header + footer
  return (
    <>
      <Header />
      <DevBanner />
      <div className="pt-52">
        {children}
      </div>
      <Footer />
    </>
  )
}
