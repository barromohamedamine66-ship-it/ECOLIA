'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudentReportCard, type FullReportCardData } from '../../lib/services/report-cards';
import { formatRank } from '../../lib/calculations/averages';

export default function ReportCardsPage() {
  const [reportData, setReportData] = useState<FullReportCardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      const res = await getStudentReportCard('stu-2026-001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001');
      if (res.data) setReportData(res.data);
      setLoading(false);
    }
    loadReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !reportData) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-500">
        <div className="text-center space-y-3">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-emerald-600"></i>
          <p className="font-bold text-sm">Génération du bulletin scolaire officiel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 p-4 md:p-8 flex flex-col items-center">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="max-w-4xl w-full mb-6 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/" className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i>
            Retour au Tableau de Bord
          </Link>
          <span className="text-xs text-slate-500 font-bold">
            Format A4 Officiel • Côte d'Ivoire (MENA)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <i className="fa-solid fa-print"></i>
            Imprimer / Exporter en PDF
          </button>
        </div>
      </div>

      {/* Official A4 Sheet */}
      <div className="max-w-4xl w-full bg-white text-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:rounded-none">
        {/* National Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900 text-xs uppercase font-bold tracking-wider">
          <div className="text-left space-y-1">
            <p className="font-extrabold text-sm">RÉPUBLIQUE DE CÔTE D'IVOIRE</p>
            <p className="text-[10px] text-slate-600">Union - Discipline - Travail</p>
            <p className="text-[10px] text-slate-500 font-normal">MINISTÈRE DE L'ÉDUCATION NATIONALE ET DE L'ALPHABÉTISATION</p>
            <p className="text-[10px] font-bold text-emerald-800">DRENA : ABIDJAN 1 • CODE ÉTABLISSEMENT : 012480</p>
          </div>

          <div className="text-right space-y-1">
            <p className="text-base font-black text-emerald-900">{reportData.school.name}</p>
            <p className="text-[10px] text-amber-700 italic font-medium">« {reportData.school.motto} »</p>
            <p className="text-[10px] text-slate-500 font-normal">{reportData.school.address} • Tél: {reportData.school.phone}</p>
          </div>
        </div>

        {/* Title Badge */}
        <div className="text-center my-6">
          <div className="inline-block px-8 py-2 bg-slate-900 text-white rounded-full text-sm font-black tracking-widest uppercase shadow-md">
            BULLETIN DE NOTES — {reportData.periodName.toUpperCase()}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Année Scolaire : {reportData.academicYear}</p>
        </div>

        {/* Student & Class Info Card */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6">
          <div className="space-y-1.5">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Nom et Prénoms :</span>
              <span className="font-extrabold text-sm ml-2 text-slate-900">
                {reportData.student.last_name.toUpperCase()} {reportData.student.first_name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Matricule MENA :</span>
              <span className="font-mono font-bold ml-2 text-emerald-800">{reportData.student.matricule}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Né(e) le :</span>
              <span className="ml-2 font-medium">{reportData.student.birth_date} à {reportData.student.birth_place}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Classe :</span>
              <span className="font-black text-sm ml-2 text-slate-900">{reportData.className}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Effectif :</span>
              <span className="font-bold ml-2">{reportData.totalStudents} élèves</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Absences :</span>
              <span className="font-bold ml-2 text-slate-800">{reportData.totalAbsences} h ({reportData.justifiedAbsences} h justifiées)</span>
            </div>
          </div>
        </div>

        {/* Subjects & Grades Table */}
        <table className="w-full text-left text-xs border-collapse mb-6 border border-slate-300">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
              <th className="p-2.5 border border-slate-700">Matières Enseignées</th>
              <th className="p-2.5 text-center border border-slate-700 w-16">Coef</th>
              <th className="p-2.5 text-center border border-slate-700 w-20">Moyenne /20</th>
              <th className="p-2.5 text-center border border-slate-700 w-24">Points (M×C)</th>
              <th className="p-2.5 border border-slate-700">Appréciations & Signature du Professeur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reportData.subjects.map((sub, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-2.5 font-bold border border-slate-300 text-slate-900">
                  {sub.name}
                  <span className="block text-[9px] text-slate-400 font-normal">{sub.category}</span>
                </td>
                <td className="p-2.5 text-center font-bold border border-slate-300">{sub.coefficient}</td>
                <td className="p-2.5 text-center font-black border border-slate-300 font-mono text-emerald-800">
                  {sub.average !== null ? sub.average.toFixed(2) : '-'}
                </td>
                <td className="p-2.5 text-center font-bold border border-slate-300 font-mono">
                  {sub.weightedAverage !== null ? sub.weightedAverage.toFixed(2) : '-'}
                </td>
                <td className="p-2.5 italic text-slate-600 border border-slate-300 text-[11px]">
                  {sub.teacherComment}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-black text-xs border-t-2 border-slate-900">
              <td className="p-3 border border-slate-300">TOTAL DES COEFFICIENTS & POINTS</td>
              <td className="p-3 text-center border border-slate-300 font-mono">{reportData.totalCoefficients}</td>
              <td className="p-3 text-center border border-slate-300 text-slate-400">-</td>
              <td className="p-3 text-center border border-slate-300 font-mono text-emerald-900">
                {reportData.totalWeightedPoints.toFixed(2)}
              </td>
              <td className="p-3 border border-slate-300 text-slate-500 italic font-normal">
                Barème officiel MENA Côte d'Ivoire
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Synthesis & Council Verdict */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6 text-center">
          <div>
            <span className="text-[10px] text-emerald-800 uppercase font-black tracking-wider block">Moyenne Générale</span>
            <span className="text-3xl font-black text-emerald-950 font-mono">
              {reportData.overallAverage?.toFixed(2)} <span className="text-xs">/ 20</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-800 uppercase font-black tracking-wider block">Rang dans la Classe</span>
            <span className="text-2xl font-black text-emerald-950 font-mono mt-1 block">
              {formatRank(reportData.classRank, reportData.isExAequo)} <span className="text-xs text-slate-500">sur {reportData.totalStudents}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-800 uppercase font-black tracking-wider block">Mention du Trimestre</span>
            <span className="text-lg font-black text-emerald-900 mt-1 block">
              {reportData.mention}
            </span>
          </div>
        </div>

        {/* Council Decision Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Décision & Appréciation Générale du Conseil de Classe :
          </span>
          <p className="text-xs font-semibold text-slate-800 italic">
            « {reportData.councilDecision} — {reportData.appreciation} »
          </p>
        </div>

        {/* Signatures & Stamp */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
          <div>
            <p className="font-bold text-slate-700">Le Professeur Principal</p>
            <div className="h-16 flex items-end justify-center text-[10px] text-slate-400 italic">
              Signature
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-700">Le Parent d'Élève</p>
            <div className="h-16 flex items-end justify-center text-[10px] text-slate-400 italic">
              Vu et pris connaissance
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-700">Le Chef d'Établissement</p>
            <div className="h-16 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-700/50 flex items-center justify-center text-[8px] font-black text-emerald-800 uppercase text-center rotate-[-12deg]">
                Cachet Officiel
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Fraud QR Code & Security Certificate */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <Link
            href="/verify/ECO-2026-00001-T1"
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl hover:border-emerald-600 transition-all flex items-center gap-2.5 group"
            title="Cliquer pour vérifier l'authenticité"
          >
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-400 text-base">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-800 group-hover:text-emerald-700 block text-[10px]">
                Scan de Vérification Anti-Fraude
              </span>
              <span className="text-[9px] text-slate-400 font-mono">Certificat : ECO-CERT-99A82B</span>
            </div>
          </Link>

          <div className="text-right space-y-0.5">
            <p className="font-bold text-slate-700">Document officiel généré par ÉCOLIA SaaS</p>
            <p className="text-[9px] text-slate-400">Conforme au système éducatif de Côte d'Ivoire</p>
          </div>
        </div>
      </div>
    </div>
  );
}
