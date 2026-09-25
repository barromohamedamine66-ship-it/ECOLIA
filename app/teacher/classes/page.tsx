'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudents, type StudentRow } from '../../../lib/services/students';

export default function TeacherClassesPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('3e A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/teacher" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Mes Classes & Élèves</h1>
            <p className="text-xs text-slate-500">M. KOFFI Yao — Classes autorisées</p>
          </div>
        </div>

        <Link href="/teacher" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
          ← Retour Espace Enseignant
        </Link>
      </header>

      <main className="max-w-5xl w-full mx-auto p-6 flex-1 space-y-6">
        <div className="flex gap-2 text-xs font-bold">
          {['3e A', 'Terminale D'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedClass === cls
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border text-slate-600'
              }`}
            >
              Classe de {cls}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Élèves Inscrits en {selectedClass}</span>
            <span className="text-slate-500">{students.length} élèves</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {students.map((st) => (
              <div key={st.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <img
                    src={st.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                    alt={st.first_name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">
                      {st.last_name.toUpperCase()} {st.first_name}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{st.matricule}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Assiduité : 96%
                  </span>
                  <Link
                    href="/grades"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                  >
                    Notes →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
