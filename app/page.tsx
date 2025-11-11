import { FloatingFoodHero } from '@/components/hero-section-7';
import { FeatureHighlightCard } from '@/components/feature-highlight-card';
import { Package, Truck, Award, ChefHat, Store, Building } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  // Configuration des images flottantes pour le hero
  const heroImages = [
    {
      src: '/hero1.png',
      alt: 'Frites belges premium',
      className: 'w-32 h-32 md:w-48 md:h-48 top-[10%] left-[5%] animate-float'
    },
    {
      src: '/hero2.png',
      alt: 'Frites dorées',
      className: 'w-40 h-40 md:w-56 md:h-56 top-[15%] right-[8%] animate-float-delayed'
    },
    {
      src: '/hero3.png',
      alt: 'Frites croustillantes',
      className: 'w-36 h-36 md:w-52 md:h-52 bottom-[20%] left-[10%] animate-float-slow'
    },
    {
      src: '/hero4.png',
      alt: 'Snacks belges',
      className: 'w-32 h-32 md:w-44 md:h-44 bottom-[25%] right-[12%] animate-float'
    },
    {
      src: '/hero5.png',
      alt: 'Produits premium',
      className: 'w-28 h-28 md:w-40 md:h-40 top-[40%] right-[3%] animate-float-delayed'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <FloatingFoodHero
        title="Les vraies frites belges, en B2B à La Réunion."
        description="Qualité constante, chaîne du froid maîtrisée, accompagnement point-de-vente."
        images={heroImages}
        className="bg-white"
      />

      {/* CTAs sous le hero */}
      <section className="relative z-30 -mt-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/devenir-partenaire"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-red hover:bg-red-700 transition-colors rounded-lg shadow-lg"
            >
              Ouvrir un compte pro
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-primary-gold hover:bg-yellow-500 transition-colors rounded-lg shadow-lg"
            >
              Recevoir la grille tarifaire
            </a>
          </div>
          <p className="text-center mt-6 text-sm text-gray-600">
            Réservé aux professionnels. Validation SIRET requise.
          </p>
        </div>
      </section>

      {/* Preuves clés */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Carte 1 - Produits certifiés */}
            <FeatureHighlightCard
              imageSrc="/card-produits.jpg"
              imageAlt="Produits certifiés Belgique"
              title="Produits certifiés"
              description="Approvisionnement direct Belgique, traçabilité totale, conformité réglementaire Réunion"
              buttonText="En savoir plus"
            />

            {/* Carte 2 - Logistique maîtrisée */}
            <FeatureHighlightCard
              imageSrc="/card-logistique.jpg"
              imageAlt="Logistique maîtrisée"
              title="Logistique maîtrisée"
              description="Livraisons régulières, chaîne du froid ininterrompue, gestion des ruptures de stock"
              buttonText="En savoir plus"
            />

            {/* Carte 3 - Accompagnement pro */}
            <FeatureHighlightCard
              imageSrc="/card-accompagnement.jpg"
              imageAlt="Accompagnement professionnel"
              title="Accompagnement pro"
              description="PLV fournie, fiches techniques, formations cuisson, recettes exclusives"
              buttonText="En savoir plus"
            />
          </div>
        </div>
      </section>

      {/* Gammes aperçu */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 frites-bars pb-3 inline-block">
              Nos gammes premium
            </h2>
            <p className="text-xl text-gray-600">
              Une sélection rigoureuse de produits belges authentiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Frites surgelées */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary-gold/20 to-primary-red/10 flex items-center justify-center p-8">
                <div className="text-6xl">🍟</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Frites surgelées</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Classiques, ondulées, steakhouse, rustiques
                </p>
                <a href="/catalogue#frites" className="text-primary-red hover:underline font-semibold">
                  Voir la gamme →
                </a>
              </div>
            </div>

            {/* Snacks belges */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary-gold/20 to-primary-red/10 flex items-center justify-center p-8">
                <div className="text-6xl">🧆</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Snacks belges</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Bitterballen, croquettes, fricadelles
                </p>
                <a href="/catalogue#snacks" className="text-primary-red hover:underline font-semibold">
                  Voir la gamme →
                </a>
              </div>
            </div>

            {/* Sauces premium */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary-gold/20 to-primary-red/10 flex items-center justify-center p-8">
                <div className="text-6xl">🥫</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Sauces premium</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Andalouse, samouraï, américaine, tartare
                </p>
                <a href="/catalogue#sauces" className="text-primary-red hover:underline font-semibold">
                  Voir la gamme →
                </a>
              </div>
            </div>

            {/* Accompagnements */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary-gold/20 to-primary-red/10 flex items-center justify-center p-8">
                <div className="text-6xl">🥗</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Accompagnements</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Salades, oignons frits, fromages belges
                </p>
                <a href="/catalogue#accompagnements" className="text-primary-red hover:underline font-semibold">
                  Voir la gamme →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segments servis */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 frites-bars pb-3 inline-block">
              Qui servons-nous ?
            </h2>
            <p className="text-xl text-gray-600">
              Des solutions adaptées à chaque type de professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Restauration */}
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-red/10 mb-6">
                <ChefHat className="w-8 h-8 text-primary-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Restauration</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Restaurants traditionnels</li>
                <li>• Fast-food et snacks</li>
                <li>• Food-trucks</li>
                <li>• Restaurants d'hôtels</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-primary-red">
                  Fiches techniques et formations cuisson incluses
                </p>
              </div>
            </div>

            {/* Distribution */}
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-red/10 mb-6">
                <Store className="w-8 h-8 text-primary-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Distribution</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Supérettes et épiceries</li>
                <li>• Stations-service</li>
                <li>• Cafétérias d'entreprise</li>
                <li>• Points de vente isolés</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-primary-red">
                  PLV et support merchandising fournis
                </p>
              </div>
            </div>

            {/* Collectivités */}
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-red/10 mb-6">
                <Building className="w-8 h-8 text-primary-red" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Collectivités</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Cantines scolaires</li>
                <li>• Restaurants d'entreprise</li>
                <li>• Établissements de santé</li>
                <li>• Centres de loisirs</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-primary-red">
                  Volumes adaptés et facturation simplifiée
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logistique & qualité */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 frites-bars pb-3 inline-block">
                Logistique & qualité
              </h2>
              <p className="text-xl text-gray-600">
                Une chaîne du froid irréprochable de la Belgique à votre cuisine
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-gold/20 flex items-center justify-center font-bold text-primary-red">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Import direct</h3>
                    <p className="text-gray-600">
                      Sélection des meilleurs producteurs belges, contrôle qualité strict à la source
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-gold/20 flex items-center justify-center font-bold text-primary-red">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Transport sécurisé</h3>
                    <p className="text-gray-600">
                      Conteneurs réfrigérés maritimes, suivi GPS en temps réel, respect des normes HACCP
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-gold/20 flex items-center justify-center font-bold text-primary-red">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Stockage optimisé</h3>
                    <p className="text-gray-600">
                      Entrepôt frigorifique certifié à La Réunion, gestion informatisée des stocks
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-gold/20 flex items-center justify-center font-bold text-primary-red">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Livraison express</h3>
                    <p className="text-gray-600">
                      Camions frigorifiques, livraisons programmées, garantie de fraîcheur jusqu'à vous
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-gold/10 to-primary-red/5 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Nos engagements qualité</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-gold text-xl flex-shrink-0">✓</span>
                    <span>Traçabilité complète du producteur belge au client final</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-gold text-xl flex-shrink-0">✓</span>
                    <span>Température maintenue entre -18°C et -22°C en permanence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-gold text-xl flex-shrink-0">✓</span>
                    <span>Contrôles qualité à chaque étape de la chaîne logistique</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-gold text-xl flex-shrink-0">✓</span>
                    <span>Conformité totale aux normes sanitaires de La Réunion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-gold text-xl flex-shrink-0">✓</span>
                    <span>Service client dédié et réactif pour toute question</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLV & accompagnement */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 frites-bars pb-3 inline-block">
                PLV & accompagnement
              </h2>
              <p className="text-xl text-gray-600">
                On ne vous livre pas que des produits, on vous aide à les vendre
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-primary-red">Supports visuels</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Affiches publicitaires aux couleurs BelFrit</li>
                  <li>• Ardoises et stop-trottoir personnalisables</li>
                  <li>• Chevalets de table et menus formats A4/A5</li>
                  <li>• Stickers vitrine et habillage de point de vente</li>
                  <li>• Présentoirs comptoir pour snacks</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-primary-red">Formation & recettes</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Fiches techniques détaillées par produit</li>
                  <li>• Temps et températures de cuisson optimaux</li>
                  <li>• 20+ recettes exclusives créées par notre chef</li>
                  <li>• Formations cuisson sur site (sur demande)</li>
                  <li>• Hotline technique 7j/7 pour vos questions</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-red to-red-700 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Pack PLV offert dès 500€ HT de commande</h3>
              <p className="text-lg mb-6 opacity-90">
                Valorisez vos frites belges avec nos supports marketing professionnels
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-primary-gold text-gray-900 hover:bg-yellow-500 transition-colors rounded-lg"
              >
                Demander mon pack PLV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau conversion final */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prêt à proposer les <span className="gold-underline">vraies frites belges</span> à vos clients ?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Ouvrez votre compte professionnel en 48h et recevez votre première commande sous 7 jours
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="/devenir-partenaire"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-red hover:bg-red-700 transition-colors rounded-lg shadow-lg"
              >
                Ouvrir un compte pro
              </a>
              <a
                href="/catalogue"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-primary-gold hover:bg-yellow-500 transition-colors rounded-lg shadow-lg"
              >
                Consulter le catalogue
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
              <div className="flex gap-3">
                <span className="text-primary-gold text-2xl flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold mb-1">Sans engagement</p>
                  <p className="text-sm text-gray-400">Commandez quand vous voulez</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-gold text-2xl flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold mb-1">Paiement flexible</p>
                  <p className="text-sm text-gray-400">30 jours nets après livraison</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-gold text-2xl flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold mb-1">Support dédié</p>
                  <p className="text-sm text-gray-400">Conseiller attitré disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
