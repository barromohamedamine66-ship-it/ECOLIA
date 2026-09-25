'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatFCFA } from '../../lib/calculations/finance';
import { useSchool } from '../../lib/context/SchoolContext';
import SchoolSwitcherModal from '../../components/SchoolSwitcherModal';

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
  const { currentSchool } = useSchool();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-900/60 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-950/50">
              SL
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  Portail Famille & Parents d'Élèves
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Tuteur Légal
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentSchool.name} • Famille TRAORÉ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-amber-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-sm"
              title="Changer d'Établissement"
            >
              <i className="fa-solid fa-building-columns text-amber-400"></i>
              <span className="hidden sm:inline">Changer d'École</span>
            </button>
            <Link
              href="/notifications"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-all relative border border-slate-700 text-xs font-bold"
              title="Centre de Notifications"
            >
              <i className="fa-solid fa-bell text-amber-400 text-sm"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                1
              </span>
            </Link>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              Accueil SaaS
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Contextual Family Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 shadow-2xl bg-slate-900 group">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/parent_hero.jpg"
              alt="Parents d'élèves et suivi scolaire"
              className="w-full h-full object-cover object-center opacity-35 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
          </div>

          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                <i className="fa-solid fa-people-roof"></i>
                Suivi de la Réussite Scolaire
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Suivi Académique & Scolarité en Direct
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Consultez instantanément les bulletins trimestriels certifiés de vos enfants, suivez leur assiduité journalière et téléchargez vos reçus d'encaissement de scolarité.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/report-cards"
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <i className="fa-solid fa-file-lines text-sm"></i>
                Bulletin Scolaire A4
              </Link>
              <Link
                href="/finance/receipts"
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-2xl border border-emerald-500/40 shadow-lg flex items-center gap-2.5 transition-all"
              >
                <i className="fa-solid fa-receipt text-sm"></i>
                Reçus FCFA
              </Link>
            </div>
          </div>
        </div>

        {/* Child Selector Switcher */}
        <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-3xl border border-slate-700/80 shadow-xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-4 flex items-center gap-2">
            <i className="fa-solid fa-children"></i>
            Sélectionner un Enfant ({children.length}) :
          </span>
          <div className="grid sm:grid-cols-3 gap-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                  selectedChildId === child.id
                    ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/50'
                    : 'border-slate-700 bg-slate-900/60 hover:bg-slate-800/80'
                }`}
              >
                <img
                  src={child.photoUrl}
                  alt={child.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-600 shadow-md"
                />
                <div>
                  <span className="font-extrabold text-sm text-white block">
                    {child.fullName}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold block mt-0.5">{child.className}</span>
                  <span className="text-[10px] font-mono text-slate-400">{child.matricule}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Child Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moyenne Générale</span>
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-trophy"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-emerald-400 block mt-3 font-mono">
              {activeChild.overallAverage.toFixed(2)} <span className="text-xs">/ 20</span>
            </span>
            <span className="text-[11px] text-emerald-300 font-bold mt-2 block">
              ● Mention Bien (2ème de la classe)
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux d'Assiduité</span>
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-clock"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-white block mt-3 font-mono">
              {activeChild.presenceRate}%
            </span>
            <span className="text-[11px] text-slate-400 mt-2 block">2h d'absence justifiée</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scolarité en FCFA</span>
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-coins"></i>
              </span>
            </div>
            <span className="text-2xl font-black text-amber-300 block mt-3 font-mono">
              {formatFCFA(activeChild.paidTuition)}
            </span>
            <span className={`text-[11px] font-bold mt-2 block ${activeChild.balance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeChild.balance === 0 ? '✓ Scolarité entièrement soldée' : `Reste à régler : ${formatFCFA(activeChild.balance)}`}
            </span>
          </div>
        </div>

        {/* Action Hub */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Link
            href="/report-cards"
            className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-white transition-all shadow-xl flex items-center justify-between group hover:scale-[1.02]"
          >
            <div>
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">Document Officiel MENA</span>
              <h3 className="font-black text-lg mt-1 group-hover:text-emerald-300 transition-colors">Consulter le Bulletin Scolaire A4</h3>
              <p className="text-xs text-slate-300 mt-1">Avec logo officiel de l'école et certificat anti-fraude</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-lg group-hover:translate-x-1 transition-transform">
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          <Link
            href="/finance/receipts"
            className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/40 hover:border-amber-400 text-white transition-all shadow-xl flex items-center justify-between group hover:scale-[1.02]"
          >
            <div>
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">Justificatif Comptable</span>
              <h3 className="font-black text-lg mt-1 group-hover:text-amber-300 transition-colors">Télécharger les Reçus de Caisse</h3>
              <p className="text-xs text-slate-300 mt-1">Reçus certifiés conformes avec timbre digital</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg group-hover:translate-x-1 transition-transform">
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>
        </div>

        {/* Recent Grades Table */}
        <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-emerald-400"></i>
            Dernières Notes & Évaluations Récentes — <span className="text-amber-300">{activeChild.fullName}</span>
          </h3>
          <div className="divide-y divide-slate-700/60">
            {activeChild.lastGrades.map((g, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white text-sm block">{g.subject}</span>
                  <span className="text-slate-400">Date : {g.date} • Coef {g.coef}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-400 text-base">{g.score.toFixed(1)} / 20</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>SCHOOLLIFE © 2026 — L'école, simplement. Conçu pour l'Afrique francophone.</p>
      </footer>

      {/* School Switcher Modal */}
      <SchoolSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
}
