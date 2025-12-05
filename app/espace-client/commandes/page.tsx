import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  ShoppingBag,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar,
  CreditCard,
} from 'lucide-react'

export default async function CommandesClientPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Récupérer les commandes du client
  const { data: commandes, error } = await supabase
    .from('commandes')
    .select(`
      *,
      zones_livraison (nom)
    `)
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: Clock,
          label: 'En attente',
        }
      case 'en_preparation':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: Package,
          label: 'En préparation',
        }
      case 'en_livraison':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: Truck,
          label: 'En livraison',
        }
      case 'livre':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircle,
          label: 'Livré',
        }
      case 'annule':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: XCircle,
          label: 'Annulé',
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: Clock,
          label: statut,
        }
    }
  }

  const getPaiementStyle = (statut: string) => {
    switch (statut) {
      case 'paye':
        return { text: 'text-green-600', label: 'Payé' }
      case 'echoue':
        return { text: 'text-red-600', label: 'Échec' }
      default:
        return { text: 'text-orange-600', label: 'En attente' }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading text-gray-900">Mes commandes</h1>
        <p className="text-gray-500">
          {commandes?.length || 0} commande{(commandes?.length || 0) > 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des commandes */}
      {commandes && commandes.length > 0 ? (
        <div className="space-y-4">
          {commandes.map((commande: any) => {
            const statut = getStatutStyle(commande.statut)
            const paiement = getPaiementStyle(commande.statut_paiement)
            const StatutIcon = statut.icon

            return (
              <Link
                key={commande.id}
                href={`/espace-client/commandes/${commande.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Infos principales */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-heading text-lg text-gray-900">
                        {commande.numero}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statut.bg} ${statut.text}`}>
                        <StatutIcon className="w-3 h-3" />
                        {statut.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      {/* Date de commande */}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>

                      {/* Date de livraison */}
                      {commande.date_livraison_souhaitee && (
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Livraison : {new Date(commande.date_livraison_souhaitee).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}

                      {/* Paiement */}
                      <span className={`flex items-center gap-1 ${paiement.text}`}>
                        <CreditCard className="w-4 h-4" />
                        {paiement.label}
                      </span>
                    </div>
                  </div>

                  {/* Total + chevron */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {commande.total_ht?.toFixed(2)} €
                      </p>
                      <p className="text-xs text-gray-500">HT</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-heading text-gray-900 mb-2">
            Aucune commande
          </h2>
          <p className="text-gray-500 mb-6">
            Vous n'avez pas encore passé de commande
          </p>
          <Link
            href="/espace-client/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Package className="w-5 h-5" />
            Voir le catalogue
          </Link>
        </div>
      )}
    </div>
  )
}
