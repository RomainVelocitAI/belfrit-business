'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/espace-client'
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const getInitialError = () => {
    switch (errorParam) {
      case 'unauthorized':
        return 'Accès non autorisé. Veuillez vous connecter.'
      case 'account_blocked':
        return 'Votre compte a été refusé ou suspendu.'
      default:
        return null
    }
  }

  const [error, setError] = useState<string | null>(getInitialError())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setLoading(false)
      if (authError.message === 'Invalid login credentials') {
        setError('Email ou mot de passe incorrect')
      } else {
        setError(authError.message)
      }
      return
    }

    if (data.user) {
      console.log('User logged in:', data.user.email)

      // Vérifier si admin
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('id, actif')
        .eq('email', data.user.email)
        .single()

      console.log('Admin check:', { admin, adminError })

      if (admin && admin.actif) {
        router.push('/admin')
        router.refresh()
        return
      }

      // Vérifier si client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id, statut')
        .eq('email', data.user.email)
        .single()

      console.log('Client check:', { client, clientError })

      if (client) {
        if (client.statut === 'actif') {
          router.push(redirectTo)
        } else if (client.statut === 'en_attente') {
          router.push('/en-attente')
        } else if (client.statut === 'suspendu') {
          setError('Votre compte est suspendu. Contactez-nous pour plus d\'informations.')
          await supabase.auth.signOut()
          setLoading(false)
          return
        } else {
          setError('Votre demande d\'inscription a été refusée.')
          await supabase.auth.signOut()
          setLoading(false)
          return
        }
        router.refresh()
        return
      }

      // Ni admin ni client trouvé
      setError('Aucun compte associé à cet email')
      await supabase.auth.signOut()
      setLoading(false)
    }
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
              width={120}
              height={120}
              className="mx-auto"
            />
          </Link>
          <h1 className="mt-4 text-2xl font-heading text-belfrit-black">
            Espace Professionnel
          </h1>
          <p className="mt-2 text-gray-600">
            Connectez-vous à votre compte B2B
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-belfrit-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Lien mot de passe oublié */}
          <div className="mt-4 text-center">
            <Link
              href="/mot-de-passe-oublie"
              className="text-sm text-belfrit-red hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Séparateur */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Lien inscription */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">Pas encore de compte professionnel ?</p>
            <Link
              href="/inscription"
              className="inline-block px-6 py-3 border-2 border-belfrit-red text-belfrit-red font-semibold rounded-lg hover:bg-belfrit-red hover:text-white transition-colors"
            >
              Créer un compte B2B
            </Link>
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

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-belfrit-shell flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-belfrit-red" />
      </div>
    }>
      <ConnexionForm />
    </Suspense>
  )
}
