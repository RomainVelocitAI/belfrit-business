"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const products = [
  {
    tempId: 0,
    name: "Frites belges surgelées",
    description: "La frite traditionnelle belge dans toute son authenticité",
    details: "Classiques, ondulées, steakhouse, rustiques",
    imgSrc: "/gamme-frites.png"
  },
  {
    tempId: 1,
    name: "Croquettes de fromage",
    description: "Boulettes panées au fromage fondant, croustillantes à souhait",
    details: "Parfaites en apéritif ou accompagnement",
    imgSrc: "/gamme-croquettes.png"
  },
  {
    tempId: 2,
    name: "Fricadelle Mix",
    description: "L'assortiment de snacks frits typiquement belges",
    details: "Variété de fricadelles et boulettes panées",
    imgSrc: "/gamme-fricadelle.png"
  },
  {
    tempId: 3,
    name: "Mini Snacks",
    description: "Petites boulettes panées croustillantes et savoureuses",
    details: "Idéales pour toutes les occasions",
    imgSrc: "/gamme-mini-snacks.png"
  },
  {
    tempId: 4,
    name: "Röstis",
    description: "Galettes de pommes de terre dorées et croustillantes",
    details: "La spécialité suisse adoptée par la Belgique",
    imgSrc: "/gamme-rostis.png"
  }
];

interface ProductCardProps {
  position: number;
  product: typeof products[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  position,
  product,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out overflow-hidden",
        isCenter
          ? "z-10 bg-white border-primary-red shadow-lg"
          : "z-0 bg-white/95 border-gray-300 hover:border-primary-red/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.2) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(227, 30, 36, 0.2)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-primary-red/30"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={product.imgSrc}
        alt={product.name}
        className="mb-6 h-64 w-full object-contain"
        style={{
          boxShadow: isCenter ? "3px 3px 0px rgba(0, 0, 0, 0.1)" : "none"
        }}
      />
      <h3 className={cn(
        "text-xl sm:text-2xl font-bold mb-3",
        isCenter ? "text-gray-900" : "text-gray-700"
      )}>
        {product.name}
      </h3>
      <p className={cn(
        "text-sm mb-2",
        isCenter ? "text-gray-700" : "text-gray-600"
      )}>
        {product.description}
      </p>
      <p className={cn(
        "absolute bottom-10 left-8 right-8 text-xs italic",
        isCenter ? "text-primary-red font-semibold" : "text-gray-500"
      )}>
        {product.details}
      </p>
    </div>
  );
};

export const GammesStagger: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [productsList, setProductsList] = useState(products);

  const handleMove = (steps: number) => {
    const newList = [...productsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setProductsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setCardSize(480); // xl screens
      } else if (width >= 1024) {
        setCardSize(420); // lg screens
      } else if (width >= 640) {
        setCardSize(380); // sm screens
      } else {
        setCardSize(320); // mobile
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 700 }}
    >
      {productsList.map((product, index) => {
        const position = productsList.length % 2
          ? index - (productsList.length + 1) / 2
          : index - productsList.length / 2;
        return (
          <ProductCard
            key={product.tempId}
            product={product}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-lg",
            "bg-white border-2 border-primary-red text-primary-red hover:bg-primary-red hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
          )}
          aria-label="Produit précédent"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-lg",
            "bg-white border-2 border-primary-red text-primary-red hover:bg-primary-red hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
          )}
          aria-label="Produit suivant"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
