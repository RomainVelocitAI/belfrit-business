'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'

export default function AdminConnexionPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    // 1. Connexion Supabase Auth
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
      // 2. Vérifier si l'utilisateur est admin
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('id, nom, role, actif')
        .eq('email', data.user.email!)
        .single()

      console.log('Admin check:', { admin, adminError, userEmail: data.user.email })

      if (adminError || !admin) {
        // Pas admin → déconnexion + erreur
        await supabase.auth.signOut()
        setLoading(false)
        setError('Accès refusé. Ce compte n\'est pas autorisé à accéder au back-office.')
        return
      }

      if (!admin.actif) {
        // Admin désactivé
        await supabase.auth.signOut()
        setLoading(false)
        setError('Votre compte administrateur est désactivé. Contactez un administrateur.')
        return
      }

      // 3. Admin valide → redirection vers dashboard
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
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
          <div className="mt-4 flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-belfrit-yellow" />
            <h1 className="text-2xl font-heading text-white">
              Administration
            </h1>
          </div>
          <p className="mt-2 text-gray-400">
            Accès réservé aux administrateurs BelFrit
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-belfrit-yellow focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="admin@belfrit.re"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-belfrit-yellow focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-belfrit-yellow text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Retour */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-belfrit-yellow transition-colors">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
