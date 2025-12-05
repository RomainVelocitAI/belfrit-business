import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Truck,
  CreditCard,
  FileText,
  Package,
} from 'lucide-react'
import { CommandeStatusToggle } from '@/components/admin/commande-status-toggle'
import { CommandeNotes } from '@/components/admin/commande-notes'

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Récupérer la commande avec toutes ses relations
  const { data: commande, error } = await supabase
    .from('commandes')
    .select(`
      *,
      clients (
        id,
        raison_sociale,
        email,
        telephone,
        contact_nom,
        contact_prenom,
        adresse_facturation,
        adresse_livraison,
        code_postal,
        ville,
        pourcentage_remise,
        type_structure
      ),
      zones_livraison (id, nom, jours_livraison, creneau_horaire),
      lignes_commande (
        id,
        quantite,
        prix_unitaire,
        produits (id, nom),
        variantes (id, nom, poids)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !commande) {
    notFound()
  }

  const client = commande.clients as any
  const zone = commande.zones_livraison as any
  const lignes = (commande.lignes_commande || []) as any[]

  // Calculs
  const sousTotal = lignes.reduce((acc, l) => acc + l.quantite * l.prix_unitaire, 0)
  const totalHT = commande.total_ht || sousTotal
  const remise = commande.remise_appliquee || 0
  const fraisLivraison = commande.frais_livraison || 0
  const totalTTC = totalHT - remise + fraisLivraison

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

  const getTypeStructureLabel = (type: string | null) => {
    switch (type) {
      case 'restaurant': return 'Restaurant'
      case 'snack': return 'Snack/Friterie'
      case 'hotel': return 'Hôtel'
      case 'commerce': return 'Commerce'
      default: return '-'
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux commandes
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">
            Commande #{commande.numero}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatutPaiementStyle(commande.statut_paiement)}`}>
              <CreditCard className="w-3 h-3" />
              {getStatutPaiementLabel(commande.statut_paiement)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Statut :</span>
          <CommandeStatusToggle
            commandeId={commande.id}
            currentValue={commande.statut}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produits commandés */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Articles commandés
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Qté
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Prix unitaire
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Sous-total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {ligne.produits?.nom || 'Produit supprimé'}
                        </p>
                        {ligne.variantes && (
                          <p className="text-sm text-gray-500">
                            {ligne.variantes.nom}
                            {ligne.variantes.poids && ` - ${ligne.variantes.poids}`}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-900">
                        {ligne.quantite}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        {ligne.prix_unitaire.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {(ligne.quantite * ligne.prix_unitaire).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total HT</span>
                  <span className="text-gray-900">{totalHT.toFixed(2)} €</span>
                </div>
                {remise > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Remise ({client?.pourcentage_remise || 0}%)</span>
                    <span className="text-green-600">-{remise.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="text-gray-900">
                    {fraisLivraison > 0 ? `${fraisLivraison.toFixed(2)} €` : 'Offerts'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                  <span className="text-gray-900">Total TTC</span>
                  <span className="text-belfrit-red">{totalTTC.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes internes */}
          <CommandeNotes
            commandeId={commande.id}
            initialNotes={commande.commentaire || ''}
          />
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Client */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5" />
              Client
            </h2>

            {client ? (
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">{client.raison_sociale}</p>
                  <p className="text-sm text-gray-500">{getTypeStructureLabel(client.type_structure)}</p>
                </div>

                {client.contact_nom && (
                  <div>
                    <p className="text-sm text-gray-600">
                      {client.contact_prenom} {client.contact_nom}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {client.email}
                  </p>
                  {client.telephone && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {client.telephone}
                    </p>
                  )}
                </div>

                <Link
                  href={`/admin/clients/${client.id}/commandes`}
                  className="block text-center text-sm text-belfrit-red hover:underline"
                >
                  Voir toutes ses commandes
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Client non trouvé</p>
            )}
          </div>

          {/* Livraison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5" />
              Livraison
            </h2>

            <div className="space-y-4">
              {zone && (
                <div>
                  <p className="text-sm text-gray-500">Zone</p>
                  <p className="font-medium text-gray-900">{zone.nom}</p>
                  {zone.jours_livraison && (
                    <p className="text-xs text-gray-500">
                      {zone.jours_livraison.join(', ')} - {zone.creneau_horaire}
                    </p>
                  )}
                </div>
              )}

              {commande.date_livraison_souhaitee && (
                <div>
                  <p className="text-sm text-gray-500">Date souhaitée</p>
                  <p className="font-medium text-gray-900">
                    {new Date(commande.date_livraison_souhaitee).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              )}

              {commande.adresse_livraison ? (
                <div>
                  <p className="text-sm text-gray-500">Adresse de livraison</p>
                  <p className="text-gray-900 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{commande.adresse_livraison}</span>
                  </p>
                </div>
              ) : client?.adresse_livraison ? (
                <div>
                  <p className="text-sm text-gray-500">Adresse de livraison (client)</p>
                  <p className="text-gray-900 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>
                      {client.adresse_livraison}
                      <br />
                      {client.code_postal} {client.ville}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" />
              Paiement
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Statut</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatutPaiementStyle(commande.statut_paiement)}`}>
                  {getStatutPaiementLabel(commande.statut_paiement)}
                </span>
              </div>

              {commande.stripe_payment_id && (
                <div>
                  <p className="text-sm text-gray-500">ID Stripe</p>
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {commande.stripe_payment_id}
                  </p>
                </div>
              )}

              {commande.facture_url && (
                <a
                  href={commande.facture_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-belfrit-red hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  Voir la facture
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
