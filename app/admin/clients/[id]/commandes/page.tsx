import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Package, Calendar, CreditCard, Truck } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ClientCommandesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Récupérer le client
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (clientError || !clientData) {
    notFound()
  }

  const client = clientData as any

  // Récupérer les commandes du client
  const { data: commandes } = await supabase
    .from('commandes')
    .select(`
      *,
      zones_livraison (nom),
      lignes_commande (
        id,
        quantite,
        prix_unitaire,
        produits (nom),
        variantes (nom, poids)
      )
    `)
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en_preparation':
        return 'bg-blue-100 text-blue-800'
      case 'en_livraison':
        return 'bg-purple-100 text-purple-800'
      case 'livre':
        return 'bg-green-100 text-green-800'
      case 'annule':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'En attente'
      case 'en_preparation':
        return 'En préparation'
      case 'en_livraison':
        return 'En livraison'
      case 'livre':
        return 'Livré'
      case 'annule':
        return 'Annulé'
      default:
        return statut
    }
  }

  const getStatutPaiementStyle = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'bg-green-100 text-green-800'
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'echoue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutPaiementLabel = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'Payé'
      case 'en_attente':
        return 'En attente'
      case 'echoue':
        return 'Échoué'
      default:
        return statut
    }
  }

  // Calculer les stats
  const stats = {
    total: commandes?.length || 0,
    totalHT: commandes?.reduce((acc: number, c: any) => acc + (c.total_ht || 0), 0) || 0,
    livrees: commandes?.filter((c: any) => c.statut === 'livre').length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux clients
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">
            Commandes de {client.raison_sociale}
          </h1>
          <p className="text-gray-500">{stats.total} commande(s)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total commandes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-4">
          <p className="text-sm text-green-700">Livrées</p>
          <p className="text-2xl font-bold text-green-800">{stats.livrees}</p>
        </div>
        <div className="bg-belfrit-yellow/10 rounded-xl shadow-sm border border-belfrit-yellow p-4">
          <p className="text-sm text-gray-600">Chiffre d'affaires</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalHT.toFixed(2)} € HT</p>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {commandes && commandes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {commandes.map((commande: any) => (
              <div key={commande.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Infos commande */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-medium text-gray-900">
                        #{commande.numero}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatutStyle(commande.statut)}`}>
                        {getStatutLabel(commande.statut)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutPaiementStyle(commande.statut_paiement)}`}>
                        <CreditCard className="w-3 h-3" />
                        {getStatutPaiementLabel(commande.statut_paiement)}
                      </span>
                    </div>

                    {/* Date et livraison */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {commande.date_livraison_souhaitee && (
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Livraison: {new Date(commande.date_livraison_souhaitee).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {commande.zones_livraison && (
                        <span className="text-blue-600">
                          {commande.zones_livraison.nom}
                        </span>
                      )}
                    </div>

                    {/* Produits */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {commande.lignes_commande?.length || 0} article(s):
                        {' '}
                        <span className="text-gray-400">
                          {commande.lignes_commande?.slice(0, 3).map((ligne: any, i: number) => (
                            <span key={ligne.id}>
                              {i > 0 && ', '}
                              {ligne.produits?.nom} ({ligne.quantite}x)
                            </span>
                          ))}
                          {commande.lignes_commande?.length > 3 && '...'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {((commande.total_ht || 0) - (commande.remise_appliquee || 0) + (commande.frais_livraison || 0)).toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500">
                      {commande.total_ht?.toFixed(2)} € HT
                      {commande.remise_appliquee > 0 && (
                        <span className="text-green-600"> - {commande.remise_appliquee?.toFixed(2)} € remise</span>
                      )}
                    </p>
                    {commande.frais_livraison > 0 && (
                      <p className="text-xs text-gray-400">
                        + {commande.frais_livraison?.toFixed(2)} € livraison
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune commande pour ce client</p>
          </div>
        )}
      </div>
    </div>
  )
}
