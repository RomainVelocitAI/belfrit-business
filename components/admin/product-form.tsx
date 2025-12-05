'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { VariantesManager } from './variantes-manager'
import { PhotosManager } from './photos-manager'
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  AlertCircle,
} from 'lucide-react'
import type { Category, Produit, Variante, PhotoProduit, DisponibiliteType } from '@/types/database'

interface ProductFormProps {
  categories: Category[]
  produit?: Produit
  variantes?: Variante[]
  photos?: PhotoProduit[]
}

export function ProductForm({ categories, produit, variantes = [], photos = [] }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!produit

  // État du formulaire
  const [nom, setNom] = useState(produit?.nom || '')
  const [description, setDescription] = useState(produit?.description || '')
  const [categorieId, setCategorieId] = useState(produit?.categorie_id || '')
  const [conditionnement, setConditionnement] = useState(produit?.conditionnement || '')
  const [disponibilite, setDisponibilite] = useState<DisponibiliteType>(produit?.disponibilite || 'disponible')

  // État des variantes et photos
  const [localVariantes, setLocalVariantes] = useState<Partial<Variante>[]>(
    variantes.length > 0 ? variantes : []
  )
  const [localPhotos, setLocalPhotos] = useState<Partial<PhotoProduit>[]>(photos)
  const [photosToUpload, setPhotosToUpload] = useState<File[]>([])
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([])

  // État UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'infos' | 'variantes' | 'photos'>('infos')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (!nom.trim()) {
      setError('Le nom du produit est requis')
      setLoading(false)
      return
    }
    if (!categorieId) {
      setError('Veuillez sélectionner une catégorie')
      setLoading(false)
      return
    }
    if (localVariantes.length === 0) {
      setError('Ajoutez au moins une variante (conditionnement)')
      setLoading(false)
      setActiveTab('variantes')
      return
    }

    const supabase = createClient()

    try {
      let produitId = produit?.id

      // 1. Créer ou mettre à jour le produit
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('produits')
          .update({
            nom,
            description: description || null,
            categorie_id: categorieId,
            conditionnement: conditionnement || null,
            disponibilite,
            updated_at: new Date().toISOString(),
          })
          .eq('id', produitId)

        if (updateError) throw updateError
      } else {
        const { data: newProduit, error: insertError } = await supabase
          .from('produits')
          .insert({
            nom,
            description: description || null,
            categorie_id: categorieId,
            conditionnement: conditionnement || null,
            disponibilite,
          })
          .select()
          .single()

        if (insertError) throw insertError
        produitId = newProduit.id
      }

      // 2. Gérer les variantes
      // Supprimer les variantes existantes qui ne sont plus là
      if (isEditing) {
        const existingIds = localVariantes.filter(v => v.id).map(v => v.id)
        const variantesToDelete = variantes.filter(v => !existingIds.includes(v.id))

        for (const v of variantesToDelete) {
          await supabase.from('variantes').delete().eq('id', v.id)
        }
      }

      // Insérer/mettre à jour les variantes
      for (let i = 0; i < localVariantes.length; i++) {
        const variante = localVariantes[i]
        const varianteData = {
          produit_id: produitId,
          nom: variante.nom || '',
          poids: variante.poids || null,
          prix_base: variante.prix_base || 0,
          disponibilite: variante.disponibilite || 'disponible',
          ordre: i + 1,
        }

        if (variante.id) {
          // Mise à jour
          await supabase.from('variantes').update(varianteData).eq('id', variante.id)
        } else {
          // Insertion
          await supabase.from('variantes').insert(varianteData)
        }
      }

      // 3. Gérer les photos
      // Supprimer les photos marquées pour suppression
      for (const photoId of photosToDelete) {
        const photo = photos.find(p => p.id === photoId)
        if (photo) {
          // Supprimer du storage
          const fileName = photo.photo_url.split('/').pop()
          if (fileName) {
            await supabase.storage.from('produits').remove([`${produitId}/${fileName}`])
          }
          // Supprimer de la BDD
          await supabase.from('photos_produits').delete().eq('id', photoId)
        }
      }

      // Upload des nouvelles photos
      for (let i = 0; i < photosToUpload.length; i++) {
        const file = photosToUpload[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${i}.${fileExt}`
        const filePath = `${produitId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('produits')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        // Récupérer l'URL publique
        const { data: urlData } = supabase.storage.from('produits').getPublicUrl(filePath)

        // Insérer dans la BDD
        const isFirst = localPhotos.length === 0 && i === 0
        await supabase.from('photos_produits').insert({
          produit_id: produitId,
          photo_url: urlData.publicUrl,
          principale: isFirst,
          ordre: localPhotos.length + i + 1,
        })
      }

      // Mettre à jour l'ordre et la photo principale des photos existantes
      for (let i = 0; i < localPhotos.length; i++) {
        const photo = localPhotos[i]
        if (photo.id && !photosToDelete.includes(photo.id)) {
          await supabase
            .from('photos_produits')
            .update({
              principale: photo.principale || false,
              ordre: i + 1,
            })
            .eq('id', photo.id)
        }
      }

      // Rediriger vers la liste
      router.push('/admin/produits')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving product:', err)
      setError(err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Navigation retour */}
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </Link>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              type="button"
              onClick={() => setActiveTab('infos')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'infos'
                  ? 'border-belfrit-red text-belfrit-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Informations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('variantes')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'variantes'
                  ? 'border-belfrit-red text-belfrit-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Variantes ({localVariantes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'photos'
                  ? 'border-belfrit-red text-belfrit-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Photos ({localPhotos.length - photosToDelete.length + photosToUpload.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Informations */}
          {activeTab === 'infos' && (
            <div className="space-y-6 max-w-2xl">
              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  id="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Ex: Frites Belges Tradition"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Description courte du produit..."
                />
              </div>

              {/* Catégorie */}
              <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  id="categorie"
                  value={categorieId}
                  onChange={(e) => setCategorieId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditionnement général */}
              <div>
                <label htmlFor="conditionnement" className="block text-sm font-medium text-gray-700 mb-2">
                  Conditionnement (description générale)
                </label>
                <input
                  id="conditionnement"
                  type="text"
                  value={conditionnement}
                  onChange={(e) => setConditionnement(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Ex: Disponible en sachets et cartons"
                />
              </div>

              {/* Disponibilité */}
              <div>
                <label htmlFor="disponibilite" className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité
                </label>
                <select
                  id="disponibilite"
                  value={disponibilite}
                  onChange={(e) => setDisponibilite(e.target.value as DisponibiliteType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                >
                  <option value="disponible">Disponible</option>
                  <option value="indisponible">Indisponible (temporaire)</option>
                  <option value="masque">Masqué (non visible)</option>
                </select>
              </div>
            </div>
          )}

          {/* Onglet Variantes */}
          {activeTab === 'variantes' && (
            <VariantesManager
              variantes={localVariantes}
              onChange={setLocalVariantes}
            />
          )}

          {/* Onglet Photos */}
          {activeTab === 'photos' && (
            <PhotosManager
              photos={localPhotos}
              photosToUpload={photosToUpload}
              photosToDelete={photosToDelete}
              onPhotosChange={setLocalPhotos}
              onPhotosToUploadChange={setPhotosToUpload}
              onPhotosToDeleteChange={setPhotosToDelete}
            />
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-end gap-4">
        <Link
          href="/admin/produits"
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {isEditing ? 'Enregistrer les modifications' : 'Créer le produit'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
