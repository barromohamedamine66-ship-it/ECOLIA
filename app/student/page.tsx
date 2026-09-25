'use client';

import React from 'react';
import Link from 'next/link';

export default function StudentPortalPage() {
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
      { time: '08:00 - 10:00', subject: 'Mathématiques', teacher: 'M. KOFFI Yao', room: 'Salle 204' },
      { time: '10:15 - 12:00', subject: 'Français & Expression', teacher: 'Mme KONE Fatou', room: 'Salle 204' },
    ],
    lastGrades: [
      { subject: 'Mathématiques', score: 16.5, coef: 4, date: '15 Oct 2026' },
      { subject: 'Français & Expression', score: 15.0, coef: 4, date: '18 Oct 2026' },
      { subject: 'Physique - Chimie', score: 15.5, coef: 3, date: '22 Oct 2026' },
    ]
  };

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
              <span>Espace Élève</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                {student.className}
              </span>
            </h1>
            <p className="text-xs text-slate-500">{student.fullName} ({student.matricule})</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 relative text-xs font-bold"
            title="Centre de Notifications"
          >
            <i className="fa-solid fa-bell text-amber-500"></i>
          </Link>

          <Link href="/profile" className="px-3 py-1.5 rounded-xl border bg-slate-50 text-xs font-bold">
            Mon Compte
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 flex-1 space-y-6">
        {/* Academic Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-300 uppercase">Mon Bilan Trimestre 1</span>
            <h2 className="text-3xl font-black mt-1 font-mono">{student.overallAverage.toFixed(2)} / 20</h2>
            <p className="text-xs text-blue-200 mt-1">Rang : {student.rank} sur {student.totalStudents} élèves • Assiduité : {student.presenceRate}%</p>
          </div>

          <Link
            href="/report-cards"
            className="px-4 py-2.5 bg-white text-blue-950 font-bold text-xs rounded-xl shadow-md hover:bg-blue-50 transition-colors"
          >
            Voir mon Bulletin →
          </Link>
        </div>

        {/* Schedule & Courses */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Mes Cours du Jour</h3>
          <div className="space-y-3">
            {student.todayCourses.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-600 block text-sm">{c.time}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{c.subject}</span>
                  <span className="text-slate-400 block">{c.teacher}</span>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-600 font-bold text-[10px]">
                  📍 {c.room}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Grades */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Mes Dernières Notes</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {student.lastGrades.map((g, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">{g.subject}</span>
                  <span className="text-slate-400">Coef {g.coef} • {g.date}</span>
                </div>
                <span className="font-mono font-black text-emerald-600 text-base">{g.score.toFixed(1)} / 20</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
