import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package, ShoppingCart, Check } from 'lucide-react'
import { AddToCartForm } from '@/components/client/add-to-cart-form'

export default async function ProduitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Récupérer l'utilisateur et son client
  const { data: { user } } = await supabase.auth.getUser()
  const { data: client } = await supabase
    .from('clients')
    .select('pourcentage_remise')
    .eq('email', user?.email)
    .single()

  const remise = client?.pourcentage_remise || 0

  // Récupérer le produit avec ses variantes, photos et valeurs nutritionnelles
  const { data: produit, error } = await supabase
    .from('produits')
    .select(`
      *,
      categories (id, nom),
      variantes (id, nom, poids, prix_base, disponibilite, ordre, pieces_carton, poids_carton),
      photos_produits (id, photo_url, principale, ordre),
      valeurs_nutritionnelles (*)
    `)
    .eq('id', id)
    .eq('disponibilite', 'disponible')
    .single()

  if (error || !produit) {
    notFound()
  }

  // Trier les variantes par ordre
  const variantesDisponibles = (produit.variantes || [])
    .filter((v: any) => v.disponibilite === 'disponible')
    .sort((a: any, b: any) => a.ordre - b.ordre)

  // Trier les photos par ordre
  const photos = (produit.photos_produits || []).sort((a: any, b: any) => a.ordre - b.ordre)
  const photoPrincipale = photos.find((p: any) => p.principale) || photos[0]

  // Calculer le prix avec remise
  const getPrixRemise = (prix: number) => {
    if (remise > 0) {
      return prix * (1 - remise / 100)
    }
    return prix
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Link
        href="/espace-client"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {/* Image principale */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
            {photoPrincipale ? (
              <Image
                src={photoPrincipale.photo_url}
                alt={produit.nom}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-300" />
              </div>
            )}
          </div>

          {/* Miniatures */}
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photos.map((photo: any) => (
                <div
                  key={photo.id}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    photo.id === photoPrincipale?.id ? 'border-belfrit-red' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={photo.photo_url}
                    alt=""
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails produit */}
        <div className="space-y-6">
          {/* Catégorie et labels */}
          <div className="flex flex-wrap items-center gap-2">
            {produit.categories && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {produit.categories.nom}
              </span>
            )}
            {produit.labels && produit.labels.map((label: string) => (
              <span
                key={label}
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  label === 'Halal'
                    ? 'bg-green-500 text-white'
                    : label === 'Premium'
                    ? 'bg-amber-400 text-amber-900'
                    : label === 'Vegan'
                    ? 'bg-emerald-400 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Nom et description */}
          <div>
            <h1 className="text-2xl font-heading text-gray-900 mb-2">{produit.nom}</h1>
            {produit.description && (
              <p className="text-gray-600">{produit.description}</p>
            )}
          </div>

          {/* Remise info */}
          {remise > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <Check className="w-4 h-4 inline mr-1" />
                Votre remise de <strong>{remise}%</strong> est appliquée
              </p>
            </div>
          )}

          {/* Formulaire de commande */}
          <AddToCartForm
            produit={produit}
            variantes={variantesDisponibles}
            remise={remise}
          />

          {/* Conditionnement */}
          {produit.conditionnement && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Conditionnement :</strong> {produit.conditionnement}
              </p>
            </div>
          )}

          {/* Informations produit */}
          {(produit.nom_legal || produit.pays_origine || produit.ean) && (
            <div className="pt-4 border-t border-gray-200 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Informations produit</h3>
              {produit.nom_legal && (
                <p className="text-sm text-gray-600">
                  <strong>Dénomination légale :</strong> {produit.nom_legal}
                </p>
              )}
              {produit.pays_origine && (
                <p className="text-sm text-gray-600">
                  <strong>Pays d'origine :</strong> {produit.pays_origine}
                </p>
              )}
              {produit.ean && (
                <p className="text-sm text-gray-600">
                  <strong>EAN :</strong> <span className="font-mono">{produit.ean}</span>
                </p>
              )}
            </div>
          )}

          {/* Ingrédients */}
          {produit.ingredients && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Ingrédients</h3>
              <p className="text-sm text-gray-600">{produit.ingredients}</p>
            </div>
          )}

          {/* Allergènes */}
          {produit.allergenes && (produit.allergenes.contient?.length > 0 || produit.allergenes.peut_contenir?.length > 0 || produit.allergenes.sans?.length > 0) && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Allergènes</h3>
              <div className="space-y-2">
                {produit.allergenes.contient?.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <strong className="text-red-700">Contient :</strong>{' '}
                    {produit.allergenes.contient.join(', ')}
                  </p>
                )}
                {produit.allergenes.peut_contenir?.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="italic text-amber-700">Peut contenir :</span>{' '}
                    {produit.allergenes.peut_contenir.join(', ')}
                  </p>
                )}
                {produit.allergenes.sans?.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="text-green-700">Sans :</span>{' '}
                    {produit.allergenes.sans.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Préparation */}
          {produit.preparation && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Préparation</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{produit.preparation}</p>
            </div>
          )}

          {/* Conservation */}
          {produit.conservation && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Conservation</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{produit.conservation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Valeurs nutritionnelles */}
      {produit.valeurs_nutritionnelles && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Valeurs nutritionnelles pour 100g</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden max-w-md">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {[
                  { label: 'Énergie', value: produit.valeurs_nutritionnelles.energie_kj, unit: 'kJ' },
                  { label: 'Énergie', value: produit.valeurs_nutritionnelles.energie_kcal, unit: 'kcal' },
                  { label: 'Matières grasses', value: produit.valeurs_nutritionnelles.matieres_grasses, unit: 'g' },
                  { label: 'dont acides gras saturés', value: produit.valeurs_nutritionnelles.acides_gras_satures, unit: 'g', indent: true },
                  { label: 'Glucides', value: produit.valeurs_nutritionnelles.glucides, unit: 'g' },
                  { label: 'dont sucres', value: produit.valeurs_nutritionnelles.sucres, unit: 'g', indent: true },
                  { label: 'Protéines', value: produit.valeurs_nutritionnelles.proteines, unit: 'g' },
                  { label: 'Sel', value: produit.valeurs_nutritionnelles.sel, unit: 'g' },
                  { label: 'Fibres', value: produit.valeurs_nutritionnelles.fibres, unit: 'g' },
                ].filter(row => row.value !== null && row.value !== undefined).map((row) => (
                  <tr key={row.label + row.unit}>
                    <td className={`px-4 py-2 text-sm ${row.indent ? 'pl-8 italic text-gray-500' : 'font-medium text-gray-700'}`}>
                      {row.label}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {row.value} {row.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
