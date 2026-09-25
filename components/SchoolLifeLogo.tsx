'use client';

import React from 'react';
import Link from 'next/link';

interface SchoolLifeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withTagline?: boolean;
  href?: string;
  className?: string;
}

export default function SchoolLifeLogo({
  size = 'md',
  withText = true,
  withTagline = true,
  href = '/',
  className = '',
}: SchoolLifeLogoProps) {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  const titleSizeClasses = {
    sm: 'text-base font-extrabold',
    md: 'text-xl font-black',
    lg: 'text-2xl font-black',
    xl: 'text-4xl font-black',
  }[size];

  const taglineSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Visual Vector Emblem */}
      <div
        className={`${iconDimensions} shrink-0 relative rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-1.5 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30 group-hover:scale-105 group-hover:border-emerald-300/50 transition-all duration-300`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192 192"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="slGoldEmblem" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="slCyanEmblem" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Academic Diamond Cap */}
          <polygon points="96,20 150,48 96,76 42,48" fill="url(#slGoldEmblem)" />
          <polygon points="96,28 140,50 96,70 52,50" fill="#fef08a" opacity="0.6" />
          <path d="M 140,54 Q 152,70 148,92" fill="none" stroke="url(#slGoldEmblem)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="148" cy="95" r="4" fill="url(#slGoldEmblem)" />

          {/* Open Knowledge Wings */}
          {/* Left Wing */}
          <path
            d="M 90,88 C 66,74 44,83 30,94 C 27,96 25,100 25,104 L 25,150 C 25,155 29,158 34,156 C 50,147 70,140 90,152 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          {/* Right Wing */}
          <path
            d="M 102,88 C 126,74 148,83 162,94 C 165,96 167,100 167,104 L 167,150 C 167,155 163,158 158,156 C 142,147 122,140 102,152 Z"
            fill="url(#slCyanEmblem)"
          />

          {/* Central Torch Spine */}
          <rect x="92.5" y="82" width="7" height="74" rx="3.5" fill="url(#slGoldEmblem)" />
          <circle cx="96" cy="80" r="6" fill="#ffffff" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span
            className={`${titleSizeClasses} tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 dark:from-white dark:via-slate-100 dark:to-emerald-300 bg-clip-text text-transparent block leading-none`}
          >
            SCHOOLLIFE
          </span>
          {withTagline && (
            <span className={`${taglineSizeClasses} text-amber-500 dark:text-amber-400 font-bold tracking-wider uppercase mt-1`}>
              L'école, simplement.
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center text-decoration-none">
        {content}
      </Link>
    );
  }

  return content;
}
