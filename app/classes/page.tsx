'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClasses, createClass, type ClassRow } from '../../lib/services/classes';

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '3e B',
    level: 'Collège',
    series: '',
    room_name: 'Bâtiment B - Salle 205',
    capacity: 45,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getClasses();
    setClasses(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClass({
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      name: formData.name,
      level: formData.level,
      series: formData.series || null,
      room_name: formData.room_name || null,
      capacity: formData.capacity,
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
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Classes & Niveaux</h1>
            <p className="text-xs text-slate-500">Primaire, Collège et Lycée</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Créer une Classe
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="grid md:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div key={c.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {c.level}
                </span>
                <span className="text-xs text-slate-400 font-bold">Capacité : {c.capacity}</span>
              </div>
              <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-1 font-mono">{c.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{c.room_name || 'Salle principale'}</p>
              {c.series && <p className="text-xs text-amber-600 font-semibold mb-2">Série : {c.series}</p>}
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Créer une Classe</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Nom de la Classe (Ex: 3e A, CM2 B)</label>
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
                  <label className="block font-bold text-slate-500 mb-1">Niveau</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="Primaire">Primaire</option>
                    <option value="Collège">Collège</option>
                    <option value="Lycée">Lycée</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Capacité</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
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
