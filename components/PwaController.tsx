'use client';

import React, { useEffect, useState } from 'react';

export default function PwaController() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Enregistrement du Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(reg => {
            console.log('✅ ÉCOLIA PWA Service Worker enregistré avec succès:', reg.scope);
          })
          .catch(err => {
            console.warn('⚠️ Erreur enregistrement Service Worker:', err);
          });
      });
    }

    // 2. Détection si déjà installé en mode Standalone (App)
    if (typeof window !== 'undefined') {
      const isApp = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      setIsStandalone(isApp);
    }

    // 3. Capture de l'événement d'installation Android/Chrome/iOS
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showInstallBanner) {
    return null;
  }

  return (
    <aside aria-label="Installation de l'application" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-bounce-short">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 border border-emerald-500/50 shadow-2xl flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-lg text-white shadow-md">
            É
          </div>
          <div>
            <p className="text-xs font-bold text-white">Installer l'application ÉCOLIA</p>
            <p className="text-[11px] text-slate-400">Accès rapide sur votre écran d'accueil</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInstallBanner(false)}
            className="p-1.5 text-slate-400 hover:text-white text-xs"
            title="Ignorer"
          >
            ✕
          </button>
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <i className="fa-solid fa-download text-[10px]"></i>
            Installer
          </button>
        </div>
      </div>
    </aside>
  );
}
