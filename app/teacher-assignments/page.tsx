'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTeacherAssignments, createTeacherAssignment, type TeacherAssignmentRow } from '../../lib/services/teacher-assignments';
import { getClasses, type ClassRow } from '../../lib/services/classes';
import { getSubjects, type SubjectRow } from '../../lib/services/subjects';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<TeacherAssignmentRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [asgRes, clsRes, subRes] = await Promise.all([
        getTeacherAssignments(),
        getClasses(),
        getSubjects(),
      ]);
      setAssignments(asgRes.data);
      setClasses(clsRes.data);
      setSubjects(subRes.data);
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Affectations des Enseignants</h1>
            <p className="text-xs text-slate-500">Droits d'accès pédagogiques : Enseignant ➔ Classe ➔ Matière</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto p-6 flex-1">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="p-4">Enseignant</th>
                <th className="p-4">Classe Affectée</th>
                <th className="p-4">Matière Enseignée</th>
                <th className="p-4">Droits Pédagogiques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  M. KOFFI Yao Simplice
                  <span className="block text-xs text-slate-400 font-normal">prof.koffi@horizon.ci</span>
                </td>
                <td className="p-4 font-mono font-bold text-emerald-700">3e A (Collège)</td>
                <td className="p-4 font-bold">Mathématiques (Coef 4)</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Saisie Notes & Appel
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  M. KOFFI Yao Simplice
                  <span className="block text-xs text-slate-400 font-normal">prof.koffi@horizon.ci</span>
                </td>
                <td className="p-4 font-mono font-bold text-emerald-700">Terminale D (Lycée)</td>
                <td className="p-4 font-bold">Mathématiques (Coef 4)</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Saisie Notes & Appel
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
