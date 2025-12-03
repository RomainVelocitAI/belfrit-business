'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

interface FlipCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  buttonText: string;
  backContent: {
    title: string;
    details: string[];
  };
  className?: string;
  parallaxSpeed?: number; // 0 = fixe, 1 = vitesse normale, 2 = vitesse double
}

export const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  ({ imageSrc, imageAlt = "Feature image", title, description, buttonText, backContent, className, parallaxSpeed = 0 }, ref) => {
    const [isFlipped, setIsFlipped] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const uniqueId = React.useId();

    // Hook de parallax
    const { scrollYProgress } = useScroll({
      target: cardRef,
      offset: ["start end", "end start"]
    });

    // Transformation du scroll en mouvement Y
    // parallaxSpeed = 0 : pas de mouvement (fixe)
    // parallaxSpeed = 1 : mouvement de -100px à 100px
    // parallaxSpeed = 2 : mouvement de -200px à 200px
    const y = useTransform(
      scrollYProgress,
      [0, 1],
      [parallaxSpeed * -100, parallaxSpeed * 100]
    );

    const handleFlip = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Flip clicked!', uniqueId);
      setIsFlipped(true);
    }, [uniqueId]);

    const handleUnflip = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Unflip clicked!', uniqueId);
      setIsFlipped(false);
    }, [uniqueId]);

    return (
      <motion.div
        ref={cardRef}
        style={{ y: parallaxSpeed > 0 ? y : 0 }}
        className={cn(
          "relative w-full max-w-lg h-[580px] perspective-1000 pointer-events-none",
          className
        )}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 transform-style-3d pointer-events-none",
            isFlipped ? "rotate-y-180" : ""
          )}
        >
          {/* Face avant */}
          <div className="absolute w-full h-full backface-hidden pointer-events-none">
            <div className="relative h-full rounded-2xl border bg-white/90 backdrop-blur-sm p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 pointer-events-none">
              {/* Background glow effect */}
              <div className="absolute left-1/2 top-0 -z-10 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-gold/10 blur-3xl" />

              {/* Image Section */}
              <div className="mb-6 flex justify-center flex-shrink-0 h-[240px]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={400}
                  height={300}
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Title Section */}
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl belgium-bars pb-4">
                {title}
              </h2>

              {/* Description Section */}
              <p className="text-base text-gray-600 leading-relaxed">
                {description}
              </p>

              {/* Button Section - positionné en absolu par rapport au conteneur */}
              <div className="absolute bottom-8 left-0 right-0 text-center z-50 pointer-events-auto">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleFlip}
                  className="bg-belfrit-red text-white hover:bg-belfrit-red mx-auto pointer-events-auto cursor-pointer"
                >
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>

          {/* Face arrière */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 pointer-events-none">
            <div className="relative h-full rounded-2xl border bg-white/90 backdrop-blur-sm p-8 shadow-lg pointer-events-none">
              {/* Background glow effect */}
              <div className="absolute left-1/2 top-0 -z-10 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-gold/10 blur-3xl" />

              {/* Bouton fermer */}
              <button
                type="button"
                onClick={handleUnflip}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors pointer-events-auto cursor-pointer z-50"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>

              {/* Contenu arrière */}
              <div>
                <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
                  {backContent.title}
                </h3>

                <ul className="space-y-4 text-lg">
                  {backContent.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary-red text-2xl flex-shrink-0">•</span>
                      <span className="leading-relaxed text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button Section - positionné en absolu par rapport au conteneur */}
              <div className="absolute bottom-8 left-0 right-0 text-center z-50 pointer-events-auto">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleUnflip}
                  className="bg-belfrit-red text-white hover:bg-belfrit-red mx-auto pointer-events-auto cursor-pointer"
                >
                  Retour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

FlipCard.displayName = "FlipCard";
