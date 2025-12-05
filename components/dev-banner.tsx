'use client'

import { usePathname } from "next/navigation";
import { Info } from "lucide-react";

export function DevBanner() {
  const pathname = usePathname();

  // Ne pas afficher sur l'espace client et l'admin
  if (pathname.startsWith('/espace-client') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed top-32 left-0 right-0 z-40 bg-belfrit-red border-b border-belfrit-red-dark">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-sm text-white">
          <Info className="h-4 w-4 flex-shrink-0" />
          <p className="text-center">
            <span className="font-semibold">Site en cours de développement</span> -
            BelFrit Business ne dispose pas de marque propre et les photos sont générées par IA et non contractuelles
          </p>
        </div>
      </div>
    </div>
  );
}
