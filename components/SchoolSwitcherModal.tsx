'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSchool } from '../lib/context/SchoolContext';

interface SchoolSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SchoolSwitcherModal({ isOpen, onClose }: SchoolSwitcherModalProps) {
  const router = useRouter();
  const { currentSchool, allSchools, setCurrentSchool } = useSchool();
  const [activeTab, setActiveTab] = useState<'SELECT' | 'CODE'>('SELECT');
  const [searchQuery, setSearchQuery] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const filteredSchools = allSchools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSchool = (school: typeof currentSchool) => {
    setCurrentSchool(school);
    onClose();
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeFeedback(null);
    const code = accessCode.trim().toUpperCase();

    if (!code) return;

    // 1. Check if it's a School Code
    const matchingSchool = allSchools.find(s => s.code.toUpperCase() === code);
    if (matchingSchool) {
      setCurrentSchool(matchingSchool);
      setCodeFeedback({ type: 'success', message: `Établissement « ${matchingSchool.name} » sélectionné avec succès ! Redirection...` });
      setTimeout(() => {
        onClose();
        router.push('/admin');
      }, 900);
      return;
    }

    // 2. Check if it's a Teacher Code (ex: TEA-9821, PROF, TEA-01)
    if (code.startsWith('TEA') || code.startsWith('PROF') || code.includes('KOFFI')) {
      setCodeFeedback({ type: 'success', message: 'Code Enseignant validé ! Redirection vers votre Espace Enseignant...' });
      setTimeout(() => {
        onClose();
        router.push('/teacher');
      }, 900);
      return;
    }

    // 3. Check if it's a Student Matricule (ex: ECO-2026-00001)
    if (code.startsWith('ECO') || code.startsWith('STU') || code.includes('2026')) {
      setCodeFeedback({ type: 'success', message: `Matricule élève ${code} reconnu ! Redirection vers le relevé et bulletin...` });
      setTimeout(() => {
        onClose();
        router.push('/student');
      }, 900);
      return;
    }

    // 4. Check if it's a Parent Code (ex: PAR-5541)
    if (code.startsWith('PAR') || code.includes('FAMILLE')) {
      setCodeFeedback({ type: 'success', message: 'Accès Parent vérifié ! Redirection vers votre Espace Famille...' });
      setTimeout(() => {
        onClose();
        router.push('/parent');
      }, 900);
      return;
    }

    // Unrecognized code
    setCodeFeedback({
      type: 'error',
      message: 'Code non reconnu. Entrez un code école (ex: HORIZON-ABJ), enseignant (TEA-9821) ou un matricule élève (ECO-2026-00001).'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 text-white my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
              <i className="fa-solid fa-building-columns"></i>
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Guichet d'Accès & Sélecteur d'Établissement
              </h3>
              <p className="text-xs text-slate-400">
                Connectez-vous à votre établissement scolaire ou saisissez votre code direct
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-800/80 p-1 border border-slate-700/80">
          <button
            onClick={() => setActiveTab('SELECT')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'SELECT'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-list-check"></i>
            Choisir mon Établissement ({allSchools.length})
          </button>
          <button
            onClick={() => setActiveTab('CODE')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'CODE'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-key"></i>
            Accès par Code / Matricule
          </button>
        </div>

        {/* TAB 1: School Directory & Selection */}
        {activeTab === 'SELECT' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom d'école, ville (Abidjan, Bouaké...), ou code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* School List */}
            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {filteredSchools.map(school => {
                const isSelected = currentSchool.id === school.id;
                return (
                  <div
                    key={school.id}
                    onClick={() => handleSelectSchool(school)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {school.logo_url ? (
                        <img
                          src={school.logo_url}
                          alt={school.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-700 shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-emerald-900/60 text-emerald-300 font-black text-base flex items-center justify-center border border-emerald-500/30">
                          {school.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                            {school.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                            {school.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          📍 {school.commune ? `${school.commune}, ${school.city}` : school.city} • Tél: {school.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isSelected ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Actif
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 group-hover:text-white font-bold transition-colors">
                          Sélectionner →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Access by Code */}
        {activeTab === 'CODE' && (
          <form onSubmit={handleValidateCode} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
              <i className="fa-solid fa-circle-info text-amber-400 mr-2"></i>
              Saisissez votre identifiant ou code attribué (Code WhatsApp Enseignant, Matricule Élève, Code Famille ou Code Établissement) pour vous connecter directement.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Code d'Accès, Matricule ou Code Établissement :
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={e => setAccessCode(e.target.value)}
                placeholder="Ex: TEA-9821, ECO-2026-00001, ou HORIZON-ABJ..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm font-mono font-bold text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase"
                autoFocus
              />
            </div>

            {/* Code Feedback */}
            {codeFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  codeFeedback.type === 'success'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                }`}
              >
                <i className={`fa-solid ${codeFeedback.type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-exclamation text-rose-400'}`}></i>
                <span>{codeFeedback.message}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                Valider & Accéder à mon Espace
              </button>
            </div>
          </form>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Établissement actif : <strong className="text-emerald-400">{currentSchool.name}</strong></span>
          <button
            onClick={() => {
              onClose();
              router.push('/super-admin/schools');
            }}
            className="text-amber-400 hover:underline font-bold"
          >
            + Inscrire une nouvelle école
          </button>
        </div>
      </div>
    </div>
  );
}
