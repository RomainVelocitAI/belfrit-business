'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Plus, Minus, Check, Loader2 } from 'lucide-react'
import type { Produit, Variante } from '@/types/database'

interface AddToCartFormProps {
  produit: Produit
  variantes: Variante[]
  remise: number
}

export function AddToCartForm({ produit, variantes, remise }: AddToCartFormProps) {
  const router = useRouter()
  const [selectedVariante, setSelectedVariante] = useState<string>(variantes[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const variante = variantes.find(v => v.id === selectedVariante)
  const prixBase = variante?.prix_base || 0
  const prixRemise = remise > 0 ? prixBase * (1 - remise / 100) : prixBase
  const total = prixRemise * quantity

  const handleAddToCart = async () => {
    if (!selectedVariante || !variante) return

    setLoading(true)

    // Récupérer le panier actuel du localStorage
    const cartKey = 'belfrit_cart'
    const existingCart = localStorage.getItem(cartKey)
    const cart = existingCart ? JSON.parse(existingCart) : []

    // Vérifier si le produit/variante existe déjà
    const existingIndex = cart.findIndex(
      (item: any) => item.produit_id === produit.id && item.variante_id === selectedVariante
    )

    if (existingIndex >= 0) {
      // Mettre à jour la quantité
      cart[existingIndex].quantite += quantity
    } else {
      // Ajouter nouvel item
      cart.push({
        produit_id: produit.id,
        produit_nom: produit.nom,
        variante_id: selectedVariante,
        variante_nom: variante.nom,
        variante_poids: variante.poids,
        prix_unitaire: prixRemise,
        prix_base: prixBase,
        quantite: quantity,
      })
    }

    // Sauvegarder
    localStorage.setItem(cartKey, JSON.stringify(cart))

    // Animation de succès
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setLoading(false)
    }, 1500)

    // Déclencher un event pour mettre à jour le compteur panier
    window.dispatchEvent(new Event('cart-updated'))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Sélection variante */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conditionnement
        </label>
        <div className="space-y-2">
          {variantes.map((v) => {
            const vPrixRemise = remise > 0 ? v.prix_base * (1 - remise / 100) : v.prix_base

            return (
              <label
                key={v.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedVariante === v.id
                    ? 'border-belfrit-red bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="variante"
                    value={v.id}
                    checked={selectedVariante === v.id}
                    onChange={() => setSelectedVariante(v.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedVariante === v.id
                        ? 'border-belfrit-red bg-belfrit-red'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedVariante === v.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{v.nom}</p>
                    {v.poids && (
                      <p className="text-sm text-gray-500">{v.poids}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {remise > 0 ? (
                    <>
                      <p className="font-bold text-belfrit-red">{vPrixRemise.toFixed(2)} €</p>
                      <p className="text-xs text-gray-400 line-through">{v.prix_base.toFixed(2)} €</p>
                    </>
                  ) : (
                    <p className="font-bold text-gray-900">{v.prix_base.toFixed(2)} €</p>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Quantité */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantité
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{total.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {/* Bouton ajouter */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || !selectedVariante}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-belfrit-red text-white hover:bg-red-700'
        } disabled:opacity-50`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : added ? (
          <>
            <Check className="w-5 h-5" />
            Ajouté au panier !
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Ajouter au panier
          </>
        )}
      </button>
    </div>
  )
}
