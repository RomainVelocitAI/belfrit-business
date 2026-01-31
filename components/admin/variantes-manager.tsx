'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { Variante, DisponibiliteType } from '@/types/database'

interface VariantesManagerProps {
  variantes: Partial<Variante>[]
  onChange: (variantes: Partial<Variante>[]) => void
}

export function VariantesManager({ variantes, onChange }: VariantesManagerProps) {
  const addVariante = () => {
    onChange([
      ...variantes,
      {
        nom: '',
        poids: '',
        prix_base: 0,
        disponibilite: 'disponible' as DisponibiliteType,
        ordre: variantes.length + 1,
        pieces_carton: null,
        poids_carton: null,
      },
    ])
  }

  const updateVariante = (index: number, field: keyof Variante, value: any) => {
    const newVariantes = [...variantes]
    newVariantes[index] = { ...newVariantes[index], [field]: value }
    onChange(newVariantes)
  }

  const removeVariante = (index: number) => {
    onChange(variantes.filter((_, i) => i !== index))
  }

  const moveVariante = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === variantes.length - 1)
    ) {
      return
    }

    const newVariantes = [...variantes]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newVariantes[index], newVariantes[targetIndex]] = [
      newVariantes[targetIndex],
      newVariantes[index],
    ]
    onChange(newVariantes)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Variantes / Conditionnements</h3>
          <p className="text-sm text-gray-500">
            Ajoutez les différents conditionnements disponibles (ex: Sachet 1kg, Carton 10kg)
          </p>
        </div>
        <button
          type="button"
          onClick={addVariante}
          className="inline-flex items-center gap-2 px-4 py-2 bg-belfrit-yellow text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter une variante
        </button>
      </div>

      {variantes.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">Aucune variante ajoutée</p>
          <button
            type="button"
            onClick={addVariante}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter la première variante
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* En-têtes */}
          <div className="hidden md:grid md:grid-cols-16 gap-3 px-4 text-sm font-medium text-gray-500" style={{ gridTemplateColumns: 'auto 3fr 1.5fr 1.5fr 1fr 1fr 2.5fr auto' }}>
            <div></div>
            <div>Nom *</div>
            <div>Poids</div>
            <div>Prix HT *</div>
            <div>Pcs/carton</div>
            <div>Kg/carton</div>
            <div>Disponibilité</div>
            <div></div>
          </div>

          {/* Liste des variantes */}
          {variantes.map((variante, index) => (
            <div
              key={variante.id || `new-${index}`}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-none gap-3 items-center" style={{ gridTemplateColumns: 'auto 3fr 1.5fr 1.5fr 1fr 1fr 2.5fr auto' }}>
                {/* Grip pour réordonner */}
                <div className="hidden md:flex justify-center">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveVariante(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveVariante(index, 'down')}
                      disabled={index === variantes.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Nom */}
                <div>
                  <label className="md:hidden text-sm font-medium text-gray-700 mb-1 block">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={variante.nom || ''}
                    onChange={(e) => updateVariante(index, 'nom', e.target.value)}
                    required
                    placeholder="Ex: Sachet 1kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  />
                </div>

                {/* Poids */}
                <div>
                  <label className="md:hidden text-sm font-medium text-gray-700 mb-1 block">
                    Poids
                  </label>
                  <input
                    type="text"
                    value={variante.poids || ''}
                    onChange={(e) => updateVariante(index, 'poids', e.target.value)}
                    placeholder="Ex: 1kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  />
                </div>

                {/* Prix */}
                <div>
                  <label className="md:hidden text-sm font-medium text-gray-700 mb-1 block">
                    Prix HT *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variante.prix_base || ''}
                      onChange={(e) => updateVariante(index, 'prix_base', parseFloat(e.target.value) || 0)}
                      required
                      placeholder="0.00"
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  </div>
                </div>

                {/* Pièces par carton */}
                <div>
                  <label className="md:hidden text-sm font-medium text-gray-700 mb-1 block">
                    Pcs/carton
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variante.pieces_carton ?? ''}
                    onChange={(e) => updateVariante(index, 'pieces_carton', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="-"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  />
                </div>

                {/* Poids carton */}
                <div>
                  <label className="md:hidden text-sm font-medium text-gray-700 mb-1 block">
                    Kg/carton
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={variante.poids_carton ?? ''}
                    onChange={(e) => updateVariante(index, 'poids_carton', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="-"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  />
                </div>

                {/* Disponibilité */}
                <div>
                  <label className="md:hidden text-sm font-medium text-gray-700 mb-1 block">
                    Disponibilité
                  </label>
                  <select
                    value={variante.disponibilite || 'disponible'}
                    onChange={(e) => updateVariante(index, 'disponibilite', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="indisponible">Indisponible</option>
                    <option value="masque">Masqué</option>
                  </select>
                </div>

                {/* Supprimer */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariante(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer cette variante"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Conseil :</strong> Créez une variante pour chaque conditionnement (ex: "Sachet 1kg" à 5.50€, "Carton 10kg" à 45.00€).
          Les clients verront ces options lors de la commande.
        </p>
      </div>
    </div>
  )
}
