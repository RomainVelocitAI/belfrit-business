import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define the props for the component
interface FeatureHighlightCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  buttonText: string;
  className?: string;
}

/**
 * A responsive and animated card component to highlight a feature.
 * Built with TypeScript, Tailwind CSS, and pure CSS animations for SSR compatibility.
 * It supports shadcn/ui theming for light and dark modes.
 */
export const FeatureHighlightCard = React.forwardRef<
  HTMLDivElement,
  FeatureHighlightCardProps
>(({ imageSrc, imageAlt = "Feature image", title, description, buttonText, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-lg overflow-hidden rounded-2xl border bg-white p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-in-up",
        className
      )}
    >
      {/* Background glow effect */}
      <div className="absolute left-1/2 top-0 -z-10 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-gold/10 blur-3xl" />

      {/* Image Section */}
      <div className="mb-6 flex justify-center opacity-0 animate-scale-in animation-delay-150">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={300}
          className="h-auto w-full object-contain"
        />
      </div>

      {/* Title Section */}
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl belgium-bars opacity-0 animate-fade-in animation-delay-300">
        {title}
      </h2>

      {/* Description Section */}
      <p className="mt-4 text-base text-gray-600 leading-relaxed opacity-0 animate-fade-in animation-delay-450">
        {description}
      </p>

      {/* Button Section */}
      <div className="mt-8 opacity-0 animate-fade-in animation-delay-600">
        <Button size="lg" className="w-full sm:w-auto bg-primary-red hover:bg-red-700 transition-colors">
          {buttonText}
        </Button>
      </div>
    </div>
  );
});

FeatureHighlightCard.displayName = "FeatureHighlightCard";
