import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Package, ShoppingCart, Plus, Minus } from 'lucide-react'
import { AddToCartButton } from '@/components/client/add-to-cart-button'

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Récupérer l'utilisateur et son client
  const { data: { user } } = await supabase.auth.getUser()
  const { data: client } = await supabase
    .from('clients')
    .select('pourcentage_remise')
    .eq('email', user?.email)
    .single()

  const remise = client?.pourcentage_remise || 0

  // Récupérer les catégories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('ordre')

  // Construire la requête produits (seulement disponibles)
  let query = supabase
    .from('produits')
    .select(`
      *,
      categories (id, nom),
      variantes (id, nom, poids, prix_base, disponibilite, ordre),
      photos_produits (id, photo_url, principale, ordre)
    `)
    .eq('disponibilite', 'disponible')
    .order('nom')

  // Filtres
  if (params.categorie) {
    query = query.eq('categorie_id', params.categorie)
  }
  if (params.search) {
    query = query.ilike('nom', `%${params.search}%`)
  }

  const { data: produits } = await query

  // Filtrer les produits qui ont au moins une variante disponible
  const produitsDisponibles = produits?.filter((p: any) =>
    p.variantes?.some((v: any) => v.disponibilite === 'disponible')
  ) || []

  // Calculer le prix avec remise
  const getPrixRemise = (prix: number) => {
    if (remise > 0) {
      return prix * (1 - remise / 100)
    }
    return prix
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">Catalogue</h1>
          <p className="text-gray-500">{produitsDisponibles.length} produit(s) disponible(s)</p>
        </div>
        {remise > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <p className="text-sm text-green-800">
              Votre remise de <strong>{remise}%</strong> est appliquée sur tous les prix
            </p>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="w-full md:w-56">
            <select
              name="categorie"
              defaultValue={params.categorie}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton filtrer */}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </form>
      </div>

      {/* Grille produits */}
      {produitsDisponibles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produitsDisponibles.map((produit: any) => {
            const photoPrincipale = produit.photos_produits?.find((p: any) => p.principale) || produit.photos_produits?.[0]
            const variantesDisponibles = produit.variantes?.filter((v: any) => v.disponibilite === 'disponible') || []
            const prixMin = variantesDisponibles.length > 0
              ? Math.min(...variantesDisponibles.map((v: any) => v.prix_base))
              : 0
            const prixMax = variantesDisponibles.length > 0
              ? Math.max(...variantesDisponibles.map((v: any) => v.prix_base))
              : 0

            return (
              <div
                key={produit.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="aspect-square bg-gray-100 relative">
                  {photoPrincipale ? (
                    <Image
                      src={photoPrincipale.photo_url}
                      alt={produit.nom}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}

                  {/* Badge catégorie */}
                  {produit.categories && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 text-gray-700 text-xs rounded-full">
                      {produit.categories.nom}
                    </span>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{produit.nom}</h3>
                  {produit.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{produit.description}</p>
                  )}

                  {/* Prix */}
                  <div className="mb-3">
                    {remise > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-belfrit-red">
                          {prixMin === prixMax
                            ? `${getPrixRemise(prixMin).toFixed(2)} €`
                            : `${getPrixRemise(prixMin).toFixed(2)} - ${getPrixRemise(prixMax).toFixed(2)} €`
                          }
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {prixMin === prixMax
                            ? `${prixMin.toFixed(2)} €`
                            : `${prixMin.toFixed(2)} - ${prixMax.toFixed(2)} €`
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {prixMin === prixMax
                          ? `${prixMin.toFixed(2)} €`
                          : `${prixMin.toFixed(2)} - ${prixMax.toFixed(2)} €`
                        }
                      </span>
                    )}
                    <p className="text-xs text-gray-400">
                      {variantesDisponibles.length} conditionnement(s)
                    </p>
                  </div>

                  {/* Variantes et ajout panier */}
                  <Link
                    href={`/espace-client/produit/${produit.id}`}
                    className="block w-full py-2 text-center bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Voir les conditionnements
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
          {params.search || params.categorie ? (
            <Link
              href="/espace-client"
              className="text-belfrit-red hover:underline"
            >
              Voir tous les produits
            </Link>
          ) : null}
        </div>
      )}
    </div>
  )
}
