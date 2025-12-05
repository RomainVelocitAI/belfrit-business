'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FileText, Save, Loader2 } from 'lucide-react'

interface CommandeNotesProps {
  commandeId: string
  initialNotes: string
}

export function CommandeNotes({ commandeId, initialNotes }: CommandeNotesProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(initialNotes)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)

    const supabase = createClient()
    const { error } = await supabase
      .from('commandes')
      .update({
        commentaire: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commandeId)

    if (!error) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" />
        Notes internes
      </h2>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Ajoutez des notes internes sur cette commande..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent resize-none"
      />

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-400">
          Ces notes ne sont visibles que par les administrateurs.
        </p>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-belfrit-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
