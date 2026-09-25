'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvaluationPeriods, createEvaluationPeriod, type EvaluationPeriodRow } from '../../lib/services/evaluation-periods';

export default function EvaluationPeriodsPage() {
  const [periods, setPeriods] = useState<EvaluationPeriodRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '1er Semestre',
    code: 'S1',
    start_date: '2026-09-07',
    end_date: '2027-01-29',
    weight: 1.0,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getEvaluationPeriods();
    setPeriods(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvaluationPeriod({
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: formData.name,
      code: formData.code,
      start_date: formData.start_date,
      end_date: formData.end_date,
      weight: formData.weight,
    });
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Périodes d'Évaluation</h1>
            <p className="text-xs text-slate-500">Trimestres ou Semestres configurables par établissement</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Nouvelle Période
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="grid md:grid-cols-3 gap-6">
          {periods.map((p) => (
            <div key={p.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {p.code}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Pondération : {p.weight}x
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{p.name}</h3>
              <p className="text-xs text-slate-400">Du {p.start_date} au {p.end_date}</p>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Ajouter une Période</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Nom (Ex: 1er Trimestre / 1er Semestre)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Code Court (Ex: T1, S1)</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Pondération</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Date Début</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Date Fin</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
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
