-- ============================================
-- Configuration Supabase Storage pour BelFrit
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Créer le bucket 'produits' pour les photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'produits',
  'produits',
  true,  -- Bucket public pour que les images soient accessibles
  5242880,  -- Limite 5MB par fichier
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Policy pour permettre la lecture publique des images
CREATE POLICY "Images produits publiques"
ON storage.objects FOR SELECT
USING (bucket_id = 'produits');

-- 3. Policy pour permettre l'upload par les admins authentifiés
CREATE POLICY "Admins peuvent uploader des images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'produits'
  AND auth.role() = 'authenticated'
);

-- 4. Policy pour permettre la modification par les admins authentifiés
CREATE POLICY "Admins peuvent modifier les images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'produits'
  AND auth.role() = 'authenticated'
);

-- 5. Policy pour permettre la suppression par les admins authentifiés
CREATE POLICY "Admins peuvent supprimer les images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'produits'
  AND auth.role() = 'authenticated'
);

-- ============================================
-- IMPORTANT: Si vous avez des problèmes d'accès,
-- désactivez RLS sur les tables produits/variantes/photos
-- comme vous l'avez fait pour la table admins
-- ============================================

-- Désactiver RLS sur les tables du module produits (optionnel)
-- ALTER TABLE produits DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE variantes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE photos_produits DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
