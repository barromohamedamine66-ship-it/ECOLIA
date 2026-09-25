'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPaymentSchedules, createPaymentSchedule, type PaymentScheduleRow } from '../../../lib/services/payment-schedules';
import { formatFCFA } from '../../../lib/calculations/finance';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<PaymentScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '4ème Tranche Scolarité',
    tranche_number: 4,
    amount: 50000,
    due_date: '2027-04-30',
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getPaymentSchedules();
    setSchedules(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPaymentSchedule({
      school_id: 'a0000000-0000-0000-0000-000000000001',
      academic_year_id: 'b0000000-0000-0000-0000-000000000001',
      title: formData.title,
      tranche_number: formData.tranche_number,
      amount: formData.amount,
      due_date: formData.due_date,
    });
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/finance" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Échéanciers & Tranches de Scolarité</h1>
            <p className="text-xs text-slate-500">Dates limites et montants exigibles par période</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Ajouter une Tranche
        </button>
      </header>

      <main className="max-w-5xl w-full mx-auto p-6 flex-1">
        <div className="grid md:grid-cols-2 gap-6">
          {schedules.map((sch) => (
            <div key={sch.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Tranche N° {sch.tranche_number}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-400">
                    Échéance : {new Date(sch.due_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">{sch.title}</h3>
              </div>

              <div className="pt-4 mt-4 border-t flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold uppercase">Montant Exigible</span>
                <span className="text-xl font-black font-mono text-emerald-600">
                  {formatFCFA(sch.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Ajouter une Tranche</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Titre de la Tranche</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Numéro de Tranche</label>
                  <input
                    type="number"
                    value={formData.tranche_number}
                    onChange={(e) => setFormData({ ...formData, tranche_number: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">Date Limite d'Échéance</label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                />
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
