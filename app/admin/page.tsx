'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudents } from '../../lib/services/students';
import { getClasses } from '../../lib/services/classes';
import { getGlobalFinancialDashboard } from '../../lib/services/finance';
import { getRecentPayments } from '../../lib/services/payments';
import { formatFCFA } from '../../lib/calculations/finance';
import { useSchool } from '../../lib/context/SchoolContext';
import SchoolSwitcherModal from '../../components/SchoolSwitcherModal';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';

export default function AdminPortalPage() {
  const { currentSchool } = useSchool();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [classCount, setClassCount] = useState<number>(0);
  const [financeSummary, setFinanceSummary] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const [stuRes, clsRes, finRes, payRes] = await Promise.all([
        getStudents(),
        getClasses(),
        getGlobalFinancialDashboard(),
        getRecentPayments(5),
      ]);
      setStudentCount(stuRes.data?.length || 0);
      setClassCount(clsRes.data?.length || 0);
      setFinanceSummary(finRes.summary);
      setRecentPayments(payRes.data || []);
      setLoading(false);
    }
    loadStats();
  }, [currentSchool.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-900/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SchoolLifeLogo size="sm" withText={false} href="/" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  Portail Direction & Administration
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Directeur des Études
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentSchool.name} • Année Académique 2026-2027</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-sm"
              title="Changer d'Établissement"
            >
              <i className="fa-solid fa-building-columns text-emerald-400"></i>
              <span className="hidden sm:inline">Changer d'École</span>
            </button>

            <Link
              href="/admin/settings"
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:scale-[1.02]"
              title="Personnalisation Logo, Bulletins & Infos École"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
              <span>Personnaliser l'Établissement</span>
            </Link>

            <Link
              href="/notifications"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-all relative border border-slate-700 text-xs font-bold"
              title="Centre de Notifications"
            >
              <i className="fa-solid fa-bell text-amber-400 text-sm"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                2
              </span>
            </Link>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              Accueil SaaS
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Contextual Visual Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 shadow-2xl bg-slate-900 group">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/admin_hero.jpg"
              alt="Administration Scolaire Écolia"
              className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
          </div>

          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                <i className="fa-solid fa-shield-halved"></i>
                Pilotage Centralisé & Conformité MENA
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Supervision Intégrale de l'Établissement
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Suivez en temps réel les effectifs inscrits, les validations de notes trimestrielles, les recouvrements en FCFA et configurez l'image de marque de vos bulletins officiels.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/settings"
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <i className="fa-solid fa-paintbrush text-sm"></i>
                Logo & En-tête Bulletins
              </Link>
              <Link
                href="/students/import"
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-2xl border border-emerald-500/40 shadow-lg flex items-center gap-2.5 transition-all"
              >
                <i className="fa-solid fa-file-excel text-sm"></i>
                Import Élèves Excel
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Élèves Inscrits</span>
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-user-graduate"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-white block mt-3 font-mono">
              {loading ? '...' : studentCount}
            </span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Répertoire Actif 2026-2027
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classes & Niveaux</span>
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-chalkboard"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-white block mt-3 font-mono">
              {loading ? '...' : classCount}
            </span>
            <span className="text-[11px] text-purple-300 font-semibold mt-2 block">
              Collège (6e-3e) • Lycée (2nde-Tle)
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Encaissements FCFA</span>
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm">
                <i className="fa-solid fa-coins"></i>
              </span>
            </div>
            <span className="text-2xl font-black text-emerald-300 block mt-3 font-mono">
              {loading || !financeSummary ? '...' : formatFCFA(financeSummary.totalCollected)}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 mt-2 block">
              Taux de Recouvrement : {financeSummary?.globalRecoveryRate || 0}%
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux d'Assiduité</span>
              <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-clipboard-check"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-teal-300 block mt-3 font-mono">
              94.2%
            </span>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Présences déclarées cette semaine
            </span>
          </div>
        </div>

        {/* Action Center Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pedagogie Shortcuts */}
          <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-3">
            <h2 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-book-open"></i> Pédagogie & Notes
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/grades" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-emerald-300">Validation des Notes (MENA)</span>
                <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-emerald-400"></i>
              </Link>
              <Link href="/report-cards" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-emerald-300">Édition des Bulletins A4</span>
                <i className="fa-solid fa-print text-slate-500 group-hover:text-emerald-400"></i>
              </Link>
              <Link href="/assessments" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-emerald-300">Calendrier des Évaluations</span>
                <i className="fa-solid fa-calendar-days text-slate-500 group-hover:text-emerald-400"></i>
              </Link>
            </div>
          </div>

          {/* Scolarité Shortcuts */}
          <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-blue-500/30 shadow-xl space-y-3">
            <h2 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-user-graduate"></i> Scolarité & Effectifs
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/students" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-blue-300">Fiches Élèves & Matricules</span>
                <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-blue-400"></i>
              </Link>
              <Link href="/students/import" className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-between block transition-colors">
                <span>Importation Massive Excel</span>
                <i className="fa-solid fa-file-excel text-emerald-400"></i>
              </Link>
              <Link href="/teachers" className="p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 flex items-center justify-between block transition-colors">
                <span>Enseignants & Codes WhatsApp</span>
                <i className="fa-solid fa-chalkboard-user text-purple-400"></i>
              </Link>
              <Link href="/attendance" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-blue-300">Feuille d'Appel & Présences</span>
                <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-blue-400"></i>
              </Link>
            </div>
          </div>

          {/* Finances Shortcuts */}
          <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-3">
            <h2 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-coins"></i> Finances en FCFA
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/finance" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-amber-300">Tableau de Bord Financier 360°</span>
                <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-amber-400"></i>
              </Link>
              <Link href="/finance/payments" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-amber-300">Caisse & Nouveaux Encaissements</span>
                <i className="fa-solid fa-receipt text-slate-500 group-hover:text-amber-400"></i>
              </Link>
              <Link href="/finance/unpaid" className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-750 border border-slate-700/60 flex items-center justify-between block transition-colors group">
                <span className="group-hover:text-amber-300">Gestion & Relance des Impayés</span>
                <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-amber-400"></i>
              </Link>
            </div>
          </div>

          {/* Communication Shortcuts */}
          <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-purple-500/30 shadow-xl space-y-3">
            <h2 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-bullhorn"></i> Communication & Alertes
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/communications/alerts" className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-between block transition-colors">
                <span>Alertes SMS & WhatsApp Direct</span>
                <i className="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
              </Link>
              <Link href="/announcements" className="p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 flex items-center justify-between block transition-colors">
                <span>Publication d'Annonces</span>
                <i className="fa-solid fa-bullhorn text-purple-400"></i>
              </Link>
              <Link href="/documents" className="p-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 flex items-center justify-between block transition-colors">
                <span>Coffre-fort Documentaire</span>
                <i className="fa-solid fa-folder-closed text-cyan-400"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Recent Activity */}
        <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-emerald-400"></i>
              Dernières Transactions de Caisse (FCFA)
            </h2>
            <Link href="/finance/payments" className="text-xs font-bold text-emerald-400 hover:underline">
              Voir tout le journal →
            </Link>
          </div>
          <div className="divide-y divide-slate-700/60">
            {recentPayments.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                    <i className="fa-solid fa-money-bill-wave"></i>
                  </span>
                  <div>
                    <span className="font-bold text-white block">{p.notes || 'Paiement scolarité'}</span>
                    <span className="text-slate-400">{new Date(p.payment_date).toLocaleDateString('fr-FR')} • Mode: {p.payment_method}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  +{formatFCFA(p.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>SCHOOLLIFE © 2026 — L'école, simplement. Conçu pour l'Afrique francophone.</p>
      </footer>

      {/* School Switcher Modal */}
      <SchoolSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
}
