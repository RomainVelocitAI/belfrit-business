import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/product-form'

export default async function NouveauProduitPage() {
  const supabase = await createClient()

  // Récupérer les catégories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('ordre')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading text-gray-900">Nouveau produit</h1>
        <p className="text-gray-500">Créez un nouveau produit avec ses variantes et photos</p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}
