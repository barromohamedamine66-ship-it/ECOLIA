'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGlobalFinancialDashboard } from '../../lib/services/finance';
import { getRecentPayments, type PaymentRow } from '../../lib/services/payments';
import { formatFCFA, type PaymentSummary } from '../../lib/calculations/finance';

export default function FinanceDashboardPage() {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [recentPayments, setRecentPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [dashRes, payRes] = await Promise.all([
        getGlobalFinancialDashboard(),
        getRecentPayments(6),
      ]);
      setSummary(dashRes.summary);
      setRecentPayments(payRes.data);
      setLoading(false);
    }
    init();
  }, []);

  if (loading || !summary) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 text-slate-500">
        <div className="text-center space-y-3">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-emerald-600"></i>
          <p className="font-bold text-sm">Calcul des statistiques financières en temps réel...</p>
        </div>
      </div>
    );
  }

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
              <span>Gestion Financière & Recouvrement</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                Devise : FCFA (XOF)
              </span>
            </h1>
            <p className="text-xs text-slate-500">Groupe Scolaire Horizon — Année 2026-2027</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/finance/payments"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <i className="fa-solid fa-cash-register"></i>
            Encaisser un Paiement
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Quick Links Subnav */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link href="/finance/payments" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl hover:border-emerald-500 transition-colors">
            💳 Encaissements & Caisse
          </Link>
          <Link href="/finance/unpaid" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl hover:border-emerald-500 transition-colors">
            ⚠️ Suivi des Impayés
          </Link>
          <Link href="/finance/schedules" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl hover:border-emerald-500 transition-colors">
            📅 Échéanciers par Tranches
          </Link>
          <Link href="/finance/receipts" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl hover:border-emerald-500 transition-colors">
            🧾 Reçus de Caisse
          </Link>
          <Link href="/finance/reports" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl hover:border-emerald-500 transition-colors">
            📊 Rapports & Exports
          </Link>
        </div>

        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Facturé</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-2 font-mono">
              {formatFCFA(summary.totalInvoiced)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Inscriptions & Scolarités</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-500/30 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-800">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Encaissé</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-2 font-mono">
              {formatFCFA(summary.totalCollected)}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
              Taux de Recouvrement : {summary.globalRecoveryRate}%
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solde Restant Dû</span>
            <span className="text-2xl font-black text-slate-700 dark:text-slate-300 block mt-2 font-mono">
              {formatFCFA(summary.totalPending)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">À recouvrer sur l'exercice</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-500/30 shadow-sm bg-gradient-to-br from-rose-50/50 to-white dark:from-rose-950/20 dark:to-slate-800">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Montant en Retard</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block mt-2 font-mono">
              {formatFCFA(summary.totalOverdue)}
            </span>
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 mt-1 block">
              Échéances échues non soldées
            </span>
          </div>
        </div>

        {/* Breakdown by Payment Method */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Derniers Encaissements</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentPayments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {p.payment_method === 'WAVE' ? '🌊' : (p.payment_method === 'ORANGE_MONEY' ? '🍊' : '💵')}
                    </div>
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

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Répartition par Mode</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-400">🌊 Wave Mobile Money</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{formatFCFA(summary.byPaymentMethod['WAVE'])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-400">🍊 Orange Money</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{formatFCFA(summary.byPaymentMethod['ORANGE_MONEY'])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-400">💵 Espèces à la Caisse</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{formatFCFA(summary.byPaymentMethod['CASH'])}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-400">🏦 Virement & Chèque</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{formatFCFA(summary.byPaymentMethod['BANK_TRANSFER'] + summary.byPaymentMethod['CHECK'])}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
