'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CataloguePage() {
  const [showMaintenance, setShowMaintenance] = useState(true);

  return (
    <main className="min-h-screen bg-white">
      {/* Popup de maintenance */}
      {showMaintenance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop flou */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowMaintenance(false)}
          />

          {/* Popup */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-in fade-in zoom-in duration-300">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowMaintenance(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icône de maintenance */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-belfrit-yellow rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-belfrit-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
            </div>

            {/* Contenu */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Page en cours de maintenance
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Notre catalogue produits est actuellement en cours de mise à jour pour vous offrir une meilleure expérience.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Pour consulter nos produits, n'hésitez pas à nous contacter directement.
              </p>

              {/* Boutons d'action */}
              <div className="space-y-3">
                <a
                  href="/#contact"
                  className="block w-full bg-belfrit-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-belfrit-red-dark transition-colors"
                >
                  Nous contacter
                </a>
                <button
                  onClick={() => setShowMaintenance(false)}
                  className="block w-full border-2 border-gray-200 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* Barre de couleurs belges */}
            <div className="flex gap-2 mt-6 pt-6 border-t border-gray-200">
              <div className="flex-1 h-2 bg-black rounded-full"></div>
              <div className="flex-1 h-2 bg-belfrit-yellow rounded-full"></div>
              <div className="flex-1 h-2 bg-belfrit-red rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de la page (flouté quand popup ouvert) */}
      <div className={showMaintenance ? 'blur-sm pointer-events-none' : ''}>
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 belgium-bars pb-3 inline-block">
            Notre catalogue
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              Découvrez notre gamme complète de produits belges premium pour professionnels.
            </p>
          </div>

          {/* Grille de produits placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
