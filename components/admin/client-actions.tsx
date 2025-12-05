'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  MoreHorizontal,
  Eye,
  Pencil,
  ShoppingBag,
  Percent,
  X,
  Loader2,
  Save,
  MapPin,
  Building2,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  File,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import type { Client, ZoneLivraison } from '@/types/database'

interface ClientActionsProps {
  client: Client & { zones_livraison?: ZoneLivraison | null }
  zones: ZoneLivraison[]
}

export function ClientActions({ client, zones }: ClientActionsProps) {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRemiseModal, setShowRemiseModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Form states
  const [loading, setLoading] = useState(false)
  const [remise, setRemise] = useState<number>(client.pourcentage_remise ?? 0)
  const [zoneId, setZoneId] = useState(client.zone_livraison_id || '')
  const [notes, setNotes] = useState(client.notes_internes || '')

  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 160,
      })
    }
  }, [isMenuOpen])

  const handleSaveRemise = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('clients')
      .update({
        pourcentage_remise: remise,
        updated_at: new Date().toISOString()
      })
      .eq('id', client.id)

    if (!error) {
      router.refresh()
      setShowRemiseModal(false)
    }
    setLoading(false)
  }

  const handleSaveEdit = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('clients')
      .update({
        zone_livraison_id: zoneId || null,
        notes_internes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', client.id)

    if (!error) {
      router.refresh()
      setShowEditModal(false)
    }
    setLoading(false)
  }

  const getTypeStructureLabel = (type: string | null) => {
    switch (type) {
      case 'restaurant': return 'Restaurant'
      case 'snack': return 'Snack/Friterie'
      case 'hotel': return 'Hôtel'
      case 'commerce': return 'Commerce'
      default: return '-'
    }
  }

  // Extraire le nom du fichier depuis l'URL Supabase Storage
  const extractFileNameFromUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      return pathParts[pathParts.length - 1]
    } catch {
      return null
    }
  }

  const handleDeleteClient = async () => {
    setDeleting(true)
    const supabase = createClient()

    try {
      // 1. Vérifier si le client a des commandes
      const { count } = await supabase
        .from('commandes')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', client.id)

      if (count && count > 0) {
        // Client a des commandes : passer en suspendu au lieu de supprimer
        const { error: updateError } = await supabase
          .from('clients')
          .update({ statut: 'suspendu' })
          .eq('id', client.id)

        if (updateError) {
          alert(`Erreur: ${updateError.message}`)
          return
        }

        alert('Ce client a des commandes associées. Son compte a été suspendu.')
        setShowDeleteModal(false)
        router.refresh()
        return
      }

      // 2. Pas de commandes : supprimer le KBIS du Storage si présent
      if (client.kbis_url) {
        const fileName = extractFileNameFromUrl(client.kbis_url)
        if (fileName) {
          await supabase.storage.from('kbis').remove([fileName])
        }
      }

      // 3. Supprimer le client de la BDD
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id)

      if (error) {
        console.error('Error deleting client:', error)
        alert(`Erreur lors de la suppression: ${error.message}`)
        return
      }

      // 4. Succès
      setShowDeleteModal(false)
      router.refresh()
    } catch (err: any) {
      console.error('Delete error:', err)
      alert(`Erreur: ${err.message || 'Erreur lors de la suppression'}`)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {/* Menu déroulant */}
      {isMenuOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999] min-w-[160px]"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                setShowDetailsModal(true)
              }}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              Voir détails
            </button>
            {client.kbis_url && (
              <a
                href={client.kbis_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 text-blue-600"
              >
                <File className="w-4 h-4" />
                Voir le KBIS
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                setShowEditModal(true)
              }}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
            >
              <Pencil className="w-4 h-4" />
              Modifier
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                setShowRemiseModal(true)
              }}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
            >
              <Percent className="w-4 h-4" />
              Modifier remise
            </button>
            <hr className="my-1" />
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                router.push(`/admin/clients/${client.id}/commandes`)
              }}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
            >
              <ShoppingBag className="w-4 h-4" />
              Voir commandes
            </button>
            <hr className="my-1" />
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                setShowDeleteModal(true)
              }}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </>,
        document.body
      )}

      {/* Modal Détails */}
      {showDetailsModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailsModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-heading text-gray-900">Détails du client</h2>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Infos entreprise */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Entreprise
                </h3>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">{client.raison_sociale}</p>
                  <p className="text-sm text-gray-600">{getTypeStructureLabel(client.type_structure)}</p>
                  {client.siret && (
                    <p className="text-sm text-gray-500">SIRET: {client.siret}</p>
                  )}
                  {client.kbis_url && (
                    <a
                      href={client.kbis_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <File className="w-4 h-4" />
                      Voir le KBIS
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </h3>
                <div className="space-y-2">
                  {client.contact_nom && (
                    <p className="text-sm text-gray-900">{client.contact_prenom} {client.contact_nom}</p>
                  )}
                  <p className="text-sm text-gray-600">{client.email}</p>
                  {client.telephone && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {client.telephone}
                    </p>
                  )}
                </div>
              </div>

              {/* Adresses */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresses
                </h3>
                <div className="space-y-3">
                  {client.adresse_facturation && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Facturation</p>
                      <p className="text-sm text-gray-900">{client.adresse_facturation}</p>
                    </div>
                  )}
                  {client.adresse_livraison && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Livraison</p>
                      <p className="text-sm text-gray-900">{client.adresse_livraison}</p>
                    </div>
                  )}
                  {client.code_postal && (
                    <p className="text-sm text-gray-600">{client.code_postal} {client.ville}</p>
                  )}
                </div>
              </div>

              {/* Zone et remise */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-1">Zone de livraison</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client.zones_livraison?.nom || 'Non définie'}
                  </p>
                </div>
                <div className="bg-belfrit-yellow/10 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-1">Remise</p>
                  <p className="text-2xl font-bold text-gray-900">{client.pourcentage_remise}%</p>
                </div>
              </div>

              {/* Notes */}
              {client.notes_internes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes internes
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{client.notes_internes}</p>
                </div>
              )}

              {/* Date inscription */}
              <div className="text-xs text-gray-400 pt-4 border-t">
                Inscrit le {new Date(client.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Modifier */}
      {showEditModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-heading text-gray-900">Modifier le client</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone de livraison
                </label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                >
                  <option value="">Aucune zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes internes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Notes visibles uniquement par les admins..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={loading}
                className="px-4 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Remise */}
      {showRemiseModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRemiseModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-heading text-gray-900">Modifier la remise</h2>
              <button
                type="button"
                onClick={() => setShowRemiseModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Client : <strong>{client.raison_sociale}</strong>
              </p>

              <div>
                <label htmlFor="remise-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage de remise
                </label>
                <div className="relative">
                  <input
                    id="remise-input"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={remise}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value)
                      setRemise(Math.min(100, Math.max(0, val)))
                    }}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Cette remise sera appliquée sur toutes les commandes du client.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRemiseModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveRemise}
                disabled={loading}
                className="px-4 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Suppression */}
      {showDeleteModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => !deleting && setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <h2 className="text-lg font-heading text-gray-900 text-center mb-2">
                Supprimer ce client ?
              </h2>

              <p className="text-sm text-gray-600 text-center mb-4">
                Vous êtes sur le point de supprimer <strong>{client.raison_sociale}</strong>.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-700">
                  Cette action est irréversible. Le client, son KBIS et toutes ses données seront définitivement supprimés.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClient}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
