'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAssessments, type AssessmentRow } from '../../lib/services/assessments';
import { getGradesForAssessment, saveGradesBatch, validateAssessmentGrades, type GradeRow, type GradeInput } from '../../lib/services/grades';
import { getClasses, type ClassRow } from '../../lib/services/classes';
import { getSubjects, type SubjectRow } from '../../lib/services/subjects';
import { calculateSubjectAverage } from '../../lib/calculations/averages';

interface StudentGradeItem {
  studentId: string;
  matricule: string;
  name: string;
  score: string;
  isAbsent: boolean;
  comment: string;
}

export default function GradesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  
  const [gradesList, setGradesList] = useState<StudentGradeItem[]>([]);
  const [gradeStatus, setGradeStatus] = useState<'DRAFT' | 'SUBMITTED' | 'VALIDATED'>('DRAFT');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function initOptions() {
      const [clsRes, subRes, asmRes] = await Promise.all([
        getClasses(),
        getSubjects(),
        getAssessments(),
      ]);
      setClasses(clsRes.data);
      setSubjects(subRes.data);
      setAssessments(asmRes.data);

      if (clsRes.data.length > 0) setSelectedClass(clsRes.data[3]?.id || clsRes.data[0].id); // 3e A
      if (subRes.data.length > 0) setSelectedSubject(subRes.data[0].id); // Maths
      if (asmRes.data.length > 0) setSelectedAssessment(asmRes.data[0].id);
    }
    initOptions();
  }, []);

  useEffect(() => {
    if (!selectedAssessment) return;
    loadAssessmentGrades(selectedAssessment);
  }, [selectedAssessment]);

  const loadAssessmentGrades = async (asmId: string) => {
    setLoading(true);
    const res = await getGradesForAssessment(asmId);

    // Initialiser les 5 élèves de démonstration
    const studentsDemo = [
      { id: 'stu-2026-001', matricule: 'ECO-2026-00001', name: 'TRAORÉ Mohamed' },
      { id: 'stu-2026-004', matricule: 'ECO-2026-00004', name: 'KOUASSI Ange Emmanuel' },
      { id: 'stu-2026-005', matricule: 'ECO-2026-00005', name: 'BAMBA Yasmine' },
      { id: 'stu-2026-006', matricule: 'ECO-2026-00006', name: 'YAO Kouamé David' },
      { id: 'stu-2026-007', matricule: 'ECO-2026-00007', name: 'DIALLO Fatoumata' },
    ];

    const currentStatus = res.data.length > 0 ? res.data[0].status : 'DRAFT';
    setGradeStatus(currentStatus);

    const mapped = studentsDemo.map((st) => {
      const found = res.data.find(g => g.student_id === st.id);
      return {
        studentId: st.id,
        matricule: st.matricule,
        name: st.name,
        score: found?.score !== null && found?.score !== undefined ? String(found.score) : '',
        isAbsent: Boolean(found?.is_absent),
        comment: found?.teacher_comment || '',
      };
    });

    setGradesList(mapped);
    setLoading(false);
  };

  const handleScoreChange = (index: number, val: string) => {
    if (gradeStatus === 'VALIDATED') return; // Verrouillé
    const updated = [...gradesList];
    updated[index].score = val;
    setGradesList(updated);
  };

  const handleAbsentChange = (index: number, val: boolean) => {
    if (gradeStatus === 'VALIDATED') return;
    const updated = [...gradesList];
    updated[index].isAbsent = val;
    if (val) updated[index].score = '';
    setGradesList(updated);
  };

  const handleSave = async (targetStatus: 'DRAFT' | 'SUBMITTED') => {
    setSaving(true);
    const payload: GradeInput[] = gradesList.map(g => ({
      studentId: g.studentId,
      score: g.isAbsent ? null : (g.score !== '' ? parseFloat(g.score) : null),
      isAbsent: g.isAbsent,
      teacherComment: g.comment,
    }));

    await saveGradesBatch(selectedAssessment, 'a0000000-0000-0000-0000-000000000001', payload, targetStatus);
    setGradeStatus(targetStatus);
    setSaving(false);
    setToastMessage(targetStatus === 'SUBMITTED' ? '✅ Notes soumises pour validation à la Direction !' : '💾 Brouillon sauvegardé avec succès.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleValidateDirection = async () => {
    if (confirm('Confirmez-vous la validation définitive de ces notes ? (Les enseignants ne pourront plus les modifier)')) {
      setSaving(true);
      await validateAssessmentGrades(selectedAssessment, 'usr-dir-01');
      setGradeStatus('VALIDATED');
      setSaving(false);
      setToastMessage('🔒 Notes VALIDÉES par la Direction. Verrouillage actif.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Calcul statistique instantané
  const numericalScores = gradesList
    .filter(g => !g.isAbsent && g.score !== '' && !isNaN(parseFloat(g.score)))
    .map(g => ({ score: parseFloat(g.score), coefficient: 1 }));

  const currentClassAvg = calculateSubjectAverage(numericalScores);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Saisie & Validation des Notes</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                gradeStatus === 'VALIDATED' ? 'bg-emerald-100 text-emerald-700' : (gradeStatus === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')
              }`}>
                {gradeStatus === 'VALIDATED' ? '🔒 VALIDÉ' : (gradeStatus === 'SUBMITTED' ? '📨 SOUMIS' : '✏️ BROUILLON')}
              </span>
            </h1>
            <p className="text-xs text-slate-500">Interface optimisée mobile & saisie rapide</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {gradeStatus !== 'VALIDATED' && (
            <>
              <button
                onClick={() => handleSave('DRAFT')}
                disabled={saving}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Sauvegarder Brouillon
              </button>
              <button
                onClick={() => handleSave('SUBMITTED')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Soumettre à la Direction
              </button>
            </>
          )}

          {gradeStatus === 'SUBMITTED' && (
            <button
              onClick={handleValidateDirection}
              disabled={saving}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <i className="fa-solid fa-check-double"></i>
              Valider (Direction)
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto p-6 flex-1 space-y-6">
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Selectors Bar */}
        <div className="grid md:grid-cols-3 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
          <div>
            <label className="block font-bold text-slate-500 mb-1">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-white"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-500 mb-1">Matière</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-white"
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Coef: {s.default_coefficient})</option>)}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-500 mb-1">Évaluation Active</label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-white"
            >
              {assessments.map(a => <option key={a.id} value={a.id}>{a.title} ({a.type} - Coef {a.coefficient})</option>)}
            </select>
          </div>
        </div>

        {/* Stats Preview Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Moyenne de l'Évaluation</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1 font-mono">
              {currentClassAvg !== null ? `${currentClassAvg} / 20` : '-'}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Notes Saisies</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white block mt-1 font-mono">
              {numericalScores.length} / {gradesList.length}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Absents</span>
            <span className="text-2xl font-black text-amber-500 block mt-1 font-mono">
              {gradesList.filter(g => g.isAbsent).length}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Statut Validation</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block mt-2">
              {gradeStatus === 'VALIDATED' ? 'Verrouillé par la Direction' : 'Modification autorisée'}
            </span>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-800 dark:text-white">Feuille de Notes — 3e A</span>
            <span className="text-xs text-slate-400">Barème officiel sur 20.00</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {gradesList.map((item, index) => (
              <div key={item.studentId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-[220px]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 font-bold flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{item.matricule}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Note Input */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400">Note / 20 :</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      disabled={item.isAbsent || gradeStatus === 'VALIDATED'}
                      value={item.score}
                      onChange={(e) => handleScoreChange(index, e.target.value)}
                      placeholder="Ex: 15.5"
                      className="w-24 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                    />
                  </div>

                  {/* Absent Checkbox */}
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={gradeStatus === 'VALIDATED'}
                      checked={item.isAbsent}
                      onChange={(e) => handleAbsentChange(index, e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Absent</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
