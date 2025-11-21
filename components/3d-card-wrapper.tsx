'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ThreeDCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  details?: string[];
  className?: string;
  children?: React.ReactNode;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  title,
  description,
  icon,
  details,
  className,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate rotation angles (reduced for subtlety)
    const rotateX = ((y - height / 2) / height) * 10;
    const rotateY = ((x - width / 2) / width) * -10;

    // Apply 3D transform with a slight scale on hover
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    // Reset transform on mouse leave
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'group relative w-full rounded-2xl border border-white/10 p-8 shadow-xl transition-transform duration-300 ease-out hover:shadow-2xl',
          className
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Icon */}
        {icon && (
          <div
            className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20"
            style={{ transform: 'translateZ(50px)' }}
          >
            {icon}
          </div>
        )}

        {/* Title */}
        <h3
          className="text-2xl font-bold mb-3"
          style={{ transform: 'translateZ(60px)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="mb-4 leading-relaxed opacity-90"
          style={{ transform: 'translateZ(70px)' }}
        >
          {description}
        </p>

        {/* Details List */}
        {details && details.length > 0 && (
          <ul
            className="space-y-2 opacity-80"
            style={{ transform: 'translateZ(80px)' }}
          >
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="opacity-60">•</span>
                <span className="text-sm">{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Custom Children */}
        {children && (
          <div style={{ transform: 'translateZ(90px)' }}>{children}</div>
        )}
      </div>
    </div>
  );
};
