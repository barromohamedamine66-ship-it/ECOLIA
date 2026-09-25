'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudents } from '../../lib/services/students';
import { getClasses } from '../../lib/services/classes';
import { getGlobalFinancialDashboard } from '../../lib/services/finance';
import { getRecentPayments } from '../../lib/services/payments';
import { formatFCFA } from '../../lib/calculations/finance';

export default function AdminPortalPage() {
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Portail Direction & Administration</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                Directeur des Études
              </span>
            </h1>
            <p className="text-xs text-slate-500">Groupe Scolaire Horizon — Année 2026-2027</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 relative text-xs font-bold"
            title="Centre de Notifications"
          >
            <i className="fa-solid fa-bell text-amber-500"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-900 font-black text-[9px] flex items-center justify-center">
              2
            </span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-700 text-xs font-bold hover:bg-slate-100"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            M. KOUASSI (Directeur)
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Dynamic KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Élèves Inscrits</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white block mt-2 font-mono">
              {loading ? '...' : studentCount}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold block mt-1">● Répertoire Actif</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Classes & Niveaux</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white block mt-2 font-mono">
              {loading ? '...' : classCount}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Primaire, Collège, Lycée</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-500/30 bg-emerald-50/20 shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase">Encaissements FCFA</span>
            <span className="text-2xl font-black text-emerald-600 block mt-2 font-mono">
              {loading || !financeSummary ? '...' : formatFCFA(financeSummary.totalCollected)}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 block mt-1">
              Recouvrement : {financeSummary?.globalRecoveryRate || 0}%
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Taux d'Assiduité</span>
            <span className="text-3xl font-black text-emerald-600 block mt-2 font-mono">
              94.2%
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Séances de la semaine</span>
          </div>
        </div>

        {/* Action Center Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pedagogie Shortcuts */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h2 className="text-sm font-black uppercase text-emerald-600 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-book-open"></i> Pédagogie & Notes
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/grades" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Validation des Notes (DRAFT → VALIDATED)</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
              <Link href="/report-cards" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Édition des Bulletins A4 MENA</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
              <Link href="/assessments" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Calendrier des Évaluations</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
            </div>
          </div>

          {/* Scolarité Shortcuts */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h2 className="text-sm font-black uppercase text-blue-600 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-user-graduate"></i> Scolarité & Effectifs
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/students" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Gestion des Fiches Élèves (Matricules)</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
              <Link href="/students/import" className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-700/50 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 flex items-center justify-between block">
                <span>Importation Massive Excel / CSV</span>
                <i className="fa-solid fa-file-excel text-emerald-600"></i>
              </Link>
              <Link href="/classes" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Classes & Niveaux</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
              <Link href="/teachers" className="p-3 rounded-2xl bg-purple-50 dark:bg-slate-700/50 hover:bg-purple-100 text-purple-900 dark:text-purple-200 flex items-center justify-between block">
                <span>Corps Enseignant & Codes d'Accès</span>
                <i className="fa-solid fa-chalkboard-user text-purple-600"></i>
              </Link>
              <Link href="/attendance" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Feuille d'Appel & Présences</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
            </div>
          </div>

          {/* Finances Shortcuts */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h2 className="text-sm font-black uppercase text-amber-600 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-coins"></i> Finances en FCFA
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/finance" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Tableau de Bord Financier 360°</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
              <Link href="/finance/payments" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Caisse & Nouveaux Encaissements</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
              <Link href="/finance/unpaid" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 flex items-center justify-between block">
                <span>Gestion & Relance des Impayés</span>
                <i className="fa-solid fa-arrow-right text-slate-400"></i>
              </Link>
            </div>
          </div>

          {/* Communication & WhatsApp Shortcuts */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-purple-500/30 dark:border-purple-500/30 shadow-sm space-y-3">
            <h2 className="text-sm font-black uppercase text-purple-600 tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-bullhorn"></i> Communication & WhatsApp
            </h2>
            <div className="space-y-2 text-xs font-bold">
              <Link href="/communications/alerts" className="p-3 rounded-2xl bg-green-50 dark:bg-slate-700/50 hover:bg-green-100 text-green-900 dark:text-green-200 flex items-center justify-between block">
                <span>Centre d'Alertes WhatsApp & SMS</span>
                <i className="fa-brands fa-whatsapp text-green-600 text-sm"></i>
              </Link>
              <Link href="/announcements" className="p-3 rounded-2xl bg-purple-50 dark:bg-slate-700/50 hover:bg-purple-100 text-purple-900 dark:text-purple-200 flex items-center justify-between block">
                <span>Publication d'Annonces</span>
                <i className="fa-solid fa-arrow-right text-purple-400"></i>
              </Link>
              <Link href="/documents" className="p-3 rounded-2xl bg-cyan-50 dark:bg-slate-700/50 hover:bg-cyan-100 text-cyan-950 dark:text-cyan-200 flex items-center justify-between block">
                <span>Coffre-fort Documentaire</span>
                <i className="fa-solid fa-arrow-right text-cyan-400"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Recent Activity */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Dernières Transactions & Actions Récentes
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentPayments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    💳
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{p.notes || 'Paiement scolarité'}</span>
                    <span className="text-slate-400">{new Date(p.payment_date).toLocaleDateString('fr-FR')} • Mode: {p.payment_method}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  +{formatFCFA(p.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
