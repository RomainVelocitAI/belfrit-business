'use client';

import * as React from "react";
import { FlipCard } from "./flip-card";
import { ChefHat, Store, Building } from "lucide-react";

export const SegmentsFlipCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Carte 1 - Restauration - Parallax fort */}
      <FlipCard
        parallaxSpeed={2}
        imageSrc="/segment-restauration.jpg"
        imageAlt="Restaurant professionnel"
        title="Restauration"
        description="Solutions pour restaurants traditionnels, fast-food, food-trucks"
        buttonText="En savoir plus"
        backContent={{
          title: "Restauration",
          details: [
            "• Restaurants traditionnels",
            "• Fast-food et snacks",
            "• Food-trucks",
            "• Restaurants d'hôtels"
          ]
        }}
      />

      {/* Carte 2 - Distribution - Parallax modéré */}
      <FlipCard
        parallaxSpeed={1}
        imageSrc="/segment-distribution.jpg"
        imageAlt="Point de vente"
        title="Distribution"
        description="Solutions pour supérettes, stations-service, cafétérias"
        buttonText="En savoir plus"
        backContent={{
          title: "Distribution",
          details: [
            "• Supérettes et épiceries",
            "• Stations-service",
            "• Cafétérias d'entreprise",
            "• Points de vente isolés",
            "PLV et support merchandising fournis"
          ]
        }}
      />

      {/* Carte 3 - Collectivités - Fixe (ancre) */}
      <FlipCard
        parallaxSpeed={0}
        imageSrc="/segment-collectivites.jpg"
        imageAlt="Restauration collective"
        title="Collectivites"
        description="Solutions pour cantines, restaurants d'entreprise, établissements de santé"
        buttonText="En savoir plus"
        backContent={{
          title: "Collectivites",
          details: [
            "• Cantines scolaires",
            "• Restaurants d'entreprise",
            "• Etablissements de sante",
            "• Centres de loisirs",
            "Volumes adaptes et facturation simplifiee"
          ]
        }}
      />
    </div>
  );
};
