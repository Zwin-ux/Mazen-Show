import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

interface TileProps {
  title: string;
  color: string;
  size?: 'small' | 'large';
  icon?: React.ReactNode;
  href: string;
  className?: string;
  subtitle?: string; // Added for extra flair
  glow?: boolean; // Toggleable glow effect
}

export const Tile: React.FC<TileProps> = ({
  title,
  color,
  size = 'small',
  icon,
  href,
  className,
  subtitle,
  glow = true,
}) => {
  const tileVariants = {
    rest: { scale: 1, rotate: 0, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' },
    hover: {
      scale: 1.05,
      rotate: 1,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    tap: { scale: 0.95, rotate: -1 },
  };

  return (
    <motion.a
      href={href}
      variants={tileVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "relative group flex flex-col justify-end p-6 text-white rounded-xl overflow-hidden",
        "cursor-pointer border border-gray-800/50 backdrop-blur-sm",
        size === 'small' ? 'w-[150px] h-[150px]' : 'w-[310px] h-[150px]',
        color,
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow Effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: [
              `0 0 15px ${color}80`,
              `0 0 25px ${color}40`,
              `0 0 15px ${color}80`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-1 transform translate-z-10">
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {icon}
            </motion.div>
          )}
          <span className="font-sans text-lg font-medium tracking-wide drop-shadow">
            {title}
          </span>
        </div>
        {subtitle && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-xs text-white/80"
          >
            {subtitle}
          </motion.span>
        )}
      </div>

      {/* Hover Border Effect */}
      <motion.div
        className="absolute inset-0 border-2 border-transparent rounded-xl"
        whileHover={{
          borderColor: `${color}80`,
          transition: { duration: 0.3 },
        }}
      />

      {/* Particle Effect on Hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        whileHover={{
          background: `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 70%)`,
          transition: { duration: 0.5 },
        }}
      />
    </motion.a>
  );
};