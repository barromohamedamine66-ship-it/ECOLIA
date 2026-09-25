'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAcademicYears, createAcademicYear, activateAcademicYear, type AcademicYearRow } from '../../lib/services/academic-years';

export default function AcademicYearsPage() {
  const [years, setYears] = useState<AcademicYearRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '2027-2028',
    start_date: '2027-09-06',
    end_date: '2028-06-23',
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getAcademicYears();
    setYears(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAcademicYear({
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status,
    });
    setIsModalOpen(false);
    loadData();
  };

  const handleActivate = async (id: string) => {
    if (confirm('Activer cette année scolaire passera automatiquement les autres en archivées. Continuer ?')) {
      await activateAcademicYear(id, 'a0000000-0000-0000-0000-000000000001');
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Années Scolaires</h1>
            <p className="text-xs text-slate-500">Gestion du calendrier académique (Règle : 1 seule active)</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Nouvelle Année Scolaire
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="grid md:grid-cols-2 gap-6">
          {years.map((year) => (
            <div
              key={year.id}
              className={`p-6 rounded-2xl border bg-white dark:bg-slate-800 shadow-sm transition-all ${
                year.status === 'ACTIVE' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white block font-mono">
                    {year.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    Du {year.start_date} au {year.end_date}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  year.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {year.status === 'ACTIVE' ? '● En Cours (Active)' : year.status}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">Année académique officielle</span>
                {year.status !== 'ACTIVE' && (
                  <button
                    onClick={() => handleActivate(year.id)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-colors"
                  >
                    Définir comme Année Active
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Créer une Année Scolaire</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Libellé (Ex: 2027-2028)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Date Début</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Date Fin</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500">Annuler</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
