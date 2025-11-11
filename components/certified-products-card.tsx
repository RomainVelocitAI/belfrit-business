'use client';

import { useEffect, useRef, useState } from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';

export function CertifiedProductsCard() {
  const [cardVisible, setCardVisible] = useState(false);
  const [belgiumFlagVisible, setBelgiumFlagVisible] = useState(false);
  const [arrowProgress, setArrowProgress] = useState(0);
  const [reunionFlagVisible, setReunionFlagVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 1. Carte apparait de la gauche
            setCardVisible(true);

            // 2. Drapeau belge apparait après 1000ms
            setTimeout(() => {
              setBelgiumFlagVisible(true);

              // 3. Flèche s'anime après 500ms
              setTimeout(() => {
                let progress = 0;
                const interval = setInterval(() => {
                  progress += 5;
                  setArrowProgress(progress);
                  if (progress >= 100) {
                    clearInterval(interval);
                    // 4. Drapeau réunionnais apparait
                    setReunionFlagVisible(true);
                  }
                }, 30);
              }, 500);
            }, 1000);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[500px]">
      {/* Carte principale - slide depuis la gauche */}
      <div
        className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-1000 ${
          cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
        }`}
      >
        {/* Icône */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-gold/20 mb-4">
          <Package className="w-8 h-8 text-primary-red" />
        </div>

        {/* Titre */}
        <h3 className="text-2xl font-bold mb-4 frites-bars pb-3">Produits certifiés</h3>

        {/* Description */}
        <p className="text-gray-600 text-lg leading-relaxed">
          Approvisionnement direct Belgique, traçabilité totale, conformité réglementaire Réunion
        </p>
      </div>

      {/* Drapeau belge - positionné à droite */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 -right-32 transition-all duration-700 ${
          belgiumFlagVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      >
        <Image
          src="/flag-belgium.png"
          alt="Drapeau Belgique"
          width={120}
          height={90}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Flèche animée */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-32 transition-all duration-1500"
        style={{
          transform: `translate(${150 + (arrowProgress * 2.5)}px, -50%)`,
          opacity: arrowProgress > 0 ? 1 : 0,
        }}
      >
        <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
          <path
            d="M0 10 L30 10 L25 5 M30 10 L25 15"
            stroke="#B91C1C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Drapeau réunionnais - positionné encore plus à droite */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700`}
        style={{
          right: '-32rem',
          opacity: reunionFlagVisible ? 1 : 0,
          transform: reunionFlagVisible ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0)',
        }}
      >
        <Image
          src="/flag-reunion.png"
          alt="Drapeau Réunion"
          width={120}
          height={90}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
