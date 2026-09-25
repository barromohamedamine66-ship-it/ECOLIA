'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAttendanceSheet, saveAttendanceSheet, type AttendanceRecordInput, type AttendanceStatus } from '../../lib/services/attendance';
import { getClasses, type ClassRow } from '../../lib/services/classes';

export default function AttendancePage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('Matinée (07h30-12h00)');

  const [roster, setRoster] = useState<AttendanceRecordInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function initClasses() {
      const clsRes = await getClasses();
      setClasses(clsRes.data || []);
      if (clsRes.data && clsRes.data.length > 0) {
        setSelectedClass(clsRes.data[3]?.id || clsRes.data[0].id); // 3e A
      }
    }
    initClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    loadSheet(selectedClass, selectedDate, timeSlot);
  }, [selectedClass, selectedDate, timeSlot]);

  const loadSheet = async (clsId: string, dt: string, slot: string) => {
    setLoading(true);
    const res = await getAttendanceSheet(clsId, dt, slot);
    setRoster(res.data || []);
    setLoading(false);
  };

  const handleStatusChange = (index: number, newStatus: AttendanceStatus) => {
    const updated = [...roster];
    updated[index].status = newStatus;
    if (newStatus === 'PRESENT') {
      updated[index].minutesLate = 0;
      updated[index].reason = undefined;
    } else if (newStatus === 'LATE' && (!updated[index].minutesLate || updated[index].minutesLate === 0)) {
      updated[index].minutesLate = 15;
    }
    setRoster(updated);
  };

  const handleAllPresent = () => {
    const updated = roster.map(r => ({
      ...r,
      status: 'PRESENT' as AttendanceStatus,
      minutesLate: 0,
      reason: undefined,
    }));
    setRoster(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveAttendanceSheet(
      'a0000000-0000-0000-0000-000000000001',
      'b0000000-0000-0000-0000-000000000001',
      selectedClass,
      selectedDate,
      timeSlot,
      roster,
      'usr-tea-01'
    );
    setSaving(false);
    setToastMessage('✅ Feuille d\'appel journalière enregistrée avec succès !');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Statistiques en temps réel
  const presentCount = roster.filter(r => r.status === 'PRESENT').length;
  const absentCount = roster.filter(r => r.status === 'ABSENT').length;
  const lateCount = roster.filter(r => r.status === 'LATE').length;
  const excusedCount = roster.filter(r => r.status === 'EXCUSED').length;
  const total = roster.length;
  const presenceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

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
              <span>Feuille d'Appel & Présences</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                Assiduité : {presenceRate}%
              </span>
            </h1>
            <p className="text-xs text-slate-500">Pointage rapide optimisé mobile pour les enseignants</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/attendance/history"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            Historique
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            {saving ? 'Enregistrement...' : 'Valider l\'Appel'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 flex-1 space-y-6">
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-sm font-bold shadow-lg flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Selectors Card */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-500 mb-1">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-500 mb-1">Créneau / Séance</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
            >
              <option value="Matinée (07h30-12h00)">Matinée (07h30 - 12h00)</option>
              <option value="Après-midi (13h30-17h30)">Après-midi (13h30 - 17h30)</option>
            </select>
          </div>
        </div>

        {/* Action & Stats Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-700 dark:text-emerald-400">✓ Présents : {presentCount}</span>
            <span className="text-rose-600">✕ Absents : {absentCount}</span>
            <span className="text-amber-600">⏳ Retards : {lateCount}</span>
            <span className="text-blue-600">📑 Justifiés : {excusedCount}</span>
          </div>

          <button
            type="button"
            onClick={handleAllPresent}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            ⚡ Marquer Tout le Monde Présent
          </button>
        </div>

        {/* Student Roster List */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden">
          {roster.map((student, idx) => (
            <div key={student.studentId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-xs">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {student.studentName}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{student.matricule}</span>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="grid grid-cols-4 gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleStatusChange(idx, 'PRESENT')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    student.status === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  ✓ Présent
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(idx, 'ABSENT')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    student.status === 'ABSENT'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  ✕ Absent
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(idx, 'LATE')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    student.status === 'LATE'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  ⏳ Retard
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(idx, 'EXCUSED')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    student.status === 'EXCUSED'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  📑 Justifié
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
