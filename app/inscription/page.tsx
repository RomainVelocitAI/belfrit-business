'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle,
  FileText,
  Upload,
  X,
  File,
} from 'lucide-react'
import type { ZoneLivraison, TypeStructure } from '@/types/database'

export default function InscriptionPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zones, setZones] = useState<ZoneLivraison[]>([])

  // Champs formulaire
  const [raisonSociale, setRaisonSociale] = useState('')
  const [typeStructure, setTypeStructure] = useState<TypeStructure | ''>('')
  const [siret, setSiret] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [contactNom, setContactNom] = useState('')
  const [contactPrenom, setContactPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [ville, setVille] = useState('')
  const [zoneId, setZoneId] = useState('')

  // KBIS upload
  const [kbisFile, setKbisFile] = useState<File | null>(null)
  const [kbisPreview, setKbisPreview] = useState<string | null>(null)
  const [kbisUploading, setKbisUploading] = useState(false)

  // Charger les zones de livraison
  useEffect(() => {
    const loadZones = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('zones_livraison')
        .select('*')
        .eq('actif', true)
        .order('nom')

      if (data) {
        setZones(data)
      }
    }
    loadZones()
  }, [])

  // Validation SIRET (14 chiffres)
  const validateSiret = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    return /^\d{14}$/.test(cleaned)
  }

  // Formatage SIRET
  const formatSiret = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 14)
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4').trim()
  }

  // Gestion upload KBIS
  const handleKbisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez PDF, JPG ou PNG.')
      return
    }

    // Validation taille (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux (max 10 Mo)')
      return
    }

    setKbisFile(file)
    setError(null)

    // Créer un aperçu pour les images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setKbisPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // Pour les PDF, afficher juste l'icône
      setKbisPreview(null)
    }
  }

  const removeKbis = () => {
    setKbisFile(null)
    setKbisPreview(null)
  }

  // Upload KBIS vers Supabase Storage
  const uploadKbis = async (supabase: any): Promise<string | null> => {
    if (!kbisFile) return null

    setKbisUploading(true)
    try {
      const fileExt = kbisFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('kbis')
        .upload(fileName, kbisFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('KBIS upload error:', error)
        throw new Error('Erreur lors de l\'upload du KBIS')
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('kbis')
        .getPublicUrl(fileName)

      return publicUrl
    } finally {
      setKbisUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validations
    if (!raisonSociale.trim()) {
      setError('La raison sociale est requise')
      setLoading(false)
      return
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez saisir une adresse email valide')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (siret && !validateSiret(siret)) {
      setError('Le numéro SIRET doit contenir 14 chiffres')
      setLoading(false)
      return
    }

    if (!zoneId) {
      setError('Veuillez sélectionner une zone de livraison')
      setLoading(false)
      return
    }

    if (!kbisFile) {
      setError('Veuillez fournir votre extrait KBIS')
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      // 1. Créer le compte Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            raison_sociale: raisonSociale,
          },
        },
      })

      if (authError) {
        console.error('Auth error:', authError)
        if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          setError('Un compte existe déjà avec cette adresse email')
        } else if (authError.message.includes('Password should be at least')) {
          setError('Le mot de passe doit contenir au moins 6 caractères')
        } else if (authError.message.includes('Unable to validate email')) {
          setError('Adresse email invalide')
        } else if (authError.message.includes('Email rate limit exceeded')) {
          setError('Trop de tentatives. Veuillez réessayer dans quelques minutes.')
        } else if (authError.status === 422) {
          setError('Email déjà utilisé ou invalide. Si vous avez déjà un compte, connectez-vous.')
        } else {
          setError(`Erreur: ${authError.message}`)
        }
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError('Erreur lors de la création du compte')
        setLoading(false)
        return
      }

      // 2. Upload KBIS vers Storage
      let kbisUrl: string | null = null
      try {
        kbisUrl = await uploadKbis(supabase)
      } catch (uploadError) {
        setError('Erreur lors de l\'upload du KBIS. Veuillez réessayer.')
        setLoading(false)
        return
      }

      // 3. Créer l'entrée dans la table clients avec l'ID Auth
      const { error: clientError } = await supabase.from('clients').insert({
        id: authData.user.id, // Lier l'ID client à l'ID Auth Supabase
        email,
        raison_sociale: raisonSociale,
        type_structure: typeStructure || null,
        siret: siret.replace(/\s/g, '') || null,
        contact_nom: contactNom || null,
        contact_prenom: contactPrenom || null,
        telephone: telephone || null,
        adresse_livraison: adresse || null,
        adresse_facturation: adresse || null,
        code_postal: codePostal || null,
        ville: ville || null,
        zone_livraison_id: zoneId,
        statut: 'en_attente',
        pourcentage_remise: 0,
        kbis_url: kbisUrl,
      })

      if (clientError) {
        console.error('Client creation error:', clientError)
        // Gérer les erreurs spécifiques
        if (clientError.code === '23505' || clientError.message?.includes('duplicate') || clientError.message?.includes('unique')) {
          setError('Un client avec cet email existe déjà dans notre base.')
        } else if (clientError.code === '23503') {
          setError('Zone de livraison invalide.')
        } else {
          setError(`Erreur lors de l'enregistrement: ${clientError.message || 'Veuillez réessayer.'}`)
        }
        setLoading(false)
        return
      }

      // 3. Succès - Déconnecter et afficher message
      await supabase.auth.signOut()
      setStep('success')
    } catch (err: any) {
      console.error('Registration error:', err)
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  // Écran de succès
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-belfrit-shell flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-heading text-gray-900 mb-4">
              Demande envoyée !
            </h1>

            <p className="text-gray-600 mb-6">
              Votre demande d'inscription a bien été enregistrée. Notre équipe va vérifier vos informations et valider votre compte dans les plus brefs délais.
            </p>

            <p className="text-sm text-gray-500 mb-8">
              Vous recevrez un email de confirmation dès que votre compte sera activé.
            </p>

            <Link
              href="/"
              className="inline-block px-6 py-3 bg-belfrit-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-belfrit-shell py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="mt-4 text-2xl font-heading text-belfrit-black">
            Créer un compte professionnel
          </h1>
          <p className="mt-2 text-gray-600">
            Rejoignez notre réseau de professionnels B2B
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
            {/* Section Entreprise */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-belfrit-red" />
                Informations entreprise
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Raison sociale */}
                <div className="md:col-span-2">
                  <label htmlFor="raisonSociale" className="block text-sm font-medium text-gray-700 mb-1">
                    Raison sociale *
                  </label>
                  <input
                    id="raisonSociale"
                    type="text"
                    value={raisonSociale}
                    onChange={(e) => setRaisonSociale(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                {/* Type de structure */}
                <div>
                  <label htmlFor="typeStructure" className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'établissement
                  </label>
                  <select
                    id="typeStructure"
                    value={typeStructure}
                    onChange={(e) => setTypeStructure(e.target.value as TypeStructure)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="snack">Snack / Friterie</option>
                    <option value="hotel">Hôtel</option>
                    <option value="commerce">Commerce alimentaire</option>
                  </select>
                </div>

                {/* SIRET */}
                <div>
                  <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                    N° SIRET
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="siret"
                      type="text"
                      value={siret}
                      onChange={(e) => setSiret(formatSiret(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                      placeholder="XXX XXX XXX XXXXX"
                    />
                  </div>
                </div>

                {/* KBIS Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extrait KBIS *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    PDF, JPG ou PNG - 10 Mo maximum
                  </p>

                  {!kbisFile ? (
                    <label
                      htmlFor="kbis-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-belfrit-red hover:bg-red-50/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Cliquez pour sélectionner votre KBIS
                      </span>
                      <input
                        id="kbis-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleKbisChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {/* Aperçu */}
                      {kbisPreview ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                          <img
                            src={kbisPreview}
                            alt="Aperçu KBIS"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <File className="w-8 h-8 text-belfrit-red" />
                        </div>
                      )}

                      {/* Infos fichier */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {kbisFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(kbisFile.size / 1024 / 1024).toFixed(2)} Mo
                        </p>
                      </div>

                      {/* Bouton supprimer */}
                      <button
                        type="button"
                        onClick={removeKbis}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section Contact */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-belfrit-red" />
                Contact principal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prénom */}
                <div>
                  <label htmlFor="contactPrenom" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    id="contactPrenom"
                    type="text"
                    value={contactPrenom}
                    onChange={(e) => setContactPrenom(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  />
                </div>

                {/* Nom */}
                <div>
                  <label htmlFor="contactNom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    id="contactNom"
                    type="text"
                    value={contactNom}
                    onChange={(e) => setContactNom(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                      placeholder="contact@entreprise.com"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="telephone"
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                      placeholder="Minimum 8 caractères"
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

                {/* Confirmation mot de passe */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                      placeholder="Répétez le mot de passe"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Adresse */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-belfrit-red" />
                Adresse de livraison
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Adresse */}
                <div className="md:col-span-2">
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    id="adresse"
                    type="text"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="Numéro et nom de rue"
                  />
                </div>

                {/* Code postal */}
                <div>
                  <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    id="codePostal"
                    type="text"
                    value={codePostal}
                    onChange={(e) => setCodePostal(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="59000"
                  />
                </div>

                {/* Ville */}
                <div>
                  <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    id="ville"
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                    placeholder="Lille"
                  />
                </div>

                {/* Zone de livraison */}
                <div className="md:col-span-2">
                  <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1">
                    Zone de livraison *
                  </label>
                  <select
                    id="zone"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belfrit-red focus:border-transparent"
                  >
                    <option value="">Sélectionnez votre zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.nom} - Livraison {zone.jours_livraison?.join(', ')}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Les frais et jours de livraison dépendent de votre zone.
                  </p>
                </div>
              </div>
            </div>

            {/* CGV */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-belfrit-red border-gray-300 rounded focus:ring-belfrit-red"
                />
                <span className="text-sm text-gray-600">
                  J'accepte les{' '}
                  <Link href="/cgv" className="text-belfrit-red hover:underline">
                    Conditions Générales de Vente
                  </Link>{' '}
                  et la{' '}
                  <Link href="/confidentialite" className="text-belfrit-red hover:underline">
                    Politique de Confidentialité
                  </Link>
                  . *
                </span>
              </label>
            </div>

            {/* Bouton inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-belfrit-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Créer mon compte professionnel'
              )}
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/connexion" className="text-belfrit-red hover:underline font-medium">
                Se connecter
              </Link>
            </p>
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
