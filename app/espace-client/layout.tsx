import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientSidebar } from '@/components/client/sidebar'
import { ClientHeader } from '@/components/client/header'

export default async function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Récupérer les infos client
  const { data: client } = await supabase
    .from('clients')
    .select(`
      *,
      zones_livraison (id, nom, jours_livraison, creneau_horaire, frais_livraison, seuil_franco)
    `)
    .eq('email', user.email)
    .single()

  if (!client) {
    redirect('/connexion')
  }

  // Vérifier le statut
  if (client.statut === 'en_attente') {
    redirect('/en-attente')
  }

  if (client.statut === 'refuse' || client.statut === 'suspendu') {
    // Déconnecter et rediriger
    redirect('/connexion?error=account_blocked')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ClientSidebar client={client} />

      {/* Main content */}
      <div className="lg:pl-64">
        <ClientHeader client={client} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
