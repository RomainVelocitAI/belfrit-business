'use client';

import React from 'react';
import { FloatingFoodHero } from '@/components/hero-section-7';
import { Timeline3D, TimelineEvent } from '@/components/3d-interactive-timeline';
import { BentoGrid, BentoGridItem } from '@/components/bento-grid';
import { FlipCard } from '@/components/flip-card';
import { ThreeDCard } from '@/components/3d-card-wrapper';
import {
  Target,
  CheckCircle,
  Award,
  Headphones,
  TrendingUp,
  Snowflake,
  ClipboardCheck,
  Store,
  Shield,
  Building,
  Users,
  Truck,
  Palette,
  Search,
  BarChart,
  MessageSquare,
  Star,
  Phone,
  FileText,
} from 'lucide-react';

export default function QuiSommesNousPage() {
  // Timeline events pour la Section 4 (Méthode)
  const methodeEvents: TimelineEvent[] = [
    {
      id: 'audit',
      date: 'Etape 1',
      title: 'Audit',
      description:
        "Contexte, flux, objectifs, contraintes d'espace et de debit. Analyse de votre point de vente pour identifier les meilleures opportunites.",
      icon: <Search className="w-5 h-5 text-white" />,
      image: '/methode-audit.jpg',
      category: 'DIAGNOSTIC',
      color: 'black',
    },
    {
      id: 'selection',
      date: 'Etape 2',
      title: 'Selection',
      description:
        'References adaptees (frites, snacks, sauces) et conseil cuisson. Choix des produits optimaux selon votre segment et votre debit.',
      icon: <ClipboardCheck className="w-5 h-5 text-white" />,
      image: '/methode-selection.jpg',
      category: 'CHOIX',
      color: 'yellow',
    },
    {
      id: 'mise-en-place',
      date: 'Etape 3',
      title: 'Mise en place & PLV',
      description:
        "Affiches, stickers, chevalets, contenus reseaux. Pack complet de supports pour valoriser l'offre belge en point de vente.",
      icon: <Palette className="w-5 h-5 text-white" />,
      image: '/methode-plv.jpg',
      category: 'DEPLOYMENT',
      color: 'red',
    },
    {
      id: 'suivi',
      date: 'Etape 4',
      title: 'Suivi',
      description:
        "Approvisionnement planifie, tracabilite/DLC, ajustements d'assortiment. Accompagnement continu pour optimiser vos ventes.",
      icon: <BarChart className="w-5 h-5 text-white" />,
      image: '/methode-suivi.jpg',
      category: 'PERFORMANCE',
      color: 'blue',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* SECTION 1: Hero (En-tête) */}
      <section className="relative">
        <FloatingFoodHero
          title={
            <>
              <span className="text-[#000000]">Qui sommes-nous</span>
            </>
          }
          description="BelFrit-Business distribue des frites, snacks et sauces belges premium pour professionnels a La Reunion. Notre exigence : qualite constante, chaine du froid maitrisee et accompagnement point-de-vente."
          images={[
            {
              src: '/hero-frites-1.png',
              alt: 'Frites belges premium',
              className:
                'left-[10%] top-[20%] w-32 h-32 md:w-48 md:h-48 animate-float-slow opacity-80',
            },
            {
              src: '/hero-frites-2.png',
              alt: 'Snacks belges',
              className:
                'right-[10%] top-[30%] w-28 h-28 md:w-40 md:h-40 animate-float-medium opacity-70',
            },
            {
              src: '/logo.png',
              alt: 'Logo BelFrit',
              className:
                'left-[50%] top-[10%] w-36 h-36 md:w-48 md:h-48 -translate-x-1/2',
            },
            {
              src: '/hero-frites-3.png',
              alt: 'Sauces belges',
              className:
                'left-[15%] bottom-[20%] w-24 h-24 md:w-36 md:h-36 animate-float-fast opacity-60',
            },
            {
              src: '/hero-frites-4.png',
              alt: 'Produits belges',
              className:
                'right-[15%] bottom-[25%] w-32 h-32 md:w-44 md:h-44 animate-float-slow opacity-75',
            },
          ]}
          className="bg-transparent min-h-[60vh]"
        />

        {/* CTAs et disclaimer */}
        <div className="container mx-auto px-4 -mt-8 relative z-30 pb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E31E24] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              Echanger avec un specialiste
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-[#FFD700] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              <Phone className="w-5 h-5 mr-2" />
              Etre rappele par un conseiller
            </a>
          </div>
          <p className="text-center text-sm text-gray-600 italic">
            Reserve aux professionnels. Validation SIRET requise.
          </p>
        </div>
      </section>

      {/* SECTION 2: Mission & Promesse */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-transparent rounded-2xl p-8 md:p-12 border-t-4 border-[#E31E24]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Notre mission
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Apporter l'authenticite belge aux acteurs du snacking et de
                  la restauration a La Reunion, avec une execution simple,
                  fiable et rentable cote point de vente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="w-16 h-16 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Notre promesse
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Qualite constante, livraisons planifiees en chaine du froid,
                  et un veritable support commercial en magasin (PLV, recettes,
                  conseils cuisson).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Valeurs (4 piliers) avec Bento Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3">
              Nos valeurs
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              4 piliers qui guident notre action quotidienne
            </p>
          </div>

          <BentoGrid className="max-w-6xl mx-auto">
            <BentoGridItem
              title="Authenticite"
              description="Produits belges soigneusement selectionnes, gout reconnaissable."
              header={
                <div className="flex h-full min-h-[6rem] items-center justify-center bg-gradient-to-br from-[#000000] to-[#FFD700] rounded-md">
                  <Award className="w-16 h-16 text-[#FFD700]" />
                </div>
              }
              className="md:col-span-2 md:row-span-1"
            />
            <BentoGridItem
              title="Qualite"
              description="Constance produit et procedures de preparation claires."
              header={
                <div className="flex h-full min-h-[6rem] items-center justify-center bg-gradient-to-br from-[#E31E24] to-[#FF6B6B] rounded-md">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              }
              className="md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Service"
              description="Support PDV (PLV, recettes, scripts de vente)."
              header={
                <div className="flex h-full min-h-[6rem] items-center justify-center bg-gradient-to-br from-[#003DA5] to-[#0052D9] rounded-md">
                  <Headphones className="w-16 h-16 text-white" />
                </div>
              }
              className="md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Performance"
              description="Mise en avant, rotation, satisfaction et reachat."
              header={
                <div className="flex h-full min-h-[6rem] items-center justify-center bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-md">
                  <TrendingUp className="w-16 h-16 text-gray-900" />
                </div>
              }
              className="md:col-span-2 md:row-span-1"
            />
          </BentoGrid>
        </div>
      </section>

      {/* SECTION 4: Méthode (4 étapes) avec Timeline3D */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3">
              Notre methode
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-2xl md:text-3xl font-semibold text-gray-700 mt-6 mb-8">
              4 etapes pour un partenariat reussi
            </p>
          </div>

          <Timeline3D
            events={methodeEvents}
            backgroundColor="bg-transparent"
            primaryColor="bg-[#E31E24]"
            secondaryColor="bg-[#FFD700]"
            textColor="text-gray-900"
            accentColor="bg-[#FFD700]"
            showImages={true}
            className="!py-12"
          />

          <div className="mt-12 text-center max-w-2xl mx-auto">
            <p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg border-l-4 border-[#FFD700]">
              <strong>Note pratique :</strong> Protocole cuisson 2 bains
              documente (option premium a la graisse de canard IGP sur friteuse
              dediee si souhaite).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Engagements Qualité & Logistique */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3">
              Nos engagements qualite
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              Des garanties concretes pour votre activite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 max-w-6xl mx-auto">
            <FlipCard
              imageSrc="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80"
              imageAlt="Chaîne du froid"
              title="Chaine du froid -20°C"
              description="Maitrise totale de la temperature de la Belgique a votre cuisine"
              buttonText="En savoir plus"
              backContent={{
                title: "Notre protocole froid",
                details: [
                  "Stockage professionnel a -20°C constant",
                  "Preparation en chambre froide surveillee",
                  "Livraisons planifiees avec vehicules frigorifiques",
                  "Traçabilite temperature du depart jusqu'a reception",
                  "Verification systematique a la livraison",
                  "Formation equipes sur bonnes pratiques"
                ]
              }}
              parallaxSpeed={0.5}
            />

            <FlipCard
              imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
              imageAlt="Traçabilité"
              title="Tracabilite & DLC"
              description="Suivi rigoureux des lots et documentation complete"
              buttonText="En savoir plus"
              backContent={{
                title: "Systeme de tracabilite",
                details: [
                  "Suivi des lots par numero unique",
                  "Gestion FIFO (First In, First Out)",
                  "Fiches techniques detaillees disponibles",
                  "Tableau des allergenes sur demande",
                  "Historique complet des receptions",
                  "Acces espace pro apres validation compte"
                ]
              }}
              parallaxSpeed={0.5}
            />

            <FlipCard
              imageSrc="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80"
              imageAlt="Accompagnement"
              title="Ouverture & mise en avant"
              description="Support complet pour valoriser vos produits belges"
              buttonText="En savoir plus"
              backContent={{
                title: "Accompagnement PDV",
                details: [
                  "PLV aux couleurs belges fournie",
                  "Fiches recettes et suggestions menu",
                  "Calendrier d'animation saisonnier",
                  "Conseils mise en avant vitrine",
                  "Support marketing personnalise",
                  "Formation equipe sur l'origine des produits"
                ]
              }}
              parallaxSpeed={0.5}
            />

            <FlipCard
              imageSrc="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
              imageAlt="Transparence"
              title="Transparence pro"
              description="Relations B2B claires et securisees"
              buttonText="En savoir plus"
              backContent={{
                title: "Engagement transparence",
                details: [
                  "Pas de tarifs publics (protection revendeurs)",
                  "Validation SIRET obligatoire",
                  "Conditions tarifaires apres approbation compte",
                  "Contrat cadre personnalise",
                  "Engagement volumes negociable",
                  "Relation commerciale long terme privilegiee"
                ]
              }}
              parallaxSpeed={0.5}
            />
          </div>
        </div>
      </section>

      {/* SECTION 6: Équipe & Rôles (sans données personnelles) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3">
              Notre equipe
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              Des experts dedies a votre reussite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ThreeDCard
              title="Direction & Partenariats"
              description="Strategie, sourcing, relations industrielles"
              icon={<Building className="w-8 h-8 text-white" />}
              details={[
                "Gestion partenariats producteurs belges",
                "Coordination globale des operations",
                "Strategie d'approvisionnement et qualite",
                "Relations industrielles internationales"
              ]}
              className="bg-[#E31E24] border-2 border-[#FFD700]"
            />

            <ThreeDCard
              title="Commerce B2B"
              description="Qualification, propositions, suivi comptes multi-sites"
              icon={<Users className="w-8 h-8 text-white" />}
              details={[
                "Qualification des professionnels",
                "Propositions commerciales personnalisees",
                "Suivi des comptes multi-sites",
                "Accompagnement au long terme"
              ]}
              className="bg-[#003DA5] border-2 border-[#FFD700]"
            />

            <ThreeDCard
              title="Qualite & Operations"
              description="Logistique froid, tracabilite, conformite"
              icon={<Truck className="w-8 h-8 text-[#FFD700]" />}
              details={[
                "Gestion de la chaine du froid",
                "Tracabilite des lots et DLC",
                "Conformite aux normes HACCP",
                "Coordination des livraisons"
              ]}
              className="bg-black border-2 border-[#FFD700]"
            />

            <ThreeDCard
              title="Marketing & PLV"
              description="Identite, supports PDV, contenus & formation courte"
              icon={<Palette className="w-8 h-8 text-[#E31E24]" />}
              details={[
                "Creation de supports PLV personnalises",
                "Fiches produits et recettes",
                "Formation equipes sur produits belges",
                "Calendrier d'animation commercial"
              ]}
              className="bg-[#FFD700] border-2 border-[#E31E24] text-gray-900"
            />
          </div>

          <div className="text-center mt-12">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E31E24] rounded-lg shadow-lg hover:bg-[#C91A20] transform hover:scale-105 transition-all"
            >
              <Phone className="w-5 h-5 mr-2" />
              Etre rappele par un conseiller
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 7: Preuve Sociale (placeholder) */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-300">
              Temoignages et etudes de cas a venir
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#FFD700]/20 mb-6 mx-auto">
                <MessageSquare className="w-12 h-12 text-[#FFD700]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Prochainement
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Decouvrez bientot les retours d'experience de nos partenaires
                professionnels : stations-service, restaurants, foodtrucks et
                distributeurs qui ont choisi la qualite belge pour leur offre
                snacking.
              </p>
              <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD700]" />
                  <span>Etudes de cas avant/apres</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FFD700]" />
                  <span>Impact sur les ventes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FFD700]" />
                  <span>Satisfaction client</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Bloc Conversion Final */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Parlons de votre{' '}
              <span className="relative inline-block">
                <span className="relative z-10">point de vente</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-[#FFD700] -rotate-1 opacity-50"></span>
              </span>
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Echangeons sur vos besoins specifiques et construisons ensemble
              votre offre frites et snacks belges premium
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E31E24] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Echanger avec un specialiste
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-[#FFD700] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                <FileText className="w-5 h-5 mr-2" />
                Ouvrir un compte pro
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
              <div className="flex gap-3">
                <span className="text-[#FFD700] text-2xl flex-shrink-0">
                  ✓
                </span>
                <div>
                  <p className="font-semibold mb-1">Audit personnalise</p>
                  <p className="text-sm text-gray-400">
                    Analyse de votre point de vente
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#FFD700] text-2xl flex-shrink-0">
                  ✓
                </span>
                <div>
                  <p className="font-semibold mb-1">Reponse sous 48h</p>
                  <p className="text-sm text-gray-400">
                    Retour rapide apres qualification
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#FFD700] text-2xl flex-shrink-0">
                  ✓
                </span>
                <div>
                  <p className="font-semibold mb-1">Accompagnement complet</p>
                  <p className="text-sm text-gray-400">
                    De l'ouverture au suivi des ventes
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center mt-8 text-sm text-gray-400">
              Offres et documents techniques reserves aux comptes
              professionnels valides.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
