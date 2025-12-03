/**
 * Couleurs officielles de la charte graphique BelFrit
 * Source: 1 - Charte graphique BELFRIT.pdf
 *
 * IMPORTANT: Modifier uniquement ce fichier pour changer les couleurs du site.
 * Ces valeurs sont synchronisées avec tailwind.config.ts
 */

// Couleurs principales
export const BELFRIT_COLORS = {
  // Principales (selon charte)
  red: "#FF0025",
  yellow: "#FFDB00",
  black: "#000000",
  white: "#FFFFFF",

  // Secondaires (selon charte)
  camel: "#CD9760",
  shell: "#F4E8DF", // Coquille

  // Variantes pour hover/états
  redDark: "#E60022",
  yellowDark: "#E6C500",

  // Couleurs UI/Utilitaires
  darkBg: "#111111", // Pour les fonds sombres
  darkCard: "#1e293b", // slate-800 équivalent
  darkBlue: "#1E3A8A", // Pour éléments spéciaux
} as const;

// Couleurs du drapeau belge (pour les éléments décoratifs)
export const BELGIUM_FLAG_COLORS = [
  BELFRIT_COLORS.black,
  BELFRIT_COLORS.yellow,
  BELFRIT_COLORS.red,
] as const;

// Couleurs du drapeau de La Réunion (pour les éléments décoratifs)
export const REUNION_FLAG_COLORS = {
  blue: "#0055A4",
  yellow: "#FCD116",
  red: "#CE1126",
} as const;

// Type utilitaire pour TypeScript
export type BelfritColor = keyof typeof BELFRIT_COLORS;
