import React from "react";
import { Link } from "react-router-dom";

/**
 * Interactive Logo Component for GharTokri
 * Combines "Ghar" (Home roof silhouette) + "Tokri" (Fresh harvest basket)
 * Features micro-animations on hover: basket tilt, leaf sway, sparkle gleam.
 */
const Logo = ({
  size = "md", // "sm" | "md" | "lg"
  showTagline = false,
  className = "",
  asLink = true,
  onClick,
}) => {
  // Dimensions and text sizing configurations based on size prop
  const config = {
    sm: {
      box: "h-8 w-8",
      svg: 22,
      title: "text-lg",
      tagline: "text-[9px]",
      gap: "gap-2",
    },
    md: {
      box: "h-10 w-10 sm:h-11 sm:w-11",
      svg: 28,
      title: "text-xl sm:text-2xl",
      tagline: "text-[11px]",
      gap: "gap-2.5",
    },
    lg: {
      box: "h-14 w-14 sm:h-16 sm:w-16",
      svg: 38,
      title: "text-3xl sm:text-4xl",
      tagline: "text-xs sm:text-sm",
      gap: "gap-3.5",
    },
  }[size] || {
    box: "h-10 w-10",
    svg: 28,
    title: "text-2xl",
    tagline: "text-[11px]",
    gap: "gap-2.5",
  };

  const content = (
    <div
      className={`group inline-flex items-center ${config.gap} select-none cursor-pointer transition-transform duration-200 active:scale-95 ${className}`}
      onClick={onClick}
    >
      {/* Interactive Icon Box */}
      <div
        className={`relative flex ${config.box} shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-md shadow-amber-500/25 transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-lg group-hover:shadow-amber-500/40 ring-1 ring-yellow-400/40`}
      >
        {/* Soft Ambient Inner Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 via-transparent to-white/40 pointer-events-none" />

        {/* SVG Artwork: Home Roof + Tokri Basket + Fresh Produce */}
        <svg
          width={config.svg}
          height={config.svg}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 group-hover:scale-110"
        >
          {/* 1. Fresh Produce peeking from basket */}
          {/* Red Apple / Tomato */}
          <circle
            cx="21"
            cy="20"
            r="5.5"
            fill="#EF4444"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          <circle cx="20" cy="18" r="1.5" fill="#FCA5A5" opacity="0.8" />

          {/* Golden Orange / Citrus */}
          <circle
            cx="29"
            cy="21"
            r="5"
            fill="#F97316"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
          <circle cx="28" cy="19" r="1.2" fill="#FED7AA" opacity="0.8" />

          {/* Interactive Swaying Green Sprout / Leaf */}
          <path
            d="M21 16C21 16 23 10 28 11C28 11 28 15 23 16"
            fill="#22C55E"
            className="transition-transform duration-500 origin-bottom-left group-hover:rotate-12 group-hover:scale-110"
          />
          <path
            d="M17 18C17 18 14 13 18 11C18 11 20 14 18 18"
            fill="#16A34A"
            className="transition-transform duration-500 origin-bottom-right group-hover:-rotate-12"
          />

          {/* 2. Home Roof Silhouette (Ghar) Arch Handle */}
          <path
            d="M12 21L24 10L36 21"
            stroke="#78350F"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 group-hover:stroke-amber-950"
          />

          {/* Roof Peak Chimney / Home Accent */}
          <path
            d="M30 14.5V11.5H32.5V17"
            stroke="#78350F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. Woven Tokri (Basket Base) */}
          <path
            d="M13 22H35L33.2 36.5C33 38.5 31.3 40 29.3 40H18.7C16.7 40 15 38.5 14.8 36.5L13 22Z"
            fill="#92400E"
            stroke="#78350F"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-colors duration-300 group-hover:fill-amber-800"
          />

          {/* Basket Weave Textures */}
          <path
            d="M14 26.5H34"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M15 31H33"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M16.5 35.5H31.5"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Diagonal Weave Accents */}
          <path d="M19 23L22 39" stroke="#78350F" strokeWidth="1.2" opacity="0.6" />
          <path d="M29 23L26 39" stroke="#78350F" strokeWidth="1.2" opacity="0.6" />

          {/* 4. Magic Delivery Sparkle */}
          <path
            d="M37 10L37.8 12.2L40 13L37.8 13.8L37 16L36.2 13.8L34 13L36.2 12.2L37 10Z"
            fill="#FEF08A"
            className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-45"
          />
        </svg>

        {/* Floating Mini Leaf Ping on Hover */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white shadow-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-bounce">
          🌱
        </span>
      </div>

      {/* Typography Block */}
      <div className="flex flex-col text-left">
        <div className={`flex items-center font-extrabold tracking-tight ${config.title}`}>
          <span className="text-gray-900 transition-colors duration-200 group-hover:text-black">
            Ghar
          </span>
          <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent transition-all duration-200 group-hover:from-amber-600 group-hover:to-yellow-500">
            Tokri
          </span>

          {/* Little Sprout Badge next to brand */}
          <span className="ml-1 inline-block text-xs transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
            🧺
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-medium text-gray-500 transition-colors duration-200 group-hover:text-amber-700 leading-tight ${config.tagline}`}
          >
            A basket of daily essentials delivered home
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" aria-label="GharTokri — Home" className="no-underline inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
