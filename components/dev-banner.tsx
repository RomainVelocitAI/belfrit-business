import { Info } from "lucide-react";

export function DevBanner() {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm text-yellow-800">
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
