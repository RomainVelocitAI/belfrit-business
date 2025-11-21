import { FloatingFoodHero } from '@/components/hero-section-7';
import { FlipCard } from '@/components/flip-card';
import { GammesStagger } from '@/components/gammes-stagger';
import PlvSection from '@/components/plv-section';
import ContactForm from '@/components/contact-form';
import { SegmentsFlipCards } from '@/components/segments-flip-cards';
import { Timeline3D, TimelineEvent } from '@/components/3d-interactive-timeline';
import { Package, Truck, Ship, Warehouse } from 'lucide-react';

export default function HomePage() {
  // Configuration des images flottantes pour le hero
  // 2 à gauche, 2 à droite, 1 au centre visible sous le header
  const heroImages = [
    // Gauche haut
    {
      src: '/hero3.png',
      alt: 'Frites croustillantes',
      className: 'w-32 h-32 md:w-48 md:h-48 top-[15%] left-[5%] animate-float'
    },
    // Gauche bas
    {
      src: '/hero2.png',
      alt: 'Frites dorées',
      className: 'w-36 h-36 md:w-52 md:h-52 bottom-[25%] left-[8%] animate-float-delayed'
    },
    // Centre sous le header, au-dessus du texte
    {
      src: '/hero1.png',
      alt: 'Frites belges premium',
      className: 'w-32 h-32 md:w-44 md:h-44 top-[8%] left-[50%] -translate-x-1/2 animate-float-slow'
    },
    // Droite haut
    {
      src: '/hero4.png',
      alt: 'Snacks belges',
      className: 'w-32 h-32 md:w-44 md:h-44 top-[20%] right-[5%] animate-float'
    },
    // Droite bas
    {
      src: '/hero5.png',
      alt: 'Produits premium',
      className: 'w-28 h-28 md:w-40 md:h-40 bottom-[30%] right-[8%] animate-float-delayed'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <FloatingFoodHero
        title={
          <>
            <span className="text-[#000000]">Les vrais produits </span>
            <span className="text-[#FFD700]">belges</span>
            <span className="text-[#E31E24]">, en B2B à La Réunion.</span>
          </>
        }
        description="Qualité constante, chaîne du froid maîtrisée, accompagnement point-de-vente."
        images={heroImages}
        className="bg-transparent"
        logoSrc="/1.png"
      />

      {/* CTAs sous le hero */}
      <section className="relative z-30 -mt-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E31E24] rounded-lg shadow-lg"
            >
              Ouvrir un compte pro
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-[#FFD700] rounded-lg shadow-lg"
            >
              Recevoir la grille tarifaire
            </a>
          </div>
          <p className="text-center mt-6 text-sm text-gray-900">
            Réservé aux professionnels. Validation SIRET requise.
          </p>
        </div>
      </section>

      {/* Preuves clés */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
            {/* Carte 1 - Produits certifiés */}
            <FlipCard
              parallaxSpeed={0}
              imageSrc="/card-produits.jpg"
              imageAlt="Produits certifiés Belgique"
              title="Produits certifiés"
              description="Approvisionnement direct Belgique, traçabilité totale, conformité réglementaire Réunion"
              buttonText="En savoir plus"
              backContent={{
                title: "Produits certifiés",
                details: [
                  "Partenariats directs avec producteurs belges historiques",
                  "Du plat péï à l'île intense",
                  "Certifications sanitaires EU et conformité DROM",
                  "Contrôles qualité à chaque étape de la chaîne",
                  "Labels garantissant l'origine et la méthode de fabrication"
                ]
              }}
            />

            {/* Carte 2 - Logistique maîtrisée */}
            <FlipCard
              parallaxSpeed={1}
              imageSrc="/card-logistique.jpg"
              imageAlt="Logistique maîtrisée"
              title="Logistique maîtrisée"
              description="Livraisons régulières, chaîne du froid ininterrompue, gestion des ruptures de stock"
              buttonText="En savoir plus"
              backContent={{
                title: "Logistique maîtrisée",
                details: [
                  "Conteneurs réfrigérés -22°C du port d'Anvers à La Réunion",
                  "Rotations maritimes mensuelles garantissant stock constant",
                  "Entrepôt frigorifique local certifié avec backup électrique",
                  "Livraisons programmées selon vos besoins opérationnels",
                  "Système d'alerte préventif sur ruptures potentielles"
                ]
              }}
            />

            {/* Carte 3 - Accompagnement pro */}
            <FlipCard
              parallaxSpeed={2}
              imageSrc="/card-accompagnement.jpg"
              imageAlt="Accompagnement professionnel"
              title="Accompagnement pro"
              description="PLV fournie, fiches techniques, support commercial continu"
              buttonText="En savoir plus"
              backContent={{
                title: "Accompagnement pro",
                details: [
                  "Kit PLV complet : affiches, chevalets, stickers origine Belgique",
                  "Fiches techniques détaillées : temps/température de cuisson optimaux",
                  "Support commercial continu et conseil merchandising"
                ]
              }}
            />
          </div>
        </div>
      </section>

      {/* Gammes aperçu */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 belgium-bars pb-3 inline-block">
              Nos gammes premium
            </h2>
            <p className="text-xl text-gray-600">
              Une sélection rigoureuse de produits belges authentiques
            </p>
          </div>

          <GammesStagger />
        </div>
      </section>

      {/* Segments servis */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 belgium-bars pb-3 inline-block">
              Qui servons-nous ?
            </h2>
            <p className="text-xl text-gray-600">
              Des solutions adaptées à chaque type de professionnel à La Réunion
            </p>
          </div>

          <SegmentsFlipCards />
        </div>
      </section>

      {/* Logistique & qualité */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 belgium-bars pb-3 inline-block">
                Logistique & qualité
              </h2>
              <p className="text-2xl md:text-3xl font-semibold text-gray-700 mt-6 mb-8">
                Froid maîtrisé, livraisons planifiées, traçabilité claire
              </p>
              <p className="text-lg text-gray-900 max-w-3xl mx-auto leading-relaxed">
                De l'entrepôt belge à votre cuisine, chaque étape est contrôlée. Notre système de
                stockage frigorifique à La Réunion, nos tournées planifiées et notre suivi numérique strict
                des DLC garantissent une fraîcheur optimale.
              </p>
            </div>

            <Timeline3D
              events={[
                {
                  id: "import",
                  date: "Etape 1",
                  title: "Import direct Belgique",
                  description: "Sélection des meilleurs fournisseurs belges avec contrôle qualité strict à la source. Partenariats directs garantissant l'authenticité et la traçabilité complète de chaque produit.",
                  icon: <Package className="w-5 h-5 text-gray-900" />,
                  image: "/timeline-import.jpg",
                  category: "ORIGINE",
                  color: "white"
                },
                {
                  id: "transport",
                  date: "Etape 2",
                  title: "Transport maritime sécurisé",
                  description: "Conteneurs réfrigérés maintenant -22°C durant tout le trajet. Suivi GPS en temps réel et respect strict des normes HACCP pour une chaîne du froid irréprochable.",
                  icon: <Ship className="w-5 h-5 text-white" />,
                  image: "/timeline-transport.jpg",
                  category: "TRANSIT",
                  color: "yellow"
                },
                {
                  id: "stockage",
                  date: "Etape 3",
                  title: "Stockage frigorifique optimisé",
                  description: "Entrepôt certifié à La Réunion avec gestion informatisée des stocks. Système de backup électrique et monitoring 24/7 pour garantir la conservation optimale des produits.",
                  icon: <Warehouse className="w-5 h-5 text-white" />,
                  image: "/timeline-stockage.jpg",
                  category: "STOCKAGE",
                  color: "red"
                },
                {
                  id: "livraison",
                  date: "Etape 4",
                  title: "Livraison express sur mesure",
                  description: "Camions frigorifiques avec livraisons programmées selon vos besoins. Garantie de fraîcheur et système d'alerte préventif sur les ruptures potentielles.",
                  icon: <Truck className="w-5 h-5 text-gray-900" />,
                  image: "/timeline-livraison.jpg",
                  category: "DISTRIBUTION",
                  color: "white"
                }
              ] as TimelineEvent[]}
              backgroundColor="bg-transparent"
              primaryColor="bg-[#E31E24]"
              secondaryColor="bg-[#FFD700]"
              textColor="text-gray-900"
              accentColor="bg-[#FFD700]"
              showImages={true}
              className="!py-12"
            />

            <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4 border-[#E31E24] hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#E31E24] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Tournées planifiées</h3>
                <p className="text-gray-600 leading-relaxed">
                  Optimisation des livraisons selon vos besoins réels
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4 border-[#FFD700] hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Traçabilité & DLC</h3>
                <p className="text-gray-600 leading-relaxed">
                  Suivi numérique complet, alertes automatiques
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4 border-black hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ship className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Support mise en place</h3>
                <p className="text-gray-600 leading-relaxed">
                  Accompagnement personnalisé pour optimiser votre organisation et vos commandes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLV & accompagnement */}
      <PlvSection />

      {/* Bandeau conversion final */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prêt à proposer les <span className="gold-underline">vrais produits belges</span> à vos clients ?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Ouvrez votre compte professionnel en 48h et recevez votre première commande
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E31E24] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Ouvrir un compte pro
              </a>
              <a
                href="/catalogue"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-[#FFD700] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Consulter le catalogue
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de contact avec upload Kbis */}
      <div id="contact">
        <ContactForm />
      </div>
    </main>
  );
}
