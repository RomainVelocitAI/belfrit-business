import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  CreditCard,
  MessageSquare,
  FileText,
  Download,
} from 'lucide-react'

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Récupérer la commande avec ses lignes
  const { data: commande, error } = await supabase
    .from('commandes')
    .select(`
      *,
      zones_livraison (nom, creneau_horaire),
      lignes_commande (
        id,
        quantite,
        prix_unitaire,
        produits (id, nom),
        variantes (id, nom, poids)
      )
    `)
    .eq('id', id)
    .eq('client_id', user.id)
    .single()

  if (!commande) {
    notFound()
  }

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: Clock,
          label: 'En attente de validation',
          description: 'Votre commande a été reçue et sera traitée prochainement.',
        }
      case 'en_preparation':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: Package,
          label: 'En préparation',
          description: 'Votre commande est en cours de préparation dans nos entrepôts.',
        }
      case 'en_livraison':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-200',
          icon: Truck,
          label: 'En livraison',
          description: 'Votre commande est en route vers votre adresse.',
        }
      case 'livre':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: CheckCircle,
          label: 'Livré',
          description: 'Votre commande a été livrée avec succès.',
        }
      case 'annule':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: XCircle,
          label: 'Annulé',
          description: 'Cette commande a été annulée.',
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: Clock,
          label: statut,
          description: '',
        }
    }
  }

  const getPaiementBadge = (statut: string) => {
    switch (statut) {
      case 'paye':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Payé' }
      case 'echoue':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Échec du paiement' }
      default:
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'En attente de paiement' }
    }
  }

  const statut = getStatutStyle(commande.statut)
  const paiement = getPaiementBadge(commande.statut_paiement)
  const StatutIcon = statut.icon

  // Calcul du total des lignes pour vérification
  const totalLignes = commande.lignes_commande?.reduce(
    (sum: number, ligne: any) => sum + ligne.prix_unitaire * ligne.quantite,
    0
  ) || 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/espace-client/commandes"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading text-gray-900">
            Commande {commande.numero}
          </h1>
          <p className="text-gray-500">
            Passée le {new Date(commande.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Statut principal */}
      <div className={`${statut.bg} ${statut.border} border rounded-xl p-4`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${statut.bg}`}>
            <StatutIcon className={`w-6 h-6 ${statut.text}`} />
          </div>
          <div>
            <h2 className={`font-heading text-lg ${statut.text}`}>
              {statut.label}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {statut.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-heading text-gray-900">Articles commandés</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {commande.lignes_commande?.map((ligne: any) => (
                <div key={ligne.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {ligne.produits?.nom || 'Produit'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ligne.variantes?.nom}
                        {ligne.variantes?.poids && ` - ${ligne.variantes.poids}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(ligne.prix_unitaire * ligne.quantite).toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500">
                      {ligne.quantite} x {ligne.prix_unitaire.toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total HT</span>
                  <span className="text-gray-900">{commande.total_ht?.toFixed(2)} €</span>
                </div>

                {commande.remise_appliquee > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise client ({commande.remise_appliquee}%)</span>
                    <span>Incluse</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  {commande.frais_livraison === 0 ? (
                    <span className="text-green-600">Offerts</span>
                  ) : (
                    <span className="text-gray-900">{commande.frais_livraison?.toFixed(2)} €</span>
                  )}
                </div>

                <hr className="my-2" />

                <div className="flex justify-between text-lg">
                  <span className="font-medium text-gray-900">Total HT</span>
                  <span className="font-bold text-belfrit-red">
                    {(commande.total_ht + (commande.frais_livraison || 0)).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions de livraison */}
          {commande.commentaire && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-heading text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                Instructions de livraison
              </h3>
              <p className="text-gray-600">{commande.commentaire}</p>
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Livraison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-heading text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-gray-400" />
              Livraison
            </h3>

            <div className="space-y-4">
              {commande.date_livraison_souhaitee && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date prévue</p>
                    <p className="font-medium text-gray-900">
                      {new Date(commande.date_livraison_souhaitee).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    {commande.zones_livraison?.creneau_horaire && (
                      <p className="text-sm text-gray-500">
                        {commande.zones_livraison.creneau_horaire}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {commande.adresse_livraison && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium text-gray-900">
                      {commande.adresse_livraison}
                    </p>
                  </div>
                </div>
              )}

              {commande.zones_livraison?.nom && (
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  Zone : {commande.zones_livraison.nom}
                </div>
              )}
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-heading text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              Paiement
            </h3>

            <div className={`${paiement.bg} ${paiement.text} px-3 py-2 rounded-lg text-sm font-medium text-center`}>
              {paiement.label}
            </div>

            {commande.statut_paiement === 'en_attente' && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Le paiement sera effectué à la livraison ou selon les modalités convenues.
              </p>
            )}
          </div>

          {/* Facture */}
          {commande.facture_url && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-heading text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Documents
              </h3>

              <a
                href={commande.facture_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Télécharger la facture
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Lien retour */}
      <div className="text-center pt-6">
        <Link
          href="/espace-client/commandes"
          className="text-gray-500 hover:text-belfrit-red transition-colors"
        >
          ← Retour à mes commandes
        </Link>
      </div>
    </div>
  )
}
