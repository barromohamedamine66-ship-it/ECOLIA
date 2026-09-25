'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSchool } from '../lib/context/SchoolContext';
import SchoolSwitcherModal from '../components/SchoolSwitcherModal';

export default function HomePage() {
  const { currentSchool, allSchools } = useSchool();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [quickCode, setQuickCode] = useState('');
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError(null);
    const code = quickCode.trim().toUpperCase();

    if (!code) return;

    // Direct code handling
    const matchingSchool = allSchools.find(s => s.code.toUpperCase() === code);
    if (matchingSchool) {
      window.location.href = '/admin';
      return;
    }
    if (code.startsWith('TEA') || code.startsWith('PROF') || code.includes('KOFFI')) {
      window.location.href = '/teacher';
      return;
    }
    if (code.startsWith('ECO') || code.startsWith('STU') || code.includes('2026')) {
      window.location.href = '/student';
      return;
    }
    if (code.startsWith('PAR') || code.includes('TRAORE')) {
      window.location.href = '/parent';
      return;
    }

    setQuickError('Code non reconnu. Ouvrez le sélecteur pour choisir votre école ou essayer un autre code.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="p-5 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 bg-slate-900/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-950/50">
              SL
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                SCHOOLLIFE
              </span>
              <span className="block text-[10px] text-amber-400 font-bold tracking-wider uppercase">
                L'école, simplement.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active School Switcher Button */}
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2.5 transition-all shadow-md group"
              title="Changer d'Établissement ou Saisir un Code"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-left">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Établissement Actif</span>
                <span className="text-xs font-black text-emerald-300 group-hover:text-emerald-200 truncate max-w-[180px] sm:max-w-xs block">
                  {currentSchool.name}
                </span>
              </div>
              <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 group-hover:text-white ml-1"></i>
            </button>

            <Link
              href="/notifications"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-all relative border border-slate-750"
              title="Centre de Notifications"
            >
              <i className="fa-solid fa-bell text-amber-400 text-sm"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                2
              </span>
            </Link>

            <Link
              href="/super-admin/schools"
              className="hidden md:flex px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-300 font-bold text-xs transition-all border border-amber-500/40 items-center gap-2"
              title="Super Administration Multi-Établissements"
            >
              <i className="fa-solid fa-building-columns text-amber-400"></i>
              Gérer les Écoles ({allSchools.length})
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col justify-center space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
            <i className="fa-solid fa-graduation-cap text-emerald-400"></i>
            Multi-Tenant SaaS • Côte d'Ivoire & Afrique Francophone
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            L'infrastructure numérique de l'établissement scolaire africain.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Chaque école dispose de son espace 100% isolé et personnalisé avec logo, bulletins officiels MENA certifiés, devises, finances en FCFA et codes d'accès directs.
          </p>
        </div>

        {/* Guichet d'Accès Rapide par Code ou Sélection d'École */}
        <div className="max-w-3xl mx-auto w-full bg-slate-850/90 backdrop-blur-md p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                <i className="fa-solid fa-key"></i>
              </span>
              <div>
                <h3 className="font-black text-sm text-white">
                  Guichet d'Accès Rapide par Code ou Sélection d'Établissement
                </h3>
                <p className="text-[11px] text-slate-400">
                  Enseignant, Parent, Élève ou Direction : connectez-vous directement
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <i className="fa-solid fa-building-columns"></i>
              Changer d'École ({allSchools.length})
            </button>
          </div>

          <form onSubmit={handleQuickCodeSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <i className="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={quickCode}
                onChange={e => setQuickCode(e.target.value)}
                placeholder="Entrez votre code (ex: HORIZON-ABJ, TEA-9821, ECO-2026-00001)..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              Accéder
            </button>
          </form>

          {quickError && (
            <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
              <i className="fa-solid fa-circle-exclamation"></i>
              {quickError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="font-bold text-slate-500">Exemples de démo :</span>
            <button
              type="button"
              onClick={() => setQuickCode('HORIZON-ABJ')}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[10px] border border-slate-700"
            >
              HORIZON-ABJ (École)
            </button>
            <button
              type="button"
              onClick={() => setQuickCode('TEA-9821')}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-[10px] border border-slate-700"
            >
              TEA-9821 (Enseignant)
            </button>
            <button
              type="button"
              onClick={() => setQuickCode('ECO-2026-00001')}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 font-mono text-[10px] border border-slate-700"
            >
              ECO-2026-00001 (Élève)
            </button>
          </div>
        </div>

        {/* 4 Primary Portals Grid */}
        <div className="max-w-6xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <i className="fa-solid fa-users-viewfinder"></i>
              Espaces Dédiés — {currentSchool.name}
            </h2>
            <span className="text-[11px] text-amber-300 font-mono font-bold">
              Code : {currentSchool.code}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-750 border border-purple-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl mb-4 border border-purple-500/30">
                <i className="fa-solid fa-school"></i>
              </div>
              <span className="text-[10px] font-bold text-purple-300 uppercase block mb-1">Direction & Admin</span>
              <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-purple-300">Portail Administration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Supervision 360°, validation des notes, finances en FCFA et personnalisation de l'école.</p>
            </Link>

            <Link href="/teacher" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-750 border border-emerald-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-4 border border-emerald-500/30">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 uppercase block mb-1">Corps Enseignant</span>
              <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-emerald-300">Portail Enseignant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Classes assignées, feuille d'appel rapide, saisie des devoirs et planning.</p>
            </Link>

            <Link href="/parent" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-750 border border-amber-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-4 border border-amber-500/30">
                <i className="fa-solid fa-people-roof"></i>
              </div>
              <span className="text-[10px] font-bold text-amber-300 uppercase block mb-1">Famille & Tuteurs</span>
              <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-amber-300">Portail Parent</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Sélecteur multi-enfants, notes, bulletins A4 MENA, assiduité et reçus FCFA.</p>
            </Link>

            <Link href="/student" className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-750 border border-blue-500/40 text-left transition-all group shadow-xl hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-4 border border-blue-500/30">
                <i className="fa-solid fa-user-graduate"></i>
              </div>
              <span className="text-[10px] font-bold text-blue-300 uppercase block mb-1">Apprenant</span>
              <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-blue-300">Portail Élève</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Espace personnel restreint, cours du jour, moyennes, bulletins et devoirs.</p>
            </Link>
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
        <p>SCHOOLLIFE © 2026 — L'école, simplement. Conçu pour l'Afrique francophone.</p>
      </footer>

      {/* School Switcher & Universal Access Modal */}
      <SchoolSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
}
