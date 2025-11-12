'use client';

import { DynamicFrameLayout } from "@/components/ui/dynamic-frame-layout";

export default function PlvSection() {
  const frames = [
    {
      id: 1,
      image: "/plv-poster.jpg",
      defaultPos: { x: 0, y: 0, w: 4, h: 4 },
      corner: "",
      edgeHorizontal: "",
      edgeVertical: "",
      mediaSize: 1,
      borderThickness: 0,
      borderSize: 100,
      isHovered: false,
      title: "Affiches premium",
      badgeColor: "belgium" as const,
    },
    {
      id: 2,
      image: "/plv-chalkboard.jpg",
      defaultPos: { x: 4, y: 0, w: 4, h: 4 },
      corner: "",
      edgeHorizontal: "",
      edgeVertical: "",
      mediaSize: 1,
      borderThickness: 0,
      borderSize: 100,
      isHovered: false,
      title: "Ardoises & chevalets",
      badgeColor: "belgium" as const,
    },
    {
      id: 3,
      image: "/plv-supports.jpg",
      defaultPos: { x: 8, y: 0, w: 4, h: 4 },
      corner: "",
      edgeHorizontal: "",
      edgeVertical: "",
      mediaSize: 1,
      borderThickness: 0,
      borderSize: 100,
      isHovered: false,
      title: "Matériel PLV",
      badgeColor: "belgium" as const,
    },
    {
      id: 4,
      image: "/formation-recipes.jpg",
      defaultPos: { x: 0, y: 4, w: 4, h: 4 },
      corner: "",
      edgeHorizontal: "",
      edgeVertical: "",
      mediaSize: 1,
      borderThickness: 0,
      borderSize: 100,
      isHovered: false,
      title: "Recettes exclusives",
      badgeColor: "reunion" as const,
    },
    {
      id: 5,
      image: "/formation-fiches.jpg",
      defaultPos: { x: 4, y: 4, w: 4, h: 4 },
      corner: "",
      edgeHorizontal: "",
      edgeVertical: "",
      mediaSize: 1,
      borderThickness: 0,
      borderSize: 100,
      isHovered: false,
      title: "Fiches techniques",
      badgeColor: "reunion" as const,
    },
    {
      id: 6,
      image: "/formation-kit.jpg",
      defaultPos: { x: 8, y: 4, w: 4, h: 4 },
      corner: "",
      edgeHorizontal: "",
      edgeVertical: "",
      mediaSize: 1,
      borderThickness: 0,
      borderSize: 100,
      isHovered: false,
      title: "Kit formation",
      badgeColor: "reunion" as const,
    },
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            PLV & Accompagnement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des outils marketing professionnels et une formation complète pour valoriser
            vos produits belges et maitriser leur préparation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Supports visuels
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#FFD700] mt-1">●</span>
                <span>Affiches publicitaires personnalisées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD700] mt-1">●</span>
                <span>Ardoises menu et chevalets de comptoir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD700] mt-1">●</span>
                <span>Stickers et présentoirs attractifs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD700] mt-1">●</span>
                <span>Matériel PLV complet aux couleurs de la Belgique</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Formation & recettes
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#E31E24] mt-1">●</span>
                <span>Fiches techniques détaillées pour chaque produit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E31E24] mt-1">●</span>
                <span>Recettes exclusives de la gastronomie belge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E31E24] mt-1">●</span>
                <span>Formations cuisson et conseils de préparation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E31E24] mt-1">●</span>
                <span>Hotline technique disponible pour vos questions</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[900px] rounded-3xl overflow-hidden shadow-2xl">
          <DynamicFrameLayout
            frames={frames}
            showFrames={false}
            hoverSize={6}
            gapSize={4}
            className="h-full"
          />
        </div>
      </div>
    </section>
  );
}
