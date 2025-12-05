import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, Filter, ShoppingBag, Calendar, MapPin, CreditCard, Eye } from 'lucide-react'
import { CommandeStatusToggle } from '@/components/admin/commande-status-toggle'

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; zone?: string; search?: string; date_debut?: string; date_fin?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Récupérer les zones pour le filtre
  const { data: zones } = await supabase
    .from('zones_livraison')
    .select('*')
    .eq('actif', true)
    .order('nom')

  // Construire la requête commandes
  let query = supabase
    .from('commandes')
    .select(`
      *,
      clients (id, raison_sociale, email, telephone),
      zones_livraison (id, nom)
    `)
    .order('created_at', { ascending: false })

  // Filtres
  if (params.statut) {
    query = query.eq('statut', params.statut)
  }
  if (params.zone) {
    query = query.eq('zone_livraison_id', params.zone)
  }
  if (params.date_debut) {
    query = query.gte('created_at', params.date_debut)
  }
  if (params.date_fin) {
    query = query.lte('created_at', params.date_fin + 'T23:59:59')
  }

  const { data: commandesData, error } = await query

  // Filtrage par recherche (numéro commande OU nom client)
  let commandes = commandesData
  if (params.search && commandesData) {
    const searchLower = params.search.toLowerCase()
    commandes = commandesData.filter((c: any) =>
      c.numero?.toLowerCase().includes(searchLower) ||
      c.clients?.raison_sociale?.toLowerCase().includes(searchLower)
    )
  }

  // Compter par statut
  const { data: countData } = await supabase
    .from('commandes')
    .select('statut, statut_paiement')

  const counts = {
    total: countData?.length || 0,
    en_attente: countData?.filter(c => c.statut === 'en_attente').length || 0,
    en_preparation: countData?.filter(c => c.statut === 'en_preparation').length || 0,
    en_livraison: countData?.filter(c => c.statut === 'en_livraison').length || 0,
    livre: countData?.filter(c => c.statut === 'livre').length || 0,
    annule: countData?.filter(c => c.statut === 'annule').length || 0,
    non_paye: countData?.filter(c => c.statut_paiement === 'en_attente').length || 0,
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">Commandes</h1>
          <p className="text-gray-500">{commandes?.length || 0} commande(s)</p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{counts.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-3">
          <p className="text-xs text-yellow-700">En attente</p>
          <p className="text-xl font-bold text-yellow-800">{counts.en_attente}</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-3">
          <p className="text-xs text-blue-700">Préparation</p>
          <p className="text-xl font-bold text-blue-800">{counts.en_preparation}</p>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-sm border border-purple-200 p-3">
          <p className="text-xs text-purple-700">Livraison</p>
          <p className="text-xl font-bold text-purple-800">{counts.en_livraison}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-3">
          <p className="text-xs text-green-700">Livrées</p>
          <p className="text-xl font-bold text-green-800">{counts.livre}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-3">
          <p className="text-xs text-red-700">Annulées</p>
          <p className="text-xl font-bold text-red-800">{counts.annule}</p>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-200 p-3">
          <p className="text-xs text-orange-700">Non payées</p>
          <p className="text-xl font-bold text-orange-800">{counts.non_paye}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form className="flex flex-col md:flex-row gap-4 flex-wrap">
          {/* Recherche */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="N° commande ou nom client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
              />
            </div>
          </div>

          {/* Statut */}
          <div className="w-full md:w-40">
            <select
              name="statut"
              defaultValue={params.statut}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
            >
              <option value="">Tous statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_preparation">En préparation</option>
              <option value="en_livraison">En livraison</option>
              <option value="livre">Livré</option>
              <option value="annule">Annulé</option>
            </select>
          </div>

          {/* Zone */}
          <div className="w-full md:w-40">
            <select
              name="zone"
              defaultValue={params.zone}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
            >
              <option value="">Toutes zones</option>
              {zones?.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date début */}
          <div className="w-full md:w-40">
            <input
              type="date"
              name="date_debut"
              defaultValue={params.date_debut}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
              placeholder="Date début"
            />
          </div>

          {/* Date fin */}
          <div className="w-full md:w-40">
            <input
              type="date"
              name="date_fin"
              defaultValue={params.date_fin}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
              placeholder="Date fin"
            />
          </div>

          {/* Bouton filtrer */}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </form>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {commandes && commandes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commandes.map((commande: any) => {
                  const totalTTC = (commande.total_ht || 0) - (commande.remise_appliquee || 0) + (commande.frais_livraison || 0)

                  return (
                    <tr key={commande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">#{commande.numero}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {commande.clients?.raison_sociale || 'Client inconnu'}
                          </p>
                          <p className="text-sm text-gray-500">{commande.clients?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {commande.zones_livraison ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            <MapPin className="w-3 h-3" />
                            {commande.zones_livraison.nom}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{totalTTC.toFixed(2)} €</p>
                          {commande.remise_appliquee > 0 && (
                            <p className="text-xs text-green-600">
                              -{commande.remise_appliquee.toFixed(2)} € remise
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatutPaiementStyle(commande.statut_paiement)}`}>
                          <CreditCard className="w-3 h-3" />
                          {getStatutPaiementLabel(commande.statut_paiement)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <CommandeStatusToggle
                          commandeId={commande.id}
                          currentValue={commande.statut}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/commandes/${commande.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Détails
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}
