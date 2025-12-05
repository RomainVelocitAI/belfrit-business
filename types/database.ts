// Types générés à partir du schéma Supabase BelFrit Business
// Ces types correspondent aux tables existantes dans la base de données

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================
// ENUMS
// ============================================================

export type DisponibiliteType = 'disponible' | 'indisponible' | 'masque'
export type StatutClient = 'en_attente' | 'actif' | 'refuse' | 'suspendu'
export type StatutCommande = 'en_attente' | 'en_preparation' | 'en_livraison' | 'livre' | 'annule'
export type StatutPaiement = 'en_attente' | 'paye' | 'echoue'
export type RoleAdmin = 'admin' | 'logistique' | 'commercial'
export type TypeStructure = 'restaurant' | 'snack' | 'hotel' | 'commerce'

// ============================================================
// TABLES
// ============================================================

export interface Category {
  id: string
  nom: string
  ordre: number
  created_at: string
}

export interface ZoneLivraison {
  id: string
  nom: string
  communes: string[]
  jours_livraison: string[]
  creneau_horaire: string
  deadline_commande: string
  frais_livraison: number
  seuil_franco: number
  actif: boolean
  created_at: string
}

export interface Admin {
  id: string
  email: string
  nom: string
  role: RoleAdmin
  actif: boolean
  created_at: string
}

export interface Produit {
  id: string
  nom: string
  description: string | null
  categorie_id: string
  conditionnement: string | null
  disponibilite: DisponibiliteType
  created_at: string
  updated_at: string
}

export interface Variante {
  id: string
  produit_id: string
  nom: string
  poids: string | null
  prix_base: number
  disponibilite: DisponibiliteType
  ordre: number
  created_at: string
}

export interface PhotoProduit {
  id: string
  produit_id: string
  photo_url: string
  principale: boolean
  ordre: number
  created_at: string
}

export interface Client {
  id: string
  email: string
  raison_sociale: string
  siret: string | null
  type_structure: TypeStructure | null
  adresse_facturation: string | null
  adresse_livraison: string | null
  code_postal: string | null
  ville: string | null
  contact_nom: string | null
  contact_prenom: string | null
  telephone: string | null
  zone_livraison_id: string | null
  pourcentage_remise: number
  statut: StatutClient
  notes_internes: string | null
  kbis_url: string | null
  created_at: string
  updated_at: string
}

export interface Commande {
  id: string
  numero: string
  client_id: string
  statut: StatutCommande
  statut_paiement: StatutPaiement
  stripe_payment_id: string | null
  total_ht: number
  remise_appliquee: number
  frais_livraison: number
  zone_livraison_id: string | null
  date_livraison_souhaitee: string | null
  adresse_livraison: string | null
  commentaire: string | null
  facture_url: string | null
  created_at: string
  updated_at: string
}

export interface LigneCommande {
  id: string
  commande_id: string
  produit_id: string
  variante_id: string
  quantite: number
  prix_unitaire: number
  created_at: string
}

// ============================================================
// TYPES AVEC RELATIONS (pour les requêtes jointes)
// ============================================================

export interface ProduitAvecDetails extends Produit {
  categorie?: Category
  variantes?: Variante[]
  photos?: PhotoProduit[]
}

export interface CommandeAvecDetails extends Commande {
  client?: Client
  zone_livraison?: ZoneLivraison
  lignes?: LigneCommandeAvecDetails[]
}

export interface LigneCommandeAvecDetails extends LigneCommande {
  produit?: Produit
  variante?: Variante
}

export interface ClientAvecZone extends Client {
  zone_livraison?: ZoneLivraison
}

// ============================================================
// TYPES POUR FORMULAIRES (création/modification)
// ============================================================

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>
export type CategoryUpdate = Partial<CategoryInsert>

export type ZoneLivraisonInsert = Omit<ZoneLivraison, 'id' | 'created_at'>
export type ZoneLivraisonUpdate = Partial<ZoneLivraisonInsert>

export type AdminInsert = Omit<Admin, 'id' | 'created_at'>
export type AdminUpdate = Partial<AdminInsert>

export type ProduitInsert = Omit<Produit, 'id' | 'created_at' | 'updated_at'>
export type ProduitUpdate = Partial<ProduitInsert>

export type VarianteInsert = Omit<Variante, 'id' | 'created_at'>
export type VarianteUpdate = Partial<VarianteInsert>

export type PhotoProduitInsert = Omit<PhotoProduit, 'id' | 'created_at'>
export type PhotoProduitUpdate = Partial<PhotoProduitInsert>

export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>
export type ClientUpdate = Partial<ClientInsert>

export type CommandeInsert = Omit<Commande, 'id' | 'created_at' | 'updated_at'>
export type CommandeUpdate = Partial<CommandeInsert>

export type LigneCommandeInsert = Omit<LigneCommande, 'id' | 'created_at'>

// ============================================================
// TYPE DATABASE POUR SUPABASE CLIENT
// ============================================================

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: CategoryInsert & { id?: string; created_at?: string }
        Update: CategoryUpdate & { id?: string; created_at?: string }
      }
      zones_livraison: {
        Row: ZoneLivraison
        Insert: ZoneLivraisonInsert & { id?: string; created_at?: string }
        Update: ZoneLivraisonUpdate & { id?: string; created_at?: string }
      }
      admins: {
        Row: Admin
        Insert: AdminInsert & { id?: string; created_at?: string }
        Update: AdminUpdate & { id?: string; created_at?: string }
      }
      produits: {
        Row: Produit
        Insert: ProduitInsert & { id?: string; created_at?: string; updated_at?: string }
        Update: ProduitUpdate & { id?: string; created_at?: string; updated_at?: string }
      }
      variantes: {
        Row: Variante
        Insert: VarianteInsert & { id?: string; created_at?: string }
        Update: VarianteUpdate & { id?: string; created_at?: string }
      }
      photos_produits: {
        Row: PhotoProduit
        Insert: PhotoProduitInsert & { id?: string; created_at?: string }
        Update: PhotoProduitUpdate & { id?: string; created_at?: string }
      }
      clients: {
        Row: Client
        Insert: ClientInsert & { id?: string; created_at?: string; updated_at?: string }
        Update: ClientUpdate & { id?: string; created_at?: string; updated_at?: string }
      }
      commandes: {
        Row: Commande
        Insert: CommandeInsert & { id?: string; created_at?: string; updated_at?: string }
        Update: CommandeUpdate & { id?: string; created_at?: string; updated_at?: string }
      }
      lignes_commande: {
        Row: LigneCommande
        Insert: LigneCommandeInsert & { id?: string; created_at?: string }
        Update: Partial<LigneCommandeInsert> & { id?: string; created_at?: string }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      disponibilite_type: DisponibiliteType
      statut_client: StatutClient
      statut_commande: StatutCommande
      statut_paiement: StatutPaiement
      role_admin: RoleAdmin
      type_structure: TypeStructure
    }
  }
}
