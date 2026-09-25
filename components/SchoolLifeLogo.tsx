'use client';

import React from 'react';
import Link from 'next/link';

interface SchoolLifeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  withTagline?: boolean;
  href?: string;
}

export default function SchoolLifeLogo({
  size = 'md',
  withText = true,
  withTagline = true,
  href = '/',
}: SchoolLifeLogoProps) {
  const iconSizeClasses = {
    sm: 'w-9 h-9 text-base rounded-xl',
    md: 'w-11 h-11 text-xl rounded-2xl',
    lg: 'w-14 h-14 text-2xl rounded-3xl',
  }[size];

  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  const content = (
    <div className="flex items-center gap-3 group">
      {/* Visual Vector Icon Container */}
      <div className={`${iconSizeClasses} bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-1.5 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30 group-hover:scale-105 transition-transform`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" className="w-full h-full">
          <defs>
            <linearGradient id="slGoldInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
          </defs>
          <polygon points="96,25 145,50 96,75 47,50" fill="url(#slGoldInner)" />
          <path d="M 91,88 C 68,74 46,84 34,95 L 34,146 C 52,137 74,128 91,143 Z" fill="#ffffff" opacity="0.95" />
          <path d="M 101,88 C 124,74 146,84 158,95 L 158,146 C 140,137 118,128 101,143 Z" fill="#a7f3d0" />
          <rect x="93" y="84" width="6" height="66" rx="3" fill="url(#slGoldInner)" />
          <circle cx="96" cy="80" r="6" fill="#ffffff" />
        </svg>
      </div>

      {withText && (
        <div>
          <span className={`${titleSizeClasses} font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent block leading-tight`}>
            SCHOOLLIFE
          </span>
          {withTagline && (
            <span className="block text-[10px] text-amber-400 font-bold tracking-wider uppercase">
              L'école, simplement.
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
