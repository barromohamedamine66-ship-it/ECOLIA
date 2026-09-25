'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSubjects, createSubject, type SubjectRow } from '../../lib/services/subjects';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Informatique & Numérique',
    code: 'INFO',
    category: 'Technique',
    default_coefficient: 2.0,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getSubjects();
    setSubjects(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSubject({
      school_id: 'a0000000-0000-0000-0000-000000000001',
      name: formData.name,
      code: formData.code,
      category: formData.category,
      default_coefficient: formData.default_coefficient,
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
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Matières & Coefficients</h1>
            <p className="text-xs text-slate-500">Barème pédagogique et pondération des notes</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Ajouter une Matière
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="grid md:grid-cols-4 gap-6">
          {subjects.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                  {s.code}
                </span>
                <span className="font-bold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  Coef {s.default_coefficient}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{s.name}</h3>
              <p className="text-[11px] text-slate-400">{s.category || 'Général'}</p>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Ajouter une Matière</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Nom de la Matière</label>
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
                  <label className="block font-bold text-slate-500 mb-1">Code Court</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Coefficient Défaut</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.default_coefficient}
                    onChange={(e) => setFormData({ ...formData, default_coefficient: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                >
                  <option value="Scientifique">Scientifique</option>
                  <option value="Littéraire">Littéraire</option>
                  <option value="Langues">Langues</option>
                  <option value="Sport">Sport</option>
                  <option value="Technique">Technique</option>
                </select>
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
