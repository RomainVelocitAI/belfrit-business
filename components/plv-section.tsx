'use client';

import { DynamicFrameLayout } from "@/components/ui/dynamic-frame-layout";

export default function PlvSection() {
  const frames = [
    {
      id: 1,
      image: "/plv-poster.jpg",
      defaultPos: { x: 0, y: 0, w: 6, h: 4 },
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
      defaultPos: { x: 6, y: 0, w: 6, h: 4 },
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
      defaultPos: { x: 0, y: 4, w: 6, h: 4 },
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
      id: 5,
      image: "/formation-fiches.jpg",
      defaultPos: { x: 6, y: 4, w: 6, h: 4 },
      corner: "",
      edgeHorizontal: "",
      edgeVertical: "",
      mediaSize: 1,
      borderThickness: 0,
      borderSize: 100,
      isHovered: false,
      title: "Fiches techniques",
      badgeColor: "belgium" as const,
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
            Des outils marketing professionnels pour valoriser
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
                <span className="text-belfrit-yellow mt-1">●</span>
                <span>
                  Affiches publicitaires
                  <span className="relative inline-block group ml-1">
                    <span className="text-belfrit-yellow cursor-help">*</span>
                    <span className="invisible group-hover:visible absolute left-0 top-6 w-64 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 z-10 shadow-lg">
                      Disponibilité selon les stocks et le volume de commande
                    </span>
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-belfrit-yellow mt-1">●</span>
                <span>Ardoises menu et chevalets de comptoir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-belfrit-yellow mt-1">●</span>
                <span>Stickers et présentoirs attractifs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-belfrit-yellow mt-1">●</span>
                <span>Matériel PLV complet aux couleurs de la Belgique</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Fiches & recettes
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-belfrit-red mt-1">●</span>
                <span>Fiches techniques détaillées pour chaque produit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-belfrit-red mt-1">●</span>
                <span>Fiches cuisson et conseils de préparation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-belfrit-red mt-1">●</span>
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
