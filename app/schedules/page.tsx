'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';
import { getScheduleList, detectScheduleConflict, type EnrichedScheduleItem, DAY_NAMES } from '../../lib/services/schedules';
import { getClasses, type ClassRow } from '../../lib/services/classes';
import { getSubjects, type SubjectRow } from '../../lib/services/subjects';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<EnrichedScheduleItem[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [selectedView, setSelectedView] = useState<'CLASS' | 'TEACHER' | 'ALL'>('CLASS');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    teacherId: 'usr-tea-01',
    teacherName: 'M. KOFFI Yao Simplice',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    roomName: 'Bâtiment B - Salle 204',
  });

  useEffect(() => {
    async function init() {
      const [schRes, clsRes, subRes] = await Promise.all([
        getScheduleList(),
        getClasses(),
        getSubjects(),
      ]);
      setSchedules(schRes.data || []);
      setClasses(clsRes.data || []);
      setSubjects(subRes.data || []);
      if (clsRes.data && clsRes.data.length > 0) {
        const defaultClassId = clsRes.data[3]?.id || clsRes.data[0].id;
        const defaultSubjectId = subRes.data && subRes.data.length > 0 ? subRes.data[0].id : '';
        setSelectedClassId(defaultClassId);
        setFormData(prev => ({
          ...prev,
          classId: defaultClassId,
          subjectId: defaultSubjectId,
        }));
      }
    }
    init();
  }, []);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const targetClass = classes.find(c => c.id === formData.classId);
    const targetSubject = subjects.find(s => s.id === formData.subjectId);

    const newCoursePayload: Omit<EnrichedScheduleItem, 'id'> = {
      classId: formData.classId,
      className: targetClass?.name || '3e A',
      subjectId: formData.subjectId,
      subjectName: targetSubject?.name || 'Mathématiques',
      teacherId: formData.teacherId,
      teacherName: formData.teacherName,
      dayOfWeek: formData.dayOfWeek,
      dayLabel: DAY_NAMES[formData.dayOfWeek] || 'Lundi',
      startTime: formData.startTime,
      endTime: formData.endTime,
      roomName: formData.roomName,
    };

    // Vérification rigoureuse des conflits (Enseignant, Classe, Salle)
    const check = detectScheduleConflict(newCoursePayload, schedules);

    if (check.hasConflict) {
      setConflictError(check.errorMessage || 'Conflit d\'horaires détecté !');
      return;
    }

    const created: EnrichedScheduleItem = {
      ...newCoursePayload,
      id: `sch-${Date.now()}`,
    };

    setSchedules([...schedules, created]);
    setIsModalOpen(false);
  };

  const displayedSchedules = selectedView === 'CLASS'
    ? schedules.filter(s => s.classId === selectedClassId)
    : (selectedView === 'TEACHER' ? schedules.filter(s => s.teacherId === 'usr-tea-01') : schedules);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Emploi du Temps & Planning</h1>
            <p className="text-xs text-slate-500">Moteur anti-conflits pour professeurs, classes et salles</p>
          </div>
        </div>

        <button
          onClick={() => {
            setConflictError(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Ajouter un Cours
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* View Switcher Controls */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('CLASS')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedView === 'CLASS' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              🏫 Vue par Classe
            </button>
            <button
              onClick={() => setSelectedView('TEACHER')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedView === 'TEACHER' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              👨‍🏫 Vue Enseignant (M. KOFFI)
            </button>
            <button
              onClick={() => setSelectedView('ALL')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedView === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              🌐 Vue Globale Direction
            </button>
          </div>

          {selectedView === 'CLASS' && (
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-500">Classe :</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-900 font-bold"
              >
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Weekly Timetable Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((dayNum) => {
            const dayCourses = displayedSchedules
              .filter(s => s.dayOfWeek === dayNum)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={dayNum} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex flex-col">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-700 mb-3 text-center">
                  <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider block">
                    {DAY_NAMES[dayNum]}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{dayCourses.length} cours</span>
                </div>

                <div className="space-y-3 flex-1">
                  {dayCourses.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-300 dark:text-slate-600 italic">
                      Aucun cours
                    </div>
                  ) : (
                    dayCourses.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-mono font-black text-[11px] text-emerald-800 dark:text-emerald-300">
                          <span>{c.startTime} - {c.endTime}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-800/60 text-[9px]">
                            {c.className}
                          </span>
                        </div>
                        <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {c.subjectName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {c.teacherName}
                        </p>
                        <div className="pt-1 border-t border-emerald-500/20 text-[10px] text-slate-400 font-medium">
                          📍 {c.roomName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Planifier un Cours</h3>
            <p className="text-xs text-slate-400 mb-4">Le moteur détectera automatiquement tout chevauchement d'horaires.</p>

            {conflictError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold leading-relaxed">
                {conflictError}
              </div>
            )}

            <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Classe</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 font-bold"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Matière</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 font-bold"
                  >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Jour de la Semaine</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 font-bold"
                >
                  <option value={1}>Lundi</option>
                  <option value={2}>Mardi</option>
                  <option value={3}>Mercredi</option>
                  <option value={4}>Jeudi</option>
                  <option value={5}>Vendredi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Heure Début</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Heure Fin</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Salle de Classe</label>
                <input
                  type="text"
                  required
                  value={formData.roomName}
                  onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500">Annuler</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md">
                  Vérifier & Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
