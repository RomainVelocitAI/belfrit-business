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

  // Récupérer le produit avec ses variantes et photos
  const { data: produit, error } = await supabase
    .from('produits')
    .select(`
      *,
      categories (id, nom),
      variantes (id, nom, poids, prix_base, disponibilite, ordre),
      photos_produits (id, photo_url, principale, ordre)
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
          {/* Catégorie */}
          {produit.categories && (
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {produit.categories.nom}
            </span>
          )}

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
        </div>
      </div>
    </div>
  )
}
