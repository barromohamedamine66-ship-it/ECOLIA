'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTeacherAssignments, type TeacherAssignmentRow } from '../../lib/services/teacher-assignments';
import { getScheduleList, type EnrichedScheduleItem } from '../../lib/services/schedules';

export default function TeacherPortalPage() {
  const [assignments, setAssignments] = useState<TeacherAssignmentRow[]>([]);
  const [todayCourses, setTodayCourses] = useState<EnrichedScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [asgRes, schRes] = await Promise.all([
        getTeacherAssignments('usr-tea-01'), // M. KOFFI Yao
        getScheduleList({ teacherId: 'usr-tea-01' }),
      ]);
      setAssignments(asgRes.data);
      setTodayCourses(schRes.data);
      setLoading(false);
    }
    init();
  }, []);

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
              <span>Espace Enseignant</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                Mathématiques
              </span>
            </h1>
            <p className="text-xs text-slate-500">M. KOFFI Yao Simplice — Année 2026-2027</p>
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

          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-700 text-xs font-bold hover:bg-slate-100"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Mon Compte
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-4 md:p-6 flex-1 space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">Session Active</span>
            <h2 className="text-2xl font-black mt-1">Bonjour, M. KOFFI Yao</h2>
            <p className="text-xs text-slate-300 mt-1">
              Vous avez 2 classes affectées (3e A, Terminale D) pour un total de 8h de cours hebdomadaires.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/attendance"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <i className="fa-solid fa-user-check"></i>
              Faire l'Appel
            </Link>
            <Link
              href="/grades"
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Saisir les Notes
            </Link>
          </div>
        </div>

        {/* 3 Quick Action Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/attendance"
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg mb-3">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600">
              Feuille d'Appel Rapide
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pointage journalier des présences, retards et absences pour vos classes.
            </p>
          </Link>

          <Link
            href="/grades"
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg mb-3">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600">
              Cahier de Notes
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Saisie des devoirs, interrogations et soumission à la direction.
            </p>
          </Link>

          <Link
            href="/teacher/classes"
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-lg mb-3">
              <i className="fa-solid fa-users"></i>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600">
              Mes Classes & Élèves
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Effectifs, trombinoscopes et moyennes de vos classes affectées.
            </p>
          </Link>
        </div>

        {/* Today's Schedule Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-clock text-emerald-600"></i>
              Mon Planning & Emploi du Temps
            </h3>
            <Link href="/schedules" className="text-xs font-bold text-emerald-600 hover:underline">
              Voir la grille complète →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {todayCourses.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400 block text-sm">
                    {c.startTime} - {c.endTime}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                    {c.subjectName} — {c.className}
                  </span>
                  <span className="text-slate-400 text-[11px]">📍 {c.roomName}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {c.dayLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
