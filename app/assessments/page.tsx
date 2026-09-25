'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';
import { getAssessments, createAssessment, type AssessmentRow } from '../../lib/services/assessments';
import { getClasses, type ClassRow } from '../../lib/services/classes';
import { getSubjects, type SubjectRow } from '../../lib/services/subjects';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Devoir Surveillé N°2 : Trigonométrie',
    type: 'DEVOIR' as 'INTERROGATION' | 'DEVOIR' | 'EXAMEN' | 'CONTROLE_CONTINU',
    class_id: '',
    subject_id: '',
    date: '2026-11-12',
    max_score: 20,
    coefficient: 2.0,
  });

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [asmRes, clsRes, subRes] = await Promise.all([
        getAssessments(),
        getClasses(),
        getSubjects(),
      ]);
      setAssessments(asmRes.data || []);
      setClasses(clsRes.data || []);
      setSubjects(subRes.data || []);
      if (clsRes.data && clsRes.data.length > 0) {
        const defaultClassId = clsRes.data[0].id;
        setFormData(prev => ({ ...prev, class_id: defaultClassId }));
      }
      if (subRes.data && subRes.data.length > 0) {
        const defaultSubId = subRes.data[0].id;
        setFormData(prev => ({ ...prev, subject_id: defaultSubId }));
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAssessment({
      school_id: 'a0000000-0000-0000-0000-000000000001',
      class_id: formData.class_id,
      subject_id: formData.subject_id,
      evaluation_period_id: 'c0000000-0000-0000-0000-000000000001',
      teacher_profile_id: 'usr-tea-01',
      title: formData.title,
      type: formData.type,
      date: formData.date,
      max_score: formData.max_score,
      coefficient: formData.coefficient,
    });
    setIsModalOpen(false);
    const res = await getAssessments();
    setAssessments(res.data || []);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Évaluations Pédagogiques</h1>
            <p className="text-xs text-slate-500">Devoirs surveillés, interrogations et contrôles continus</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Programmer une Évaluation
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="grid md:grid-cols-2 gap-6">
          {assessments.map((a) => (
            <div key={a.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    a.type === 'DEVOIR' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {a.type}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    Barème : /{a.max_score} • Coef {a.coefficient}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{a.title}</h3>
                <p className="text-xs text-slate-400">Date prévue : {a.date}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <Link
                  href="/grades"
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  Saisir les Notes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Programmer une Évaluation</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Titre de l'Évaluation</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="DEVOIR">Devoir Surveillé</option>
                    <option value="INTERROGATION">Interrogation Écrite</option>
                    <option value="EXAMEN">Examen Blanc</option>
                    <option value="CONTROLE_CONTINU">Contrôle Continu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Note Max</label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Coefficient</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.coefficient}
                    onChange={(e) => setFormData({ ...formData, coefficient: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500">Annuler</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Programmer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
