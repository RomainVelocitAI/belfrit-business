import { createClient } from '@/lib/supabase/server'
import { Search, Filter, Users, Building2, MapPin, Phone, Mail, FileCheck } from 'lucide-react'
import { ClientStatusToggle } from '@/components/admin/client-status-toggle'
import { ClientActions } from '@/components/admin/client-actions'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; search?: string; zone?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Récupérer les zones pour le filtre
  const { data: zones } = await supabase
    .from('zones_livraison')
    .select('*')
    .eq('actif', true)
    .order('nom')

  // Construire la requête clients
  let query = supabase
    .from('clients')
    .select(`
      *,
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
  if (params.search) {
    query = query.or(`raison_sociale.ilike.%${params.search}%,email.ilike.%${params.search}%,siret.ilike.%${params.search}%`)
  }

  const { data: clients, error } = await query

  // Compter par statut
  const { data: countData } = await supabase
    .from('clients')
    .select('statut')

  const counts = {
    total: countData?.length || 0,
    en_attente: countData?.filter(c => c.statut === 'en_attente').length || 0,
    actif: countData?.filter(c => c.statut === 'actif').length || 0,
    refuse: countData?.filter(c => c.statut === 'refuse').length || 0,
    suspendu: countData?.filter(c => c.statut === 'suspendu').length || 0,
  }

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'actif':
        return 'bg-green-100 text-green-800'
      case 'refuse':
        return 'bg-red-100 text-red-800'
      case 'suspendu':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'En attente'
      case 'actif':
        return 'Validé'
      case 'refuse':
        return 'Refusé'
      case 'suspendu':
        return 'Suspendu'
      default:
        return statut
    }
  }

  const getTypeStructureLabel = (type: string | null) => {
    switch (type) {
      case 'restaurant':
        return 'Restaurant'
      case 'snack':
        return 'Snack/Friterie'
      case 'hotel':
        return 'Hôtel'
      case 'commerce':
        return 'Commerce'
      default:
        return '-'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">Clients</h1>
          <p className="text-gray-500">{clients?.length || 0} client(s)</p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-4">
          <p className="text-sm text-yellow-700">En attente</p>
          <p className="text-2xl font-bold text-yellow-800">{counts.en_attente}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-4">
          <p className="text-sm text-green-700">Validés</p>
          <p className="text-2xl font-bold text-green-800">{counts.actif}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
          <p className="text-sm text-red-700">Refusés</p>
          <p className="text-2xl font-bold text-red-800">{counts.refuse}</p>
        </div>
        <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-300 p-4">
          <p className="text-sm text-gray-600">Suspendus</p>
          <p className="text-2xl font-bold text-gray-700">{counts.suspendu}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="Rechercher par nom, email, SIRET..."
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
              <option value="actif">Validé</option>
              <option value="refuse">Refusé</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>

          {/* Zone */}
          <div className="w-full md:w-48">
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

      {/* Liste des clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {clients && clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remise
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
                {clients.map((client: any) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-belfrit-red/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-belfrit-red" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{client.raison_sociale}</p>
                            {client.kbis_url && (
                              <a
                                href={client.kbis_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="KBIS fourni - Cliquer pour voir"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FileCheck className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{getTypeStructureLabel(client.type_structure)}</p>
                          {client.siret && (
                            <p className="text-xs text-gray-400">SIRET: {client.siret}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {client.contact_nom && (
                          <p className="text-sm text-gray-900">
                            {client.contact_prenom} {client.contact_nom}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </div>
                        {client.telephone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            {client.telephone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {client.zones_livraison ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            <MapPin className="w-3 h-3" />
                            {client.zones_livraison.nom}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Non définie</span>
                        )}
                        {client.ville && (
                          <p className="text-xs text-gray-500">{client.code_postal} {client.ville}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-gray-900">
                        {client.pourcentage_remise}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ClientStatusToggle
                        clientId={client.id}
                        currentValue={client.statut}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ClientActions client={client} zones={zones || []} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun client trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
