'use client';

import React from 'react';
import { SchoolProvider } from '../lib/context/SchoolContext';
import PwaController from './PwaController';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SchoolProvider>
      {children}
      <PwaController />
    </SchoolProvider>
  );
}
