'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  Loader2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Check,
  MapPin,
  Truck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CartItem {
  produit_id: string
  produit_nom: string
  variante_id: string
  variante_nom: string
  variante_poids: string | null
  prix_unitaire: number
  prix_base: number
  quantite: number
}

interface ZoneLivraison {
  id: string
  nom: string
  jours_livraison: string[]
  creneau_horaire: string
  frais_livraison: number
  seuil_franco: number
}

interface ClientInfo {
  id: string
  raison_sociale: string
  adresse_livraison: string | null
  code_postal: string | null
  ville: string | null
  pourcentage_remise: number
  zones_livraison: ZoneLivraison | null
}

const CART_KEY = 'belfrit_cart'

export default function PanierPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [client, setClient] = useState<ClientInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [numeroCommande, setNumeroCommande] = useState<string | null>(null)

  // Formulaire de commande
  const [step, setStep] = useState<'panier' | 'validation' | 'confirmation'>('panier')
  const [dateLivraison, setDateLivraison] = useState<string>('')
  const [commentaire, setCommentaire] = useState('')
  const [datesDisponibles, setDatesDisponibles] = useState<Date[]>([])

  // Charger le panier et les infos client
  useEffect(() => {
    const loadData = async () => {
      // Charger le panier du localStorage
      const savedCart = localStorage.getItem(CART_KEY)
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }

      // Charger les infos client
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select(`
            id,
            raison_sociale,
            adresse_livraison,
            code_postal,
            ville,
            pourcentage_remise,
            zones_livraison (id, nom, jours_livraison, creneau_horaire, frais_livraison, seuil_franco)
          `)
          .eq('id', user.id)
          .single()

        if (clientData) {
          const client = clientData as any
          setClient(client as ClientInfo)

          // Calculer les dates de livraison disponibles
          if (client.zones_livraison?.jours_livraison) {
            const dates = calculateAvailableDates(client.zones_livraison.jours_livraison)
            setDatesDisponibles(dates)
            if (dates.length > 0) {
              setDateLivraison(dates[0].toISOString().split('T')[0])
            }
          }
        }
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // Calculer les prochaines dates de livraison selon les jours autorisés
  const calculateAvailableDates = (joursLivraison: string[]): Date[] => {
    const jourMap: Record<string, number> = {
      'lundi': 1,
      'mardi': 2,
      'mercredi': 3,
      'jeudi': 4,
      'vendredi': 5,
      'samedi': 6,
      'dimanche': 0,
    }

    const joursNumbers = joursLivraison.map(j => jourMap[j.toLowerCase()]).filter(n => n !== undefined)
    const dates: Date[] = []
    const today = new Date()

    // Chercher les 8 prochaines dates disponibles (sur les 4 prochaines semaines)
    for (let i = 1; i <= 28 && dates.length < 8; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      if (joursNumbers.includes(date.getDay())) {
        // Minimum 2 jours de délai pour la commande
        if (i >= 2) {
          dates.push(date)
        }
      }
    }

    return dates
  }

  // Sauvegarder le panier
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem(CART_KEY, JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  // Modifier la quantité
  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart]
    newCart[index].quantite = Math.max(1, newCart[index].quantite + delta)
    saveCart(newCart)
  }

  // Supprimer un article
  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    saveCart(newCart)
  }

  // Vider le panier
  const clearCart = () => {
    saveCart([])
  }

  // Calculs totaux
  const sousTotal = cart.reduce((sum, item) => sum + item.prix_unitaire * item.quantite, 0)
  const fraisLivraison = client?.zones_livraison
    ? (sousTotal >= client.zones_livraison.seuil_franco ? 0 : client.zones_livraison.frais_livraison)
    : 0
  const total = sousTotal + fraisLivraison

  // Générer le numéro de commande
  const generateOrderNumber = () => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `BF${year}${month}-${random}`
  }

  // Valider la commande
  const handleSubmitOrder = async () => {
    if (!client || !dateLivraison) return

    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const numero = generateOrderNumber()

    try {
      // 1. Créer la commande
      const { data: commande, error: commandeError } = await supabase
        .from('commandes')
        .insert({
          numero,
          client_id: client.id,
          statut: 'en_attente',
          statut_paiement: 'en_attente',
          total_ht: sousTotal,
          remise_appliquee: client.pourcentage_remise,
          frais_livraison: fraisLivraison,
          zone_livraison_id: client.zones_livraison?.id || null,
          date_livraison_souhaitee: dateLivraison,
          adresse_livraison: client.adresse_livraison
            ? `${client.adresse_livraison}, ${client.code_postal} ${client.ville}`
            : null,
          commentaire: commentaire || null,
        })
        .select()
        .single()

      if (commandeError) {
        console.error('Commande error:', commandeError)
        throw new Error('Erreur lors de la création de la commande')
      }

      // 2. Créer les lignes de commande
      const lignes = cart.map(item => ({
        commande_id: commande.id,
        produit_id: item.produit_id,
        variante_id: item.variante_id,
        quantite: item.quantite,
        prix_unitaire: item.prix_unitaire,
      }))

      const { error: lignesError } = await supabase
        .from('lignes_commande')
        .insert(lignes)

      if (lignesError) {
        console.error('Lignes error:', lignesError)
        // Supprimer la commande créée en cas d'erreur
        await supabase.from('commandes').delete().eq('id', commande.id)
        throw new Error('Erreur lors de l\'ajout des articles')
      }

      // 3. Succès - Vider le panier
      clearCart()
      setNumeroCommande(numero)
      setStep('confirmation')
      setSuccess(true)

    } catch (err: any) {
      setError(err.message || 'Erreur lors de la validation')
    } finally {
      setSubmitting(false)
    }
  }

  // Formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-belfrit-red" />
      </div>
    )
  }

  // Page de confirmation
  if (step === 'confirmation' && success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-heading text-gray-900 mb-2">
            Commande confirmée !
          </h1>

          <p className="text-gray-600 mb-6">
            Votre commande a bien été enregistrée et sera traitée dans les meilleurs délais.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Numéro de commande</p>
            <p className="text-2xl font-bold text-belfrit-red">{numeroCommande}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Livraison prévue</p>
                <p className="text-sm text-blue-700">
                  {new Date(dateLivraison).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {client?.zones_livraison?.creneau_horaire && (
                    <span className="ml-2">({client.zones_livraison.creneau_horaire})</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/espace-client/commandes"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Voir mes commandes
            </Link>
            <Link
              href="/espace-client/catalogue"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Panier vide
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-heading text-gray-900 mb-2">
            Votre panier est vide
          </h1>
          <p className="text-gray-500 mb-6">
            Parcourez notre catalogue pour ajouter des produits
          </p>
          <Link
            href="/espace-client/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Package className="w-5 h-5" />
            Voir le catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">
            {step === 'panier' ? 'Mon panier' : 'Validation de commande'}
          </h1>
          <p className="text-gray-500">
            {cart.length} article{cart.length > 1 ? 's' : ''}
          </p>
        </div>

        {step === 'panier' && (
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Vider le panier
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {step === 'panier' ? (
            // Étape 1: Liste modifiable
            cart.map((item, index) => (
              <div
                key={`${item.produit_id}-${item.variante_id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.produit_nom}</h3>
                    <p className="text-sm text-gray-500">
                      {item.variante_nom}
                      {item.variante_poids && ` - ${item.variante_poids}`}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantité */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, -1)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantite}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, 1)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Prix */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {(item.prix_unitaire * item.quantite).toFixed(2)} €
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.prix_unitaire.toFixed(2)} € / unité
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Supprimer */}
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Étape 2: Récapitulatif + formulaire
            <div className="space-y-4">
              {/* Récapitulatif articles (lecture seule) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">Récapitulatif</h3>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={`${item.produit_id}-${item.variante_id}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.produit_nom} - {item.variante_nom} x{item.quantite}
                      </span>
                      <span className="font-medium text-gray-900">
                        {(item.prix_unitaire * item.quantite).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adresse de livraison */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  Adresse de livraison
                </h3>
                <p className="text-gray-600">
                  {client?.adresse_livraison || 'Non renseignée'}
                  {client?.code_postal && client?.ville && (
                    <>, {client.code_postal} {client.ville}</>
                  )}
                </p>
                {client?.zones_livraison && (
                  <p className="text-sm text-blue-600 mt-1">
                    Zone : {client.zones_livraison.nom}
                  </p>
                )}
              </div>

              {/* Date de livraison */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Date de livraison souhaitée *
                </h3>

                {datesDisponibles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {datesDisponibles.map((date) => {
                      const dateStr = date.toISOString().split('T')[0]
                      const isSelected = dateLivraison === dateStr

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => setDateLivraison(dateStr)}
                          className={`p-3 rounded-lg border-2 text-center transition-colors ${
                            isSelected
                              ? 'border-belfrit-red bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="text-xs text-gray-500 capitalize">
                            {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                          </p>
                          <p className={`font-medium ${isSelected ? 'text-belfrit-red' : 'text-gray-900'}`}>
                            {date.getDate()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {date.toLocaleDateString('fr-FR', { month: 'short' })}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                    Aucune date de livraison disponible. Veuillez contacter le service client.
                  </p>
                )}

                {client?.zones_livraison?.creneau_horaire && (
                  <p className="text-sm text-gray-500 mt-3">
                    <Truck className="w-4 h-4 inline mr-1" />
                    Créneau de livraison : {client.zones_livraison.creneau_horaire}
                  </p>
                )}
              </div>

              {/* Commentaire */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  Instructions de livraison (optionnel)
                </h3>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={3}
                  placeholder="Ex: Sonner à l'interphone, livrer à l'arrière..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Récapitulatif / Total */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
            <h3 className="font-heading text-lg text-gray-900 mb-4">Récapitulatif</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total HT</span>
                <span className="font-medium text-gray-900">{sousTotal.toFixed(2)} €</span>
              </div>

              {(client?.pourcentage_remise ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise client ({client?.pourcentage_remise}%)</span>
                  <span>Incluse</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Frais de livraison</span>
                {fraisLivraison === 0 ? (
                  <span className="text-green-600 font-medium">Offerts</span>
                ) : (
                  <span className="font-medium text-gray-900">{fraisLivraison.toFixed(2)} €</span>
                )}
              </div>

              {client?.zones_livraison && sousTotal < client.zones_livraison.seuil_franco && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Franco de port à partir de {client.zones_livraison.seuil_franco.toFixed(2)} € HT
                </p>
              )}

              <hr className="my-2" />

              <div className="flex justify-between text-lg">
                <span className="font-medium text-gray-900">Total HT</span>
                <span className="font-bold text-belfrit-red">{total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Boutons */}
            <div className="mt-6 space-y-3">
              {step === 'panier' ? (
                <button
                  type="button"
                  onClick={() => setStep('validation')}
                  className="w-full py-3 bg-belfrit-red text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                >
                  Valider la commande
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={submitting || !dateLivraison || datesDisponibles.length === 0}
                    className="w-full py-3 bg-belfrit-red text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validation en cours...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Confirmer la commande
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('panier')}
                    disabled={submitting}
                    className="w-full py-2 text-gray-600 hover:text-gray-900 text-sm transition-colors disabled:opacity-50"
                  >
                    ← Modifier le panier
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
