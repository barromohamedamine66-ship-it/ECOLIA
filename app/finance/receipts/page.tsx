'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReceiptByNumber, type FullReceiptDetails } from '../../../lib/services/receipts';
import { formatFCFA } from '../../../lib/calculations/finance';
import { useSchool } from '../../../lib/context/SchoolContext';

export default function ReceiptsPage() {
  const { currentSchool } = useSchool();
  const [receipt, setReceipt] = useState<FullReceiptDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getReceiptByNumber('REC-2026-000001');
      if (res.data) setReceipt(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !receipt) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-400">
        <p className="font-bold text-sm">Chargement du reçu de paiement officiel...</p>
      </div>
    );
  }

  const activeSchoolName = currentSchool?.name || receipt.school.name;
  const activeSchoolMotto = currentSchool?.motto || receipt.school.motto;
  const activeSchoolAddress = currentSchool?.address || receipt.school.address;
  const activeSchoolPhone = currentSchool?.phone || receipt.school.phone;
  const activeSchoolLogo = currentSchool?.logo_url || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      {/* Controls Bar */}
      <div className="max-w-2xl w-full mb-6 flex items-center justify-between print:hidden">
        <Link href="/finance" className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-700">
          ← Retour aux Finances
        </Link>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <i className="fa-solid fa-print"></i>
          Imprimer / Exporter Reçu
        </button>
      </div>

      {/* Official Receipt Card */}
      <div className="max-w-2xl w-full bg-white text-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3.5">
            {activeSchoolLogo && (
              <img
                src={activeSchoolLogo}
                alt={activeSchoolName}
                className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-sm"
              />
            )}
            <div>
              <span className="text-xl font-black text-emerald-900 block uppercase">{activeSchoolName}</span>
              <span className="text-xs italic text-amber-700 font-medium block">« {activeSchoolMotto} »</span>
              <span className="text-[11px] text-slate-500 block">{activeSchoolAddress} • Tél: {activeSchoolPhone}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-black text-xs rounded-lg uppercase">
              REÇU N° {receipt.receiptNumber}
            </span>
            <span className="block text-[11px] text-slate-500 mt-1">
              Date : {new Date(receipt.issuedAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Student Box */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs my-6">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Élève Bénéficiaire :</span>
            <span className="font-black text-sm text-slate-900">{receipt.student.fullName}</span>
            <span className="block text-slate-500 font-mono text-xs">{receipt.student.matricule}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Classe :</span>
            <span className="font-black text-sm text-slate-900">{receipt.student.className}</span>
            <span className="block text-slate-500 text-[11px]">Tuteur : {receipt.student.parentName}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-3 text-xs mb-6">
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600 font-medium">Motif du Versement</span>
            <span className="font-bold text-slate-900">{receipt.notes || 'Frais de scolarité'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-slate-600 font-medium">Mode de Règlement</span>
            <span className="font-bold text-emerald-700 uppercase">{receipt.paymentMethod} {receipt.transactionReference ? `(Réf: ${receipt.transactionReference})` : ''}</span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-slate-900 bg-emerald-50 px-3 rounded-xl">
            <span className="font-black text-emerald-950 uppercase text-sm">MONTANT ENCAISSÉ</span>
            <span className="font-black font-mono text-emerald-950 text-base">{formatFCFA(receipt.amount)}</span>
          </div>
        </div>

        {/* Financial Balance Status */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center mb-8">
          <div>
            <span className="text-slate-400 font-bold text-[10px] uppercase block">Total Annuel :</span>
            <span className="font-bold text-slate-700">{formatFCFA(receipt.financialStatus.annualTuition)}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold text-[10px] uppercase block">Total Réglé :</span>
            <span className="font-bold text-emerald-700">{formatFCFA(receipt.financialStatus.totalPaidAfterThis)}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 font-bold text-[10px] uppercase block">Solde Restant :</span>
            <span className="font-black text-slate-900 font-mono text-sm">{formatFCFA(receipt.financialStatus.remainingBalance)}</span>
          </div>
        </div>

        {/* Signature & Stamp */}
        <div className="grid grid-cols-2 gap-6 pt-6 border-t text-xs">
          <div>
            <p className="font-bold text-slate-700">Le Caissier / Comptable</p>
            <p className="text-[11px] text-slate-500">{receipt.cashierName}</p>
            <div className="h-16 flex items-end text-[10px] text-slate-400 italic">
              Signature et Visa
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="font-bold text-slate-700 mb-2">Cachet de l'Établissement</p>
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-700/60 flex items-center justify-center text-[8px] font-black text-emerald-800 uppercase text-center rotate-[-10deg] p-1">
              {activeSchoolName}<br/>CAISSE CENTRALE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
