'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../../../components/SchoolLifeLogo';
import { getUnpaidBalancesList } from '../../../lib/services/finance';
import { formatFCFA, type StudentFinancialBalance } from '../../../lib/calculations/finance';

export default function UnpaidPage() {
  const [balances, setBalances] = useState<StudentFinancialBalance[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const res = await getUnpaidBalancesList();
      setBalances(res.data || []);
      setLoading(false);
    }
    init();
  }, []);

  const filtered = filterStatus === 'ALL'
    ? balances
    : balances.filter(b => b.status === filterStatus);

  const totalOverdueSum = balances
    .filter(b => b.status === 'EN_RETARD' || b.status === 'IMPAYE')
    .reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/finance" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Gestion & Relance des Impayés</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800">
                Retards : {formatFCFA(totalOverdueSum)}
              </span>
            </h1>
            <p className="text-xs text-slate-500">Suivi des échéances échues et des soldes de scolarité</p>
          </div>
        </div>

        <Link
          href="/finance/payments"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Encaisser un Règlement
        </Link>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Filter Pills */}
        <div className="flex gap-2 text-xs font-bold">
          {['ALL', 'EN_RETARD', 'IMPAYE', 'PARTIEL', 'SOLDE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl border transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {st === 'ALL' ? 'Tous les Élèves' : (st === 'EN_RETARD' ? '⚠️ En Retard' : (st === 'IMPAYE' ? '❌ Impayés Totals' : (st === 'PARTIEL' ? '⏳ Partiels' : '✅ Soldés')))}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase border-b">
                <tr>
                  <th className="p-4">Élève</th>
                  <th className="p-4">Classe</th>
                  <th className="p-4">Total Dû</th>
                  <th className="p-4">Payé</th>
                  <th className="p-4">Reste à Payer</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((item) => (
                  <tr key={item.studentId} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{item.studentName}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{item.matricule}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">{item.className}</td>
                    <td className="p-4 font-mono font-bold">{formatFCFA(item.totalDue)}</td>
                    <td className="p-4 font-mono font-bold text-emerald-600">{formatFCFA(item.totalPaid)}</td>
                    <td className="p-4 font-mono font-black text-rose-600">
                      {formatFCFA(item.balance)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        item.status === 'SOLDE' ? 'bg-emerald-100 text-emerald-800' : (item.status === 'EN_RETARD' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800')
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {item.balance > 0 && (
                        <button
                          onClick={() => alert(`Notification de relance SMS/Email envoyée au tuteur de ${item.studentName} pour un solde de ${formatFCFA(item.balance)}`)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors text-[11px]"
                        >
                          📢 Relancer Tuteur
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
