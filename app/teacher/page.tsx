'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTeacherAssignments, type TeacherAssignmentRow } from '../../lib/services/teacher-assignments';
import { getScheduleList, type EnrichedScheduleItem } from '../../lib/services/schedules';
import { useSchool } from '../../lib/context/SchoolContext';
import SchoolSwitcherModal from '../../components/SchoolSwitcherModal';

export default function TeacherPortalPage() {
  const { currentSchool } = useSchool();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
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
  }, [currentSchool.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-900/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-950/50">
              É
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  Portail Enseignant & Pédagogie
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Mathématiques
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentSchool.name} • M. KOFFI Yao</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-sm"
              title="Changer d'Établissement"
            >
              <i className="fa-solid fa-building-columns text-emerald-400"></i>
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
        {/* Contextual Teacher Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 shadow-2xl bg-slate-900 group">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/teacher_hero.jpg"
              alt="Enseignement et Pédagogie Écolia"
              className="w-full h-full object-cover object-center opacity-35 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
          </div>

          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                <i className="fa-solid fa-chalkboard-user"></i>
                Espace Pédagogique Actif
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Bonjour, M. KOFFI Yao
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Vous avez <strong>2 classes affectées</strong> (3e A, Terminale D) pour un total de <strong>8h de cours</strong> hebdomadaires avec pointage numérique d'appel et saisie directe des devoirs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/attendance"
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <i className="fa-solid fa-user-check text-sm"></i>
                Faire l'Appel
              </Link>
              <Link
                href="/grades"
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-2xl border border-amber-500/40 shadow-lg flex items-center gap-2.5 transition-all"
              >
                <i className="fa-solid fa-pen-to-square text-sm"></i>
                Saisir les Notes
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Quick Action Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          <Link
            href="/attendance"
            className="p-6 rounded-3xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 hover:border-emerald-500/80 shadow-xl transition-all group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xl mb-4 border border-emerald-500/30">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">
              Feuille d'Appel Rapide
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pointage journalier des présences, retards et absences pour vos classes.
            </p>
          </Link>

          <Link
            href="/grades"
            className="p-6 rounded-3xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 hover:border-blue-500/80 shadow-xl transition-all group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xl mb-4 border border-blue-500/30">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h3 className="font-extrabold text-base text-white group-hover:text-blue-300 transition-colors">
              Cahier de Notes & Moyennes
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Saisie des devoirs, interrogations et soumission à la direction pour les bulletins.
            </p>
          </Link>

          <Link
            href="/teachers"
            className="p-6 rounded-3xl bg-slate-800/80 backdrop-blur-md border border-slate-700/80 hover:border-purple-500/80 shadow-xl transition-all group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xl mb-4 border border-purple-500/30">
              <i className="fa-solid fa-users"></i>
            </div>
            <h3 className="font-extrabold text-base text-white group-hover:text-purple-300 transition-colors">
              Mes Classes & Effectifs
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Effectifs, fiches élèves et moyennes récapitulatives par niveau.
            </p>
          </Link>
        </div>

        {/* Today's Schedule Card */}
        <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <i className="fa-solid fa-clock text-emerald-400"></i>
              Mon Planning & Emploi du Temps Hebdomadaire
            </h3>
            <Link href="/schedules" className="text-xs font-bold text-emerald-400 hover:underline">
              Voir la grille complète →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {todayCourses.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 flex items-center justify-between text-xs hover:border-emerald-500/40 transition-colors">
                <div>
                  <span className="font-mono font-black text-emerald-400 block text-sm">
                    {c.startTime} - {c.endTime}
                  </span>
                  <span className="font-bold text-white mt-1 block">
                    {c.subjectName} — <span className="text-amber-300">{c.className}</span>
                  </span>
                  <span className="text-slate-400 text-[11px] mt-0.5 block">📍 {c.roomName}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {c.dayLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>ÉCOLIA © 2026 — L'école, simplement. Conçu pour l'Afrique francophone.</p>
      </footer>

      {/* School Switcher Modal */}
      <SchoolSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
}
