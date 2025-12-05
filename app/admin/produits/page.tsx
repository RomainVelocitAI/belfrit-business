import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Filter, Package, Pencil } from 'lucide-react'
import { DeleteProductButton } from '@/components/admin/delete-product-button'
import { DisponibiliteToggle } from '@/components/admin/disponibilite-toggle'

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; disponibilite?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Récupérer les catégories pour le filtre
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('ordre')

  // Construire la requête produits
  let query = supabase
    .from('produits')
    .select(`
      *,
      categories (id, nom),
      variantes (id, nom, poids, prix_base, disponibilite, ordre),
      photos_produits (id, photo_url, principale, ordre)
    `)
    .order('created_at', { ascending: false })

  // Filtres
  if (params.categorie) {
    query = query.eq('categorie_id', params.categorie)
  }
  if (params.disponibilite) {
    query = query.eq('disponibilite', params.disponibilite)
  }
  if (params.search) {
    query = query.ilike('nom', `%${params.search}%`)
  }

  const { data: produits, error } = await query

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading text-gray-900">Produits</h1>
          <p className="text-gray-500">{produits?.length || 0} produit(s)</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un produit
        </Link>
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
          <div className="w-full md:w-48">
            <select
              name="categorie"
              defaultValue={params.categorie}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
            >
              <option value="">Toutes catégories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Disponibilité */}
          <div className="w-full md:w-40">
            <select
              name="disponibilite"
              defaultValue={params.disponibilite}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
            >
              <option value="">Tous statuts</option>
              <option value="disponible">Disponible</option>
              <option value="indisponible">Indisponible</option>
              <option value="masque">Masqué</option>
            </select>
          </div>

          {/* Bouton filtrer */}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </form>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {produits && produits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produits.map((produit: any) => {
                  const photoPrincipale = produit.photos_produits?.find((p: any) => p.principale)
                  const variantes = produit.variantes || []
                  const prixMin = variantes.length > 0 ? Math.min(...variantes.map((v: any) => v.prix_base)) : 0
                  const prixMax = variantes.length > 0 ? Math.max(...variantes.map((v: any) => v.prix_base)) : 0

                  return (
                    <tr key={produit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {photoPrincipale ? (
                              <Image
                                src={photoPrincipale.photo_url}
                                alt={produit.nom}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{produit.nom}</p>
                            {produit.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {produit.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {produit.categories?.nom || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {variantes.length} variante(s)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {variantes.length > 0 ? (
                            prixMin === prixMax ? (
                              `${prixMin.toFixed(2)} €`
                            ) : (
                              `${prixMin.toFixed(2)} - ${prixMax.toFixed(2)} €`
                            )
                          ) : (
                            '-'
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DisponibiliteToggle
                          productId={produit.id}
                          currentValue={produit.disponibilite}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/produits/${produit.id}`}
                            className="p-2 text-gray-500 hover:text-belfrit-red hover:bg-gray-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteProductButton productId={produit.id} productName={produit.nom} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
            <Link
              href="/admin/produits/nouveau"
              className="inline-flex items-center gap-2 px-4 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter votre premier produit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
