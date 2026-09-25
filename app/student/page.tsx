'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSchool } from '../../lib/context/SchoolContext';
import SchoolSwitcherModal from '../../components/SchoolSwitcherModal';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';

export default function StudentPortalPage() {
  const { currentSchool } = useSchool();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const student = {
    matricule: 'ECO-2026-00001',
    fullName: 'Mohamed TRAORÉ',
    className: '3e A (Brevet)',
    level: 'Collège',
    overallAverage: 15.65,
    rank: '2ème',
    totalStudents: 42,
    presenceRate: 97.5,
    todayCourses: [
      { time: '08:00 - 10:00', subject: 'Mathématiques', teacher: 'M. KOFFI Yao', room: 'Salle 204', status: 'En cours' },
      { time: '10:15 - 12:00', subject: 'Français & Expression', teacher: 'Mme KONE Fatou', room: 'Salle 204', status: 'À venir' },
      { time: '14:00 - 16:00', subject: 'Physique - Chimie', teacher: 'M. OUATTARA Drissa', room: 'Labo Sciences', status: 'À venir' },
    ],
    lastGrades: [
      { subject: 'Mathématiques', score: 16.5, coef: 4, date: '15 Oct 2026', appreciation: 'Très bon raisonnement' },
      { subject: 'Français & Expression', score: 15.0, coef: 4, date: '18 Oct 2026', appreciation: 'Rédaction soignée' },
      { subject: 'Physique - Chimie', score: 15.5, coef: 3, date: '22 Oct 2026', appreciation: 'TP réussi' },
      { subject: 'Anglais (LV1)', score: 17.0, coef: 3, date: '24 Oct 2026', appreciation: 'Excellent oral' },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-900/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SchoolLifeLogo size="sm" withText={false} href="/" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  Espace Élève & Apprenant
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {student.className}
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentSchool.name} • {student.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-blue-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-sm"
              title="Changer d'Établissement"
            >
              <i className="fa-solid fa-building-columns text-blue-400"></i>
              <span className="hidden sm:inline">Changer d'École</span>
            </button>
            <Link
              href="/notifications"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-all relative border border-slate-700 text-xs font-bold"
              title="Centre de Notifications"
            >
              <i className="fa-solid fa-bell text-amber-400 text-sm"></i>
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
      <main className="max-w-5xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Contextual Student Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/40 shadow-2xl bg-slate-900 group">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/student_hero.jpg"
              alt="Espace Élève Écolia"
              className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
          </div>

          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold">
                <i className="fa-solid fa-graduation-cap"></i>
                Année Scolaire 2026-2027
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Ravi de te revoir, {student.fullName.split(' ')[0]} !
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Voici ton tableau de bord personnel. Consulte tes moyennes du 1er trimestre, l'emploi du temps de ta classe et télécharge ton bulletin certifié.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/report-cards"
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <i className="fa-solid fa-file-invoice text-sm"></i>
                Mon Bulletin Trimestriel
              </Link>
            </div>
          </div>
        </div>

        {/* Academic Performance KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moyenne Trimestre 1</span>
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-star"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-emerald-400 block mt-3 font-mono">
              {student.overallAverage.toFixed(2)} <span className="text-xs">/ 20</span>
            </span>
            <span className="text-[11px] text-emerald-300 font-bold mt-2 block">
              ● Tableau d'Honneur avec Félicitations
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rang dans la Classe</span>
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-medal"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-amber-300 block mt-3 font-mono">
              {student.rank}
            </span>
            <span className="text-[11px] text-slate-400 mt-2 block">
              sur {student.totalStudents} élèves de la classe
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assiduité</span>
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                <i className="fa-solid fa-circle-check"></i>
              </span>
            </div>
            <span className="text-3xl font-black text-blue-300 block mt-3 font-mono">
              {student.presenceRate}%
            </span>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Présence régulière aux cours
            </span>
          </div>
        </div>

        {/* Schedule & Courses */}
        <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-clock text-blue-400"></i>
            Emploi du Temps du Jour
          </h3>
          <div className="space-y-3">
            {student.todayCourses.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 flex justify-between items-center text-xs hover:border-blue-500/40 transition-colors">
                <div>
                  <span className="font-mono font-black text-emerald-400 block text-sm">{c.time}</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{c.subject}</span>
                  <span className="text-slate-400 block mt-0.5">{c.teacher}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="px-3 py-1 rounded-xl bg-slate-800 font-bold text-[10px] text-blue-300 border border-slate-700 block">
                    📍 {c.room}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">● {c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Grades */}
        <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-book-bookmark text-emerald-400"></i>
            Dernières Évaluations Notées
          </h3>
          <div className="divide-y divide-slate-700/60">
            {student.lastGrades.map((g, idx) => (
              <div key={idx} className="py-3.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white text-sm block">{g.subject}</span>
                  <span className="text-slate-400">Coef {g.coef} • {g.date} • <span className="italic text-slate-300">« {g.appreciation} »</span></span>
                </div>
                <span className="font-mono font-black text-emerald-400 text-base">{g.score.toFixed(1)} / 20</span>
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
