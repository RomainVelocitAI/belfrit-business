'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Clock, Mail, Phone, LogOut, RefreshCw, Loader2 } from 'lucide-react'

export default function EnAttentePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [clientInfo, setClientInfo] = useState<{
    raison_sociale: string
    email: string
    created_at: string
  } | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/connexion')
      return
    }

    const { data: client } = await supabase
      .from('clients')
      .select('raison_sociale, email, statut, created_at')
      .eq('email', user.email)
      .single()

    if (!client) {
      router.push('/connexion')
      return
    }

    // Si le client est validé, rediriger vers l'espace client
    if (client.statut === 'actif') {
      router.push('/espace-client')
      return
    }

    // Si refusé ou suspendu, déconnecter
    if (client.statut === 'refuse' || client.statut === 'suspendu') {
      await supabase.auth.signOut()
      router.push('/connexion?error=account_blocked')
      return
    }

    setClientInfo({
      raison_sociale: client.raison_sociale,
      email: client.email,
      created_at: client.created_at,
    })
    setLoading(false)
  }

  const handleRefresh = async () => {
    setChecking(true)
    await checkStatus()
    setChecking(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-belfrit-shell flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-belfrit-red" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-belfrit-shell flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/3.png"
              alt="BelFrit Business"
              width={100}
              height={100}
              className="mx-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>

          <h1 className="text-2xl font-heading text-gray-900 mb-2">
            Compte en attente de validation
          </h1>

          {clientInfo && (
            <p className="text-gray-600 mb-6">
              <strong>{clientInfo.raison_sociale}</strong>
            </p>
          )}

          <p className="text-gray-600 mb-6">
            Votre demande d'inscription est en cours d'examen par notre équipe commerciale.
            Nous vérifions vos informations afin de vous offrir le meilleur service.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Délai moyen :</strong> 24 à 48h ouvrées
            </p>
          </div>

          {clientInfo && (
            <p className="text-xs text-gray-400 mb-6">
              Demande envoyée le {new Date(clientInfo.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              disabled={checking}
              className="w-full py-3 bg-belfrit-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              Vérifier le statut
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Une question ? Contactez-nous
          </h2>
          <div className="space-y-2">
            <a
              href="mailto:pro@belfrit.com"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-belfrit-red transition-colors"
            >
              <Mail className="w-4 h-4" />
              pro@belfrit.com
            </a>
            <a
              href="tel:+33320000000"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-belfrit-red transition-colors"
            >
              <Phone className="w-4 h-4" />
              03 20 XX XX XX
            </a>
          </div>
        </div>

        {/* Retour accueil */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-belfrit-red transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
