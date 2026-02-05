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
  X,
} from 'lucide-react'
import type { Category, Produit, Variante, PhotoProduit, DisponibiliteType, Allergenes, ValeursNutritionnelles } from '@/types/database'

interface ProductFormProps {
  categories: Category[]
  produit?: Produit
  variantes?: Variante[]
  photos?: PhotoProduit[]
  valeursNutritionnelles?: ValeursNutritionnelles
}

export function ProductForm({ categories, produit, variantes = [], photos = [], valeursNutritionnelles }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!produit

  // État du formulaire
  const [nom, setNom] = useState(produit?.nom || '')
  const [description, setDescription] = useState(produit?.description || '')
  const [categorieId, setCategorieId] = useState(produit?.categorie_id || '')
  const [conditionnement, setConditionnement] = useState(produit?.conditionnement || '')
  const [disponibilite, setDisponibilite] = useState<DisponibiliteType>(produit?.disponibilite || 'disponible')
  const [refBelfrit, setRefBelfrit] = useState(produit?.ref_belfrit || '')
  const [refFournisseur, setRefFournisseur] = useState(produit?.ref_fournisseur || '')
  const [fournisseur, setFournisseur] = useState(produit?.fournisseur || '')
  const [labels, setLabels] = useState<string[]>(produit?.labels || [])
  const [newLabel, setNewLabel] = useState('')

  // Nouveaux champs produit
  const [ean, setEan] = useState(produit?.ean || '')
  const [paysOrigine, setPaysOrigine] = useState(produit?.pays_origine || '')
  const [nomLegal, setNomLegal] = useState(produit?.nom_legal || '')
  const [ingredients, setIngredients] = useState(produit?.ingredients || '')
  const [allergenes, setAllergenes] = useState<Allergenes>(
    produit?.allergenes || { contient: [], peut_contenir: [], sans: [] }
  )
  const [newAllergene, setNewAllergene] = useState({ contient: '', peut_contenir: '', sans: '' })
  const [preparation, setPreparation] = useState(produit?.preparation || '')
  const [conservation, setConservation] = useState(produit?.conservation || '')

  // Valeurs nutritionnelles
  const [nutrition, setNutrition] = useState({
    energie_kj: valeursNutritionnelles?.energie_kj ?? '',
    energie_kcal: valeursNutritionnelles?.energie_kcal ?? '',
    matieres_grasses: valeursNutritionnelles?.matieres_grasses ?? '',
    acides_gras_satures: valeursNutritionnelles?.acides_gras_satures ?? '',
    glucides: valeursNutritionnelles?.glucides ?? '',
    sucres: valeursNutritionnelles?.sucres ?? '',
    proteines: valeursNutritionnelles?.proteines ?? '',
    sel: valeursNutritionnelles?.sel ?? '',
    fibres: valeursNutritionnelles?.fibres ?? '',
  })

  const LABELS_SUGGESTIONS = ['Halal', 'Premium', 'Vegan']

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
  const [activeTab, setActiveTab] = useState<'infos' | 'details' | 'nutrition' | 'variantes' | 'photos'>('infos')

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
            ref_belfrit: refBelfrit || null,
            ref_fournisseur: refFournisseur || null,
            fournisseur: fournisseur || null,
            labels: labels.length > 0 ? labels : null,
            ean: ean || null,
            pays_origine: paysOrigine || null,
            nom_legal: nomLegal || null,
            ingredients: ingredients || null,
            allergenes: (allergenes.contient.length > 0 || allergenes.peut_contenir.length > 0 || allergenes.sans.length > 0) ? allergenes : null,
            preparation: preparation || null,
            conservation: conservation || null,
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
            ref_belfrit: refBelfrit || null,
            ref_fournisseur: refFournisseur || null,
            fournisseur: fournisseur || null,
            labels: labels.length > 0 ? labels : null,
            ean: ean || null,
            pays_origine: paysOrigine || null,
            nom_legal: nomLegal || null,
            ingredients: ingredients || null,
            allergenes: (allergenes.contient.length > 0 || allergenes.peut_contenir.length > 0 || allergenes.sans.length > 0) ? allergenes : null,
            preparation: preparation || null,
            conservation: conservation || null,
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
          pieces_carton: variante.pieces_carton ?? null,
          poids_carton: variante.poids_carton ?? null,
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

      // 4. Gérer les valeurs nutritionnelles
      const hasNutrition = Object.values(nutrition).some(v => v !== '' && v !== null)
      if (hasNutrition) {
        const nutritionData = {
          produit_id: produitId!,
          energie_kj: nutrition.energie_kj !== '' ? Number(nutrition.energie_kj) : null,
          energie_kcal: nutrition.energie_kcal !== '' ? Number(nutrition.energie_kcal) : null,
          matieres_grasses: nutrition.matieres_grasses !== '' ? Number(nutrition.matieres_grasses) : null,
          acides_gras_satures: nutrition.acides_gras_satures !== '' ? Number(nutrition.acides_gras_satures) : null,
          glucides: nutrition.glucides !== '' ? Number(nutrition.glucides) : null,
          sucres: nutrition.sucres !== '' ? Number(nutrition.sucres) : null,
          proteines: nutrition.proteines !== '' ? Number(nutrition.proteines) : null,
          sel: nutrition.sel !== '' ? Number(nutrition.sel) : null,
          fibres: nutrition.fibres !== '' ? Number(nutrition.fibres) : null,
        }
        await supabase
          .from('valeurs_nutritionnelles')
          .upsert(nutritionData, { onConflict: 'produit_id' })
      } else if (valeursNutritionnelles?.id) {
        await supabase
          .from('valeurs_nutritionnelles')
          .delete()
          .eq('produit_id', produitId!)
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
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-belfrit-red text-belfrit-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Détails
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nutrition')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'nutrition'
                  ? 'border-belfrit-red text-belfrit-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Nutrition
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

              {/* Références */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ref_belfrit" className="block text-sm font-medium text-gray-700 mb-2">
                    Référence BelFrit
                  </label>
                  <input
                    id="ref_belfrit"
                    type="text"
                    value={refBelfrit}
                    onChange={(e) => setRefBelfrit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="Ex: BF-001"
                  />
                </div>
                <div>
                  <label htmlFor="ref_fournisseur" className="block text-sm font-medium text-gray-700 mb-2">
                    Référence fournisseur
                  </label>
                  <input
                    id="ref_fournisseur"
                    type="text"
                    value={refFournisseur}
                    onChange={(e) => setRefFournisseur(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="Ex: P0000282"
                  />
                </div>
              </div>

              {/* Fournisseur */}
              <div>
                <label htmlFor="fournisseur" className="block text-sm font-medium text-gray-700 mb-2">
                  Fournisseur
                </label>
                <input
                  id="fournisseur"
                  type="text"
                  value={fournisseur}
                  onChange={(e) => setFournisseur(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Ex: Vanreusel, Oma Bobs"
                />
              </div>

              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labels
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {labels.map((label) => (
                    <span
                      key={label}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        label === 'Halal'
                          ? 'bg-green-100 text-green-800'
                          : label === 'Premium'
                          ? 'bg-amber-100 text-amber-800'
                          : label === 'Vegan'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => setLabels(labels.filter((l) => l !== label))}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {LABELS_SUGGESTIONS.filter((s) => !labels.includes(s)).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setLabels([...labels, suggestion])}
                      className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* EAN et Pays d'origine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ean" className="block text-sm font-medium text-gray-700 mb-2">
                    Code EAN
                  </label>
                  <input
                    id="ean"
                    type="text"
                    value={ean}
                    onChange={(e) => setEan(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="Ex: 5412345678901"
                  />
                </div>
                <div>
                  <label htmlFor="pays_origine" className="block text-sm font-medium text-gray-700 mb-2">
                    Pays d'origine
                  </label>
                  <input
                    id="pays_origine"
                    type="text"
                    value={paysOrigine}
                    onChange={(e) => setPaysOrigine(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="Ex: Belgique"
                  />
                </div>
              </div>

              {/* Dénomination légale */}
              <div>
                <label htmlFor="nom_legal" className="block text-sm font-medium text-gray-700 mb-2">
                  Dénomination légale
                </label>
                <input
                  id="nom_legal"
                  type="text"
                  value={nomLegal}
                  onChange={(e) => setNomLegal(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Ex: Frites précuites surgelées"
                />
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

          {/* Onglet Détails */}
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-2xl">
              {/* Ingrédients */}
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                  Ingrédients
                </label>
                <textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Liste des ingrédients..."
                />
              </div>

              {/* Allergènes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Allergènes
                </label>
                <div className="space-y-4">
                  {/* Contient */}
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">Contient</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {allergenes.contient.map((a) => (
                        <span key={a} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {a}
                          <button type="button" onClick={() => setAllergenes({ ...allergenes, contient: allergenes.contient.filter(x => x !== a) })} className="ml-1 hover:opacity-70">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAllergene.contient}
                        onChange={(e) => setNewAllergene({ ...newAllergene, contient: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const val = newAllergene.contient.trim()
                            if (val && !allergenes.contient.includes(val)) {
                              setAllergenes({ ...allergenes, contient: [...allergenes.contient, val] })
                              setNewAllergene({ ...newAllergene, contient: '' })
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent"
                        placeholder="Ajouter un allergène (Entrée)..."
                      />
                    </div>
                  </div>

                  {/* Peut contenir */}
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 mb-2">Peut contenir (traces)</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {allergenes.peut_contenir.map((a) => (
                        <span key={a} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                          {a}
                          <button type="button" onClick={() => setAllergenes({ ...allergenes, peut_contenir: allergenes.peut_contenir.filter(x => x !== a) })} className="ml-1 hover:opacity-70">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAllergene.peut_contenir}
                        onChange={(e) => setNewAllergene({ ...newAllergene, peut_contenir: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const val = newAllergene.peut_contenir.trim()
                            if (val && !allergenes.peut_contenir.includes(val)) {
                              setAllergenes({ ...allergenes, peut_contenir: [...allergenes.peut_contenir, val] })
                              setNewAllergene({ ...newAllergene, peut_contenir: '' })
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        placeholder="Ajouter une trace (Entrée)..."
                      />
                    </div>
                  </div>

                  {/* Sans */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">Sans</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {allergenes.sans.map((a) => (
                        <span key={a} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {a}
                          <button type="button" onClick={() => setAllergenes({ ...allergenes, sans: allergenes.sans.filter(x => x !== a) })} className="ml-1 hover:opacity-70">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAllergene.sans}
                        onChange={(e) => setNewAllergene({ ...newAllergene, sans: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const val = newAllergene.sans.trim()
                            if (val && !allergenes.sans.includes(val)) {
                              setAllergenes({ ...allergenes, sans: [...allergenes.sans, val] })
                              setNewAllergene({ ...newAllergene, sans: '' })
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-sm border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                        placeholder="Ajouter (Entrée)..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Préparation */}
              <div>
                <label htmlFor="preparation" className="block text-sm font-medium text-gray-700 mb-2">
                  Préparation
                </label>
                <textarea
                  id="preparation"
                  value={preparation}
                  onChange={(e) => setPreparation(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Instructions de préparation..."
                />
              </div>

              {/* Conservation */}
              <div>
                <label htmlFor="conservation" className="block text-sm font-medium text-gray-700 mb-2">
                  Conservation
                </label>
                <textarea
                  id="conservation"
                  value={conservation}
                  onChange={(e) => setConservation(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  placeholder="Conditions de conservation..."
                />
              </div>
            </div>
          )}

          {/* Onglet Nutrition */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6 max-w-2xl">
              <p className="text-sm text-gray-500">
                Valeurs nutritionnelles moyennes pour 100g. Laissez vide si non applicable.
              </p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nutriment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valeur pour 100g</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { key: 'energie_kj', label: 'Énergie (kJ)', unit: 'kJ' },
                      { key: 'energie_kcal', label: 'Énergie (kcal)', unit: 'kcal' },
                      { key: 'matieres_grasses', label: 'Matières grasses', unit: 'g' },
                      { key: 'acides_gras_satures', label: '  dont acides gras saturés', unit: 'g' },
                      { key: 'glucides', label: 'Glucides', unit: 'g' },
                      { key: 'sucres', label: '  dont sucres', unit: 'g' },
                      { key: 'proteines', label: 'Protéines', unit: 'g' },
                      { key: 'sel', label: 'Sel', unit: 'g' },
                      { key: 'fibres', label: 'Fibres', unit: 'g' },
                    ].map(({ key, label, unit }) => (
                      <tr key={key} className={label.startsWith('  ') ? 'bg-gray-50/50' : ''}>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {label.startsWith('  ') ? (
                            <span className="pl-4 italic">{label.trim()}</span>
                          ) : (
                            <span className="font-medium">{label}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={nutrition[key as keyof typeof nutrition]}
                              onChange={(e) => setNutrition({ ...nutrition, [key]: e.target.value })}
                              className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                              placeholder="—"
                            />
                            <span className="text-sm text-gray-500">{unit}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
