'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { parseCSVContent, importStudentsBatch, type ParsedStudentRow, type ImportResult } from '../../../lib/services/import-students';

export default function StudentImportPage() {
  const [rows, setRows] = useState<ParsedStudentRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const sampleCSV = `Matricule,Nom,Prenoms,Genre,DateNaissance,Classe,NomParent,TelephoneParent,EmailParent
ECO-2026-00101,KOUAME,Koffi Jean-Yves,M,2012-05-14,6e A,KOUAME N'Goran,+225 07 08 12 34 56,kouame.ngoran@gmail.com
ECO-2026-00102,BAKAYOKO,Fatoumata,F,2011-09-22,5e A,BAKAYOKO Souleymane,+225 05 44 22 11 00,sbakayoko@yahoo.fr
ECO-2026-00103,N'GUESSAN,Marie-Esther,F,2010-02-18,4e A,N'GUESSAN Paul,+225 01 02 03 04 05,paul.nguessan@ci.ci
ECO-2026-00104,DIOMANDE,Cheick Oumar,M,2009-11-03,3e A,DIOMANDE Moussa,+225 07 77 88 99 00,moussa.diomande@gmail.com
ECO-2026-00105,TOURE,Aminata,F,2008-07-19,2nde C,TOURE Ibrahim,+225 05 99 88 77 66,ibrahim.toure@orange.ci
ECO-2026-00106,KONE,Abdoulaye,M,2007-04-25,Terminale D,KONE Seydou,+225 07 11 22 33 44,seydou.kone@gmail.com`;

  const downloadSampleTemplate = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'modele_import_eleves_ecolia.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCSVContent(content);
      setRows(parsed);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  const handleLoadDemoBatch = () => {
    setFileName('exemple_eleves_ci_2026.csv');
    const parsed = parseCSVContent(sampleCSV);
    setRows(parsed);
    setImportResult(null);
  };

  const handleExecuteImport = async () => {
    if (rows.length === 0) return;
    setImporting(true);
    const res = await importStudentsBatch(
      'a0000000-0000-0000-0000-000000000001',
      'b0000000-0000-0000-0000-000000000001',
      rows
    );
    setImporting(false);
    setImportResult(res);
  };

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
              <span>Importation Massive des Élèves</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                Rentrée Scolaire
              </span>
            </h1>
            <p className="text-xs text-slate-500">Création automatique des élèves, classes et fiches parents via Excel / CSV</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadSampleTemplate}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-xs font-bold hover:bg-slate-200 flex items-center gap-2"
          >
            <i className="fa-solid fa-file-arrow-down text-emerald-600"></i>
            Télécharger le Modèle CSV
          </button>
          <Link href="/students" className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200">
            Retour Liste Élèves
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Success Banner */}
        {importResult && (
          <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Importation Terminée avec Succès !</h3>
                <p className="text-xs text-emerald-300 mt-0.5">
                  {importResult.successCount} élève(s) importé(s) et affecté(s) dans leurs classes respectives.
                </p>
              </div>
            </div>
            <Link
              href="/students"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
            >
              Voir le Registre des Élèves →
            </Link>
          </div>
        )}

        {/* Upload Box */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4 shadow-sm hover:border-emerald-500 transition-all">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center text-2xl">
            <i className="fa-solid fa-cloud-arrow-up"></i>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Déposez votre fichier Excel / CSV d'inscriptions
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Colonnes requises : Matricule, Nom, Prénoms, Genre, Date de naissance, Classe, Nom du Parent, Téléphone du Parent.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
              <i className="fa-solid fa-folder-open"></i>
              Choisir un fichier CSV / Excel
              <input type="file" accept=".csv, .txt, .xlsx" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleLoadDemoBatch}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
              Charger un exemple (6 élèves types)
            </button>
          </div>

          {fileName && (
            <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              Fichier chargé : {fileName} ({rows.length} lignes détectées)
            </p>
          )}
        </div>

        {/* Rows Preview Table */}
        {rows.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-table-list text-emerald-600"></i>
                  Prévisualisation des Données ({rows.length} élèves prêts à importer)
                </h3>
                <p className="text-xs text-slate-500">Vérifiez les informations avant l'intégration définitive</p>
              </div>

              <button
                onClick={handleExecuteImport}
                disabled={importing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {importing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Importation en cours...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check-double"></i>
                    Valider l'Importation de {rows.length} élèves
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-750 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Matricule</th>
                    <th className="p-3">Nom & Prénoms</th>
                    <th className="p-3 text-center">Genre</th>
                    <th className="p-3">Date Naiss.</th>
                    <th className="p-3 font-bold text-emerald-700 dark:text-emerald-400">Classe</th>
                    <th className="p-3">Parent Tuteur</th>
                    <th className="p-3">Contact WhatsApp</th>
                    <th className="p-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-750/50">
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{r.matricule}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{r.lastName} {r.firstName}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                          {r.gender}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{r.birthDate}</td>
                      <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">{r.className}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{r.parentName}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{r.parentPhone}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Prêt
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
