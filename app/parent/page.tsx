'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatFCFA } from '../../lib/calculations/finance';

interface ChildProfile {
  id: string;
  matricule: string;
  fullName: string;
  className: string;
  level: string;
  overallAverage: number;
  presenceRate: number;
  totalTuition: number;
  paidTuition: number;
  balance: number;
  paymentStatus: 'SOLDE' | 'PARTIEL' | 'IMPAYE';
  photoUrl: string;
  lastGrades: { subject: string; score: number; coef: number; date: string }[];
}

export default function ParentPortalPage() {
  const children: ChildProfile[] = [
    {
      id: 'stu-2026-001',
      matricule: 'ECO-2026-00001',
      fullName: 'Mohamed TRAORÉ',
      className: '3e A (Brevet)',
      level: 'Collège',
      overallAverage: 15.65,
      presenceRate: 97.5,
      totalTuition: 250000,
      paidTuition: 250000,
      balance: 0,
      paymentStatus: 'SOLDE',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      lastGrades: [
        { subject: 'Mathématiques', score: 16.5, coef: 4, date: '15 Oct 2026' },
        { subject: 'Français & Expression', score: 15.0, coef: 4, date: '18 Oct 2026' },
        { subject: 'Physique - Chimie', score: 15.5, coef: 3, date: '22 Oct 2026' },
      ],
    },
    {
      id: 'stu-2026-002',
      matricule: 'ECO-2026-00002',
      fullName: 'Aïcha TRAORÉ',
      className: '6e B',
      level: 'Collège',
      overallAverage: 14.80,
      presenceRate: 98.0,
      totalTuition: 220000,
      paidTuition: 150000,
      balance: 70000,
      paymentStatus: 'PARTIEL',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      lastGrades: [
        { subject: 'Français', score: 16.0, coef: 4, date: '14 Oct 2026' },
        { subject: 'Mathématiques', score: 13.5, coef: 3, date: '19 Oct 2026' },
        { subject: 'Anglais', score: 15.5, coef: 2, date: '25 Oct 2026' },
      ],
    },
    {
      id: 'stu-2026-003',
      matricule: 'ECO-2026-00003',
      fullName: 'Mariam TRAORÉ',
      className: 'CM2 A',
      level: 'Primaire',
      overallAverage: 16.20,
      presenceRate: 100,
      totalTuition: 180000,
      paidTuition: 180000,
      balance: 0,
      paymentStatus: 'SOLDE',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      lastGrades: [
        { subject: 'Calcul & Problèmes', score: 17.0, coef: 3, date: '12 Oct 2026' },
        { subject: 'Dictée & Questions', score: 16.0, coef: 3, date: '16 Oct 2026' },
        { subject: 'Éveil Scientifique', score: 15.5, coef: 2, date: '20 Oct 2026' },
      ],
    }
  ];

  const [selectedChildId, setSelectedChildId] = useState<string>(children[0].id);
  const activeChild = children.find(c => c.id === selectedChildId) || children[0];

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
              <span>Espace Parent</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                Tuteur Légal
              </span>
            </h1>
            <p className="text-xs text-slate-500">M. TRAORÉ Ibrahim — 3 enfants inscrits</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 relative text-xs font-bold"
            title="Centre de Notifications"
          >
            <i className="fa-solid fa-bell text-amber-500"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-900 font-black text-[9px] flex items-center justify-center">
              1
            </span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-700 text-xs font-bold hover:bg-slate-100"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            M. TRAORÉ
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto p-4 md:p-6 flex-1 space-y-6">
        {/* Child Selector Switcher */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Sélectionner un Enfant ({children.length}) :
          </span>
          <div className="grid sm:grid-cols-3 gap-3">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  selectedChildId === child.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <img
                  src={child.photoUrl}
                  alt={child.fullName}
                  className="w-11 h-11 rounded-full object-cover border"
                />
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {child.fullName}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold block">{child.className}</span>
                  <span className="text-[10px] font-mono text-slate-400">{child.matricule}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Child Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Moyenne Générale</span>
            <span className="text-3xl font-black text-emerald-600 block mt-2 font-mono">
              {activeChild.overallAverage.toFixed(2)} <span className="text-xs">/ 20</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
              ● Mention Bien (2ème de classe)
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Taux d'Assiduité</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white block mt-2 font-mono">
              {activeChild.presenceRate}%
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">2h d'absence justifiée</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Scolarité FCFA</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-2 font-mono">
              {formatFCFA(activeChild.paidTuition)}
            </span>
            <span className={`text-[11px] font-bold mt-1 block ${activeChild.balance === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {activeChild.balance === 0 ? '✓ Scolarité soldée' : `Reste : ${formatFCFA(activeChild.balance)}`}
            </span>
          </div>
        </div>

        {/* Action Hub */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/report-cards"
            className="p-5 rounded-3xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase block">Document Officiel</span>
              <h3 className="font-extrabold text-base mt-1">Consulter le Bulletin Scolaire A4</h3>
              <p className="text-xs text-slate-300 mt-1">Format officiel MENA avec visa du conseil de classe</p>
            </div>
            <i className="fa-solid fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
          </Link>

          <Link
            href="/finance/receipts"
            className="p-5 rounded-3xl bg-emerald-700 text-white hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase block">Justificatif Comptable</span>
              <h3 className="font-extrabold text-base mt-1">Télécharger les Reçus de Caisse</h3>
              <p className="text-xs text-emerald-100 mt-1">Reçus certifiés REC-2026-XXXXXX</p>
            </div>
            <i className="fa-solid fa-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        {/* Recent Grades Table */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
            Dernières Notes & Évaluations — {activeChild.fullName}
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {activeChild.lastGrades.map((g, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">{g.subject}</span>
                  <span className="text-slate-400">Date : {g.date} • Coefficient {g.coef}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-600 text-base">{g.score.toFixed(1)} / 20</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
