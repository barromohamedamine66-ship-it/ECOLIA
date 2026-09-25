'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured } from '../lib/supabase/client';

export default function HomePage() {
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="p-6 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-900/50">
              É
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                ÉCOLIA
              </span>
              <span className="block text-xs text-amber-400 font-semibold tracking-wider uppercase">
                L'école, simplement.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
              supabaseReady ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${supabaseReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {supabaseReady ? 'Supabase Connecté' : 'Mode Démo Local Actif'}
            </div>

            <Link
              href="/notifications"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all relative border border-slate-750"
              title="Centre de Notifications"
            >
              <i className="fa-solid fa-bell text-amber-400 text-sm"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                2
              </span>
            </Link>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-emerald-600/30 flex items-center gap-2"
            >
              <i className="fa-solid fa-lock"></i>
              Connexion SaaS
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <i className="fa-solid fa-graduation-cap"></i>
            Plateforme Scolaire Conçue pour la Côte d'Ivoire & l'Afrique Francophone
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            L'infrastructure numérique de l'établissement scolaire africain.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Portails dédiés pour la Direction, les Enseignants, les Parents et les Élèves avec isolation multi-tenant, notes, bulletins A4, finances en FCFA et centre de communication.
          </p>
        </div>

        {/* 4 Primary Portals Grid */}
        <div className="max-w-6xl mx-auto w-full space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <i className="fa-solid fa-users-viewfinder"></i>
                Espaces Utilisateurs & Portails Dédiés
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-700/80 border border-purple-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-school"></i>
                </div>
                <span className="text-[10px] font-bold text-purple-300 uppercase block mb-1">Direction & Admin</span>
                <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-purple-300">Portail Administration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Supervision 360°, scolarité, validation des notes, finances et effectifs.</p>
              </Link>

              <Link href="/teacher" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-700/80 border border-emerald-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-chalkboard-user"></i>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase block mb-1">Corps Enseignant</span>
                <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-emerald-300">Portail Enseignant</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Mes classes assignées, feuille d'appel rapide, saisie des devoirs et planning.</p>
              </Link>

              <Link href="/parent" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-people-roof"></i>
                </div>
                <span className="text-[10px] font-bold text-amber-300 uppercase block mb-1">Famille & Tuteurs</span>
                <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-amber-300">Portail Parent</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Sélecteur multi-enfants, notes, bulletins A4 MENA, assiduité et reçus FCFA.</p>
              </Link>

              <Link href="/student" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-700/80 border border-blue-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-user-graduate"></i>
                </div>
                <span className="text-[10px] font-bold text-blue-300 uppercase block mb-1">Apprenant</span>
                <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-blue-300">Portail Élève</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Espace personnel restreint, cours du jour, moyennes, bulletins et devoirs.</p>
              </Link>
            </div>
          </div>

          {/* Module Direct Access */}
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-800">
            <Link href="/documents" className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-3">
              <i className="fa-solid fa-folder-closed text-cyan-400 text-base"></i>
              <span>Coffre-fort Documents</span>
            </Link>
            <Link href="/announcements" className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-3">
              <i className="fa-solid fa-bullhorn text-purple-400 text-base"></i>
              <span>Annonces Scolaires</span>
            </Link>
            <Link href="/notifications" className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-3">
              <i className="fa-solid fa-bell text-amber-400 text-base"></i>
              <span>Notifications & Alertes</span>
            </Link>
            <Link href="/grades" className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-3">
              <i className="fa-solid fa-pen-to-square text-emerald-400 text-base"></i>
              <span>Notes & Bulletins</span>
            </Link>
            <Link href="/finance" className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-3">
              <i className="fa-solid fa-coins text-yellow-400 text-base"></i>
              <span>Finances & Caisse</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>ÉCOLIA © 2026 — L'école, simplement. Conçu à Abidjan pour l'Afrique francophone.</p>
      </footer>
    </div>
  );
}
