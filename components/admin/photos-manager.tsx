'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Star, ImageIcon } from 'lucide-react'
import type { PhotoProduit } from '@/types/database'

interface PhotosManagerProps {
  photos: Partial<PhotoProduit>[]
  photosToUpload: File[]
  photosToDelete: string[]
  onPhotosChange: (photos: Partial<PhotoProduit>[]) => void
  onPhotosToUploadChange: (files: File[]) => void
  onPhotosToDeleteChange: (ids: string[]) => void
}

export function PhotosManager({
  photos,
  photosToUpload,
  photosToDelete,
  onPhotosChange,
  onPhotosToUploadChange,
  onPhotosToDeleteChange,
}: PhotosManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onPhotosToUploadChange([...photosToUpload, ...files])
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeNewPhoto = (index: number) => {
    onPhotosToUploadChange(photosToUpload.filter((_, i) => i !== index))
  }

  const markForDeletion = (photoId: string) => {
    onPhotosToDeleteChange([...photosToDelete, photoId])
  }

  const undoDeletion = (photoId: string) => {
    onPhotosToDeleteChange(photosToDelete.filter((id) => id !== photoId))
  }

  const setPrincipal = (photoId: string) => {
    onPhotosChange(
      photos.map((p) => ({
        ...p,
        principale: p.id === photoId,
      }))
    )
  }

  // Photos existantes non supprimées
  const activePhotos = photos.filter((p) => p.id && !photosToDelete.includes(p.id))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Photos du produit</h3>
        <p className="text-sm text-gray-500">
          Ajoutez jusqu'à 5 photos. La photo principale sera utilisée comme miniature.
        </p>
      </div>

      {/* Zone d'upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-belfrit-red hover:bg-red-50 transition-colors"
      >
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-1">Cliquez pour ajouter des photos</p>
        <p className="text-sm text-gray-400">PNG, JPG, WEBP jusqu'à 5MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Grille des photos */}
      {(activePhotos.length > 0 || photosToUpload.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Photos existantes */}
          {photos.map((photo) => {
            if (!photo.id) return null
            const isDeleted = photosToDelete.includes(photo.id)

            return (
              <div
                key={photo.id}
                className={`relative group rounded-lg overflow-hidden border-2 ${
                  isDeleted
                    ? 'border-red-300 opacity-50'
                    : photo.principale
                    ? 'border-belfrit-yellow'
                    : 'border-gray-200'
                }`}
              >
                <div className="aspect-square bg-gray-100">
                  <Image
                    src={photo.photo_url || ''}
                    alt="Photo produit"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Boutons d'action (toujours visibles en bas à droite) */}
                {isDeleted ? (
                  <div className="absolute bottom-2 right-2">
                    <button
                      type="button"
                      onClick={() => undoDeletion(photo.id!)}
                      className="px-3 py-1 bg-white text-gray-700 rounded text-sm font-medium shadow hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {!photo.principale && (
                      <button
                        type="button"
                        onClick={() => setPrincipal(photo.id!)}
                        className="p-1.5 bg-white/90 text-yellow-600 rounded-full shadow hover:bg-white transition-colors"
                        title="Définir comme principale"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => markForDeletion(photo.id!)}
                      className="p-1.5 bg-white/90 text-red-600 rounded-full shadow hover:bg-white transition-colors"
                      title="Supprimer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Badge principale */}
                {photo.principale && !isDeleted && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-belfrit-yellow text-gray-900 text-xs font-medium rounded flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Principale
                  </div>
                )}

                {/* Badge suppression */}
                {isDeleted && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                    Supprimée
                  </div>
                )}
              </div>
            )
          })}

          {/* Nouvelles photos à uploader */}
          {photosToUpload.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative group rounded-lg overflow-hidden border-2 border-green-300"
            >
              <div className="aspect-square bg-gray-100">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Nouvelle photo ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Boutons d'action (toujours visibles) */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => removeNewPhoto(index)}
                  className="p-1.5 bg-white/90 text-red-600 rounded-full shadow hover:bg-white transition-colors"
                  title="Retirer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Badge nouvelle */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                Nouvelle
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message si aucune photo */}
      {activePhotos.length === 0 && photosToUpload.length === 0 && (
        <div className="text-center py-8 border border-gray-200 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune photo ajoutée</p>
        </div>
      )}

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Conseil :</strong> La première photo sera automatiquement définie comme principale lors de l'enregistrement.
          {photos.filter(p => p.id && !photosToDelete.includes(p.id)).length > 0 && (
            <> Cliquez sur l'étoile <Star className="w-3 h-3 inline text-yellow-600" /> d'une photo existante pour la définir comme principale.</>
          )}
        </p>
      </div>
    </div>
  )
}
