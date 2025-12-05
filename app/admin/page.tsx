import { createClient } from '@/lib/supabase/server'
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Récupérer les statistiques
  const [
    { count: totalClients },
    { count: clientsEnAttente },
    { count: totalProduits },
    { count: totalCommandes },
    { count: commandesEnAttente },
    { count: commandesEnPreparation },
    { data: dernieresCommandes },
    { data: derniersClients },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('statut', 'actif'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
    supabase.from('produits').select('*', { count: 'exact', head: true }).neq('disponibilite', 'masque'),
    supabase.from('commandes').select('*', { count: 'exact', head: true }),
    supabase.from('commandes').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
    supabase.from('commandes').select('*', { count: 'exact', head: true }).eq('statut', 'en_preparation'),
    supabase
      .from('commandes')
      .select('*, clients(raison_sociale)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('clients')
      .select('*')
      .eq('statut', 'en_attente')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      name: 'Clients actifs',
      value: totalClients || 0,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/clients',
    },
    {
      name: 'Produits',
      value: totalProduits || 0,
      icon: Package,
      color: 'bg-green-500',
      href: '/admin/produits',
    },
    {
      name: 'Commandes totales',
      value: totalCommandes || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      href: '/admin/commandes',
    },
    {
      name: 'À valider',
      value: (clientsEnAttente || 0) + (commandesEnAttente || 0),
      icon: AlertCircle,
      color: 'bg-belfrit-red',
      href: '/admin/clients?statut=en_attente',
    },
  ]

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        )
      case 'en_preparation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Package className="w-3 h-3" />
            En préparation
          </span>
        )
      case 'en_livraison':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Truck className="w-3 h-3" />
            En livraison
          </span>
        )
      case 'livre':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Livré
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {statut}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-heading text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières commandes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-heading text-lg text-gray-900">Dernières commandes</h2>
            <Link
              href="/admin/commandes"
              className="text-sm text-belfrit-red hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {dernieresCommandes && dernieresCommandes.length > 0 ? (
              dernieresCommandes.map((commande: any) => (
                <Link
                  key={commande.id}
                  href={`/admin/commandes/${commande.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{commande.numero}</p>
                    <p className="text-sm text-gray-500">
                      {commande.clients?.raison_sociale || 'Client inconnu'}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatutBadge(commande.statut)}
                    <p className="text-sm text-gray-500 mt-1">
                      {commande.total_ht?.toFixed(2)} € HT
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Aucune commande pour le moment
              </div>
            )}
          </div>
        </div>

        {/* Clients en attente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-heading text-lg text-gray-900">
              Inscriptions en attente
              {clientsEnAttente && clientsEnAttente > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-belfrit-red rounded-full">
                  {clientsEnAttente}
                </span>
              )}
            </h2>
            <Link
              href="/admin/clients?statut=en_attente"
              className="text-sm text-belfrit-red hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {derniersClients && derniersClients.length > 0 ? (
              derniersClients.map((client: any) => (
                <Link
                  key={client.id}
                  href={`/admin/clients?statut=en_attente&search=${encodeURIComponent(client.email)}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{client.raison_sociale}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3" />
                      En attente
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(client.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Aucune inscription en attente
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-heading text-lg text-gray-900 mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Package className="w-4 h-4" />
            Ajouter un produit
          </Link>
          <Link
            href="/admin/clients?statut=en_attente"
            className="inline-flex items-center gap-2 px-4 py-2 bg-belfrit-yellow text-belfrit-black rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <Users className="w-4 h-4" />
            Valider les inscriptions
          </Link>
          <Link
            href="/admin/commandes?statut=en_attente"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Traiter les commandes
          </Link>
        </div>
      </div>
    </div>
  )
}
