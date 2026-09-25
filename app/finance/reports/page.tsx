'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../../../components/SchoolLifeLogo';
import { getUnpaidBalancesList } from '../../../lib/services/finance';
import { formatFCFA, type StudentFinancialBalance } from '../../../lib/calculations/finance';

export default function FinanceReportsPage() {
  const [balances, setBalances] = useState<StudentFinancialBalance[]>([]);
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

  const exportCSV = () => {
    const headers = ['Matricule,Nom,Classe,Total Du FCFA,Total Paye FCFA,Solde Restant FCFA,Statut\n'];
    const rows = balances.map(b => `"${b.matricule}","${b.studentName}","${b.className}",${b.totalDue},${b.totalPaid},${b.balance},"${b.status}"\n`);
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `schoollife_rapport_financier_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/finance" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Rapports & Synthèses Financières</h1>
            <p className="text-xs text-slate-500">États récapitulatifs et exports comptables</p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <i className="fa-solid fa-file-csv"></i>
          Exporter en CSV (Excel)
        </button>
      </header>

      <main className="max-w-5xl w-full mx-auto p-6 flex-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Situation Financière Détaillée par Élève
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase border-b">
                <tr>
                  <th className="p-3">Matricule</th>
                  <th className="p-3">Nom & Prénoms</th>
                  <th className="p-3">Classe</th>
                  <th className="p-3">Total Dû</th>
                  <th className="p-3">Payé</th>
                  <th className="p-3">Solde</th>
                  <th className="p-3">Taux Recouvrement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {balances.map((b) => (
                  <tr key={b.studentId} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-emerald-700">{b.matricule}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{b.studentName}</td>
                    <td className="p-3">{b.className}</td>
                    <td className="p-3 font-mono">{formatFCFA(b.totalDue)}</td>
                    <td className="p-3 font-mono text-emerald-600 font-bold">{formatFCFA(b.totalPaid)}</td>
                    <td className="p-3 font-mono text-rose-600 font-bold">{formatFCFA(b.balance)}</td>
                    <td className="p-3 font-bold">{b.recoveryRate}%</td>
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
