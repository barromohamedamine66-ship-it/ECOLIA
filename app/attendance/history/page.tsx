'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../../../components/SchoolLifeLogo';
import { getClasses, type ClassRow } from '../../../lib/services/classes';

interface AttendanceHistoryItem {
  id: string;
  date: string;
  className: string;
  timeSlot: string;
  studentName: string;
  matricule: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  minutesLate: number;
  reason?: string;
  takenByName: string;
}

export default function AttendanceHistoryPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const historyData: AttendanceHistoryItem[] = [
    { id: 'h-1', date: '2026-09-24', className: '3e A', timeSlot: 'Matinée', studentName: 'BAMBA Yasmine', matricule: 'ECO-2026-00005', status: 'ABSENT', minutesLate: 0, reason: 'Non justifié', takenByName: 'M. KOFFI Yao' },
    { id: 'h-2', date: '2026-09-24', className: '3e A', timeSlot: 'Matinée', studentName: 'YAO Kouamé David', matricule: 'ECO-2026-00006', status: 'LATE', minutesLate: 15, reason: 'Embouteillage', takenByName: 'M. KOFFI Yao' },
    { id: 'h-3', date: '2026-09-23', className: '3e A', timeSlot: 'Après-midi', studentName: 'DIALLO Fatoumata', matricule: 'ECO-2026-00007', status: 'EXCUSED', minutesLate: 0, reason: 'Certificat médical', takenByName: 'M. KOFFI Yao' },
    { id: 'h-4', date: '2026-09-22', className: '6e B', timeSlot: 'Matinée', studentName: 'TRAORÉ Aïcha', matricule: 'ECO-2026-00002', status: 'PRESENT', minutesLate: 0, takenByName: 'Mme KONE Fatou' },
    { id: 'h-5', date: '2026-09-22', className: 'CM2 A', timeSlot: 'Matinée', studentName: 'TRAORÉ Mariam', matricule: 'ECO-2026-00003', status: 'PRESENT', minutesLate: 0, takenByName: 'M. TOURE Seydou' },
  ];

  useEffect(() => {
    async function init() {
      const clsRes = await getClasses();
      setClasses(clsRes.data);
    }
    init();
  }, []);

  const filtered = historyData.filter(item => {
    if (selectedClass !== 'ALL' && item.className !== selectedClass) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/attendance" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Historique des Présences & Absences</h1>
            <p className="text-xs text-slate-500">Traçabilité journalière et justificatifs</p>
          </div>
        </div>

        <Link href="/attendance" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
          Faire l'Appel
        </Link>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-4 items-center text-xs">
          <div>
            <label className="block font-bold text-slate-500 mb-1">Filtrer par Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 font-bold"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ABSENT">✕ Absents uniquement</option>
              <option value="LATE">⏳ Retards uniquement</option>
              <option value="EXCUSED">📑 Justifiés</option>
              <option value="PRESENT">✓ Présents</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase border-b">
                <tr>
                  <th className="p-4">Date & Séance</th>
                  <th className="p-4">Classe</th>
                  <th className="p-4">Élève</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Détails / Motif</th>
                  <th className="p-4">Enseignant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {row.date}
                      <span className="block text-[11px] text-slate-400 font-normal">{row.timeSlot}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-700">{row.className}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {row.studentName}
                      <span className="block text-[11px] font-mono text-slate-400">{row.matricule}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        row.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : (row.status === 'ABSENT' ? 'bg-rose-100 text-rose-800' : (row.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'))
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {row.minutesLate > 0 && <span className="font-bold text-amber-600 block">Retard : +{row.minutesLate} min</span>}
                      {row.reason || '-'}
                    </td>
                    <td className="p-4 text-slate-500">{row.takenByName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
