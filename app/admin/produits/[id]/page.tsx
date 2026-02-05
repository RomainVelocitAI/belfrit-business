import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'
import { notFound } from 'next/navigation'

export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Récupérer le produit avec ses variantes, photos et valeurs nutritionnelles
  const { data: produit, error } = await supabase
    .from('produits')
    .select(`
      *,
      variantes (id, nom, poids, prix_base, disponibilite, ordre, pieces_carton, poids_carton),
      photos_produits (id, photo_url, principale, ordre),
      valeurs_nutritionnelles (*)
    `)
    .eq('id', id)
    .single()

  if (error || !produit) {
    notFound()
  }

  // Récupérer les catégories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('ordre')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading text-gray-900">Modifier le produit</h1>
        <p className="text-gray-500">{produit.nom}</p>
      </div>

      <ProductForm
        categories={categories || []}
        produit={produit}
        variantes={produit.variantes || []}
        photos={produit.photos_produits || []}
        valeursNutritionnelles={produit.valeurs_nutritionnelles || undefined}
      />
    </div>
  )
}
