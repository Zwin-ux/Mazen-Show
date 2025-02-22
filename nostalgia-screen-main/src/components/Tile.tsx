
import React from 'react';
import { cn } from "@/lib/utils";

interface TileProps {
  title: string;
  color: string;
  size?: 'small' | 'large';
  icon?: React.ReactNode;
  href: string;
  className?: string;
}

export const Tile: React.FC<TileProps> = ({ 
  title, 
  color, 
  size = 'small',
  icon,
  href,
  className
}) => {
  return (
    <a 
      href={href}
      className={cn(
        "relative group flex flex-col justify-end p-4 text-win8-light transition-all duration-300",
        "hover:animate-tile-hover cursor-pointer border border-win8-border",
        size === 'small' ? 'w-[150px] h-[150px]' : 'w-[310px] h-[150px]',
        color,
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <div className="text-2xl">{icon}</div>}
        <span className="font-segoe text-sm font-light">{title}</span>
      </div>
    </a>
  );
};
