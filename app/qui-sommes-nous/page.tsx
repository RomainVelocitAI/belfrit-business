'use client';

import React from 'react';
import Image from 'next/image';
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
      date: 'Étape 1',
      title: 'Audit',
      description:
        "Contexte, flux, objectifs, contraintes d'espace et de débit. Analyse de votre point de vente pour identifier les meilleures opportunités.",
      icon: <Search className="w-5 h-5 text-white" />,
      image: '/méthode-audit.jpg',
      category: 'DIAGNOSTIC',
      color: 'black',
    },
    {
      id: 'selection',
      date: 'Étape 2',
      title: 'Sélection',
      description:
        'Références adaptées (frites, snacks, sauces) et conseil cuisson. Choix des produits optimaux selon votre segment et votre débit.',
      icon: <ClipboardCheck className="w-5 h-5 text-white" />,
      image: '/méthode-selection.jpg',
      category: 'CHOIX',
      color: 'yellow',
    },
    {
      id: 'mise-en-place',
      date: 'Étape 3',
      title: 'Mise en place & PLV',
      description:
        "Affiches, stickers, chevalets, contenus réseaux. Pack complet de supports pour valoriser l'offre belge en point de vente.",
      icon: <Palette className="w-5 h-5 text-white" />,
      image: '/méthode-plv.jpg',
      category: 'DEPLOYMENT',
      color: 'red',
    },
    {
      id: 'suivi',
      date: 'Étape 4',
      title: 'Suivi',
      description:
        "Approvisionnement planifié, traçabilité/DLC, ajustements d'assortiment. Accompagnement continu pour optimiser vos ventes.",
      icon: <BarChart className="w-5 h-5 text-white" />,
      image: '/méthode-suivi.jpg',
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
          description="BelFrit-Business distribue des frites, snacks et sauces belges premium pour professionnels à La Réunion. Notre exigence : qualité constante, chaîne du froid maîtrisée et accompagnement point-de-vente."
          images={[
            {
              src: '/gamme-frites.png',
              alt: 'Frites belges premium',
              className:
                'left-[10%] top-[20%] w-32 h-32 md:w-48 md:h-48 animate-float-slow opacity-80',
            },
            {
              src: '/gamme-fricadelle.png',
              alt: 'Fricadelles belges',
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
              src: '/gamme-croquettes.png',
              alt: 'Croquettes belges',
              className:
                'left-[15%] bottom-[20%] w-24 h-24 md:w-36 md:h-36 animate-float-fast opacity-60',
            },
            {
              src: '/gamme-mini-snacks.png',
              alt: 'Mini snacks belges',
              className:
                'right-[15%] bottom-[25%] w-32 h-32 md:w-44 md:h-44 animate-float-slow opacity-75',
            },
            {
              src: '/gamme-rostis.png',
              alt: 'Rostis belges',
              className:
                'left-[30%] bottom-[15%] w-28 h-28 md:w-40 md:h-40 animate-float opacity-65',
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
              Échanger avec un spécialiste
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-[#FFD700] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              <Phone className="w-5 h-5 mr-2" />
              Être rappelé par un conseiller
            </a>
          </div>
          <p className="text-center text-sm text-gray-600 italic">
            Réservé aux professionnels. Validation SIRET requise.
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
                  Apporter l'authenticité belge aux acteurs du snacking et de
                  la restauration à La Réunion, avec une exécution simple,
                  fiable et rentable côté point de vente.
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
                  Qualité constante, livraisons planifiées en chaîne du froid,
                  et un véritable support commercial en magasin (PLV, recettes,
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3 text-gray-900">
              Nos valeurs
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-xl text-gray-900 mt-6">
              4 piliers qui guident notre action quotidienne
            </p>
          </div>

          <BentoGrid className="max-w-6xl mx-auto">
            <BentoGridItem
              title="Authenticité"
              description="Produits belges soigneusement sélectionnés, goût reconnaissable."
              header={
                <div className="relative w-full h-[280px] rounded-md overflow-hidden">
                  <Image
                    src="/valeur-confiance.png"
                    alt="Authenticité - Produits belges"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              }
              className="md:col-span-2 md:row-span-1"
            />
            <BentoGridItem
              title="Qualité"
              description="Constance produit et procédures de préparation claires."
              header={
                <div className="relative w-full h-[280px] rounded-md overflow-hidden">
                  <Image
                    src="/valeur-qualité.png"
                    alt="Qualité - Standards élevés"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority
                  />
                </div>
              }
              className="md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Service"
              description="Support PDV (PLV, recettes, scripts de vente)."
              header={
                <div className="relative w-full h-[240px] rounded-md overflow-hidden">
                  <Image
                    src="/valeur-service.png"
                    alt="Service - Accompagnement pro"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              }
              className="md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Performance"
              description="Mise en avant, rotation, satisfaction et réachat."
              header={
                <div className="relative w-full h-[240px] rounded-md overflow-hidden">
                  <Image
                    src="/valeur-équipe.png"
                    alt="Performance - Résultats mesurables"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3 text-gray-900">
              Notre méthode
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mt-6 mb-8">
              4 étapes pour un partenariat réussi
            </p>
          </div>

          <Timeline3D
            events={méthodeEvents}
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
              documenté (option premium à la graisse de canard IGP sur friteuse
              dédiée si souhaité).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Engagements Qualité & Logistique */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3 text-gray-900">
              Nos engagements qualité
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-xl text-gray-900 mt-6">
              Des garanties concrètes pour votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 max-w-6xl mx-auto">
            <FlipCard
              imageSrc="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80"
              imageAlt="Chaîne du froid"
              title="Chaîne du froid -20°C"
              description="Maîtrise totale de la température de la Belgique à votre cuisine"
              buttonText="En savoir plus"
              backContent={{
                title: "Notre protocole froid",
                details: [
                  "Stockage professionnel à -20°C constant",
                  "Préparation en chambre froide surveillée",
                  "Livraisons planifiées avec véhicules frigorifiques",
                  "Traçabilité température du départ jusqu'à réception",
                  "Vérification systématique à la livraison",
                  "Formation équipes sur bonnes pratiques"
                ]
              }}
              parallaxSpeed={0.5}
            />

            <FlipCard
              imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
              imageAlt="Traçabilité"
              title="Traçabilité & DLC"
              description="Suivi rigoureux des lots et documentation complète"
              buttonText="En savoir plus"
              backContent={{
                title: "Système de traçabilité",
                details: [
                  "Suivi des lots par numéro unique",
                  "Gestion FIFO (First In, First Out)",
                  "Fiches techniques détaillées disponibles",
                  "Tableau des allergènes sur demande",
                  "Historique complet des réceptions",
                  "Accès espace pro après validation compte"
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
                  "Support marketing personnalisé",
                  "Formation équipe sur l'origine des produits"
                ]
              }}
              parallaxSpeed={0.5}
            />

            <FlipCard
              imageSrc="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
              imageAlt="Transparence"
              title="Transparence pro"
              description="Relations B2B claires et sécurisées"
              buttonText="En savoir plus"
              backContent={{
                title: "Engagement transparence",
                details: [
                  "Pas de tarifs publics (protection revendeurs)",
                  "Validation SIRET obligatoire",
                  "Conditions tarifaires après approbation compte",
                  "Contrat cadre personnalisé",
                  "Engagement volumes négociable",
                  "Relation commerciale long terme privilégiée"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block relative pb-3 text-gray-900">
              Notre équipe
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFD700]"></span>
            </h2>
            <p className="text-xl text-gray-900 mt-6">
              Des experts dédiés à votre réussite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ThreeDCard
              title="Direction & Partenariats"
              description="Stratégie, sourcing, relations industrielles"
              icon={<Building className="w-8 h-8 text-white" />}
              details={[
                "Gestion partenariats producteurs belges",
                "Coordination globale des operations",
                "Stratégie d'approvisionnement et qualité",
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
                "Propositions commerciales personnalisées",
                "Suivi des comptes multi-sites",
                "Accompagnement au long terme"
              ]}
              className="bg-[#003DA5] border-2 border-[#FFD700]"
            />

            <ThreeDCard
              title="Qualité & Operations"
              description="Logistique froid, traçabilité, conformité"
              icon={<Truck className="w-8 h-8 text-[#FFD700]" />}
              details={[
                "Gestion de la chaîne du froid",
                "Traçabilité des lots et DLC",
                "Conformité aux normes HACCP",
                "Coordination des livraisons"
              ]}
              className="bg-black border-2 border-[#FFD700]"
            />

            <ThreeDCard
              title="Marketing & PLV"
              description="Identité, supports PDV, contenus & formation courte"
              icon={<Palette className="w-8 h-8 text-[#E31E24]" />}
              details={[
                "Création de supports PLV personnalisés",
                "Fiches produits et recettes",
                "Formation équipes sur produits belges",
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
              Être rappelé par un conseiller
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
              Témoignages et études de cas à venir
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
                Découvrez bientôt les retours d'expérience de nos partenaires
                professionnels : stations-service, restaurants, foodtrucks et
                distributeurs qui ont choisi la qualité belge pour leur offre
                snacking.
              </p>
              <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD700]" />
                  <span>Études de cas avant/après</span>
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
              Échangeons sur vos besoins spécifiques et construisons ensemble
              votre offre frites et snacks belges premium
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E31E24] rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Échanger avec un spécialiste
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
                  <p className="font-semibold mb-1">Audit personnalisé</p>
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
                  <p className="font-semibold mb-1">Réponse sous 48h</p>
                  <p className="text-sm text-gray-400">
                    Retour rapide après qualification
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
              Offres et documents techniques réservés aux comptes
              professionnels validés.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
