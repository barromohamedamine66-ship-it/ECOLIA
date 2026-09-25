'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../../../components/SchoolLifeLogo';
import { recordPayment, getRecentPayments, type PaymentRow } from '../../../lib/services/payments';
import { getStudents, type StudentRow } from '../../../lib/services/students';
import { formatFCFA } from '../../../lib/calculations/finance';
import type { PaymentMethod } from '../../../lib/supabase/types';

export default function PaymentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    amount: '50000',
    paymentMethod: 'WAVE' as PaymentMethod,
    transactionReference: '',
    notes: 'Paiement Tranche Scolarité',
  });

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [stuRes, payRes] = await Promise.all([
        getStudents(),
        getRecentPayments(20),
      ]);
      setStudents(stuRes.data || []);
      setPayments(payRes.data || []);
      if (stuRes.data && stuRes.data.length > 0) {
        const firstStudentId = stuRes.data[0].id;
        setFormData(prev => ({ ...prev, studentId: firstStudentId }));
      }
      setLoading(false);
    }
    init();
  }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setLastReceipt(null);

    const amountNum = parseInt(formData.amount, 10);
    const res = await recordPayment({
      schoolId: 'a0000000-0000-0000-0000-000000000001',
      studentId: formData.studentId,
      amount: amountNum,
      paymentMethod: formData.paymentMethod,
      transactionReference: formData.transactionReference || undefined,
      notes: formData.notes,
      receivedByProfileId: 'usr-acc-01',
    });

    if (res.data) {
      setLastReceipt(res.data.receiptNumber);
      const updatedPays = await getRecentPayments(20);
      setPayments(updatedPays.data);
      setFormData(prev => ({ ...prev, transactionReference: '' }));
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/finance" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Caisse & Encaissements</h1>
            <p className="text-xs text-slate-500">Enregistrement tactile et émission instantanée de reçus</p>
          </div>
        </div>

        <Link href="/finance/receipts" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl text-slate-700 flex items-center gap-2">
          <i className="fa-solid fa-receipt"></i>
          Voir les Reçus
        </Link>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1 grid md:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-cash-register text-emerald-600"></i>
              Nouveau Paiement
            </h2>

            {lastReceipt && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold space-y-1">
                <p>✅ Paiement enregistré avec succès !</p>
                <p className="font-mono text-sm">Reçu : {lastReceipt}</p>
                <Link href="/finance/receipts" className="underline text-emerald-900 block pt-1">
                  Imprimer le reçu officiel →
                </Link>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Élève *</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white text-sm"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.last_name.toUpperCase()} {s.first_name} ({s.matricule})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Montant Encaissé (FCFA) *</label>
                <input
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Ex: 50000"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-black text-lg text-emerald-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Mode de Paiement *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'WAVE', label: '🌊 Wave' },
                    { id: 'ORANGE_MONEY', label: '🍊 Orange MoMo' },
                    { id: 'MTN_MOMO', label: '🟡 MTN MoMo' },
                    { id: 'CASH', label: '💵 Espèces' },
                    { id: 'BANK_TRANSFER', label: '🏦 Virement' },
                    { id: 'CHECK', label: '📑 Chèque' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id as PaymentMethod })}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                        formData.paymentMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Référence Transaction / N° Pièce</label>
                <input
                  type="text"
                  value={formData.transactionReference}
                  onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                  placeholder="Ex: WAVE-CI-998811 ou N° Chèque"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Motif / Tranche</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {saving ? 'Validation en cours...' : 'Valider & Émettre le Reçu'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Transactions Column */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Journal des Encaissements
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase border-b">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Motif</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-slate-500">{new Date(p.payment_date).toLocaleDateString('fr-FR')}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{p.notes || 'Paiement'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                          {p.payment_method}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">
                        +{formatFCFA(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
