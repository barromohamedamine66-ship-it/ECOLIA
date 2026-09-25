'use client';

import React from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../../components/SchoolLifeLogo';

export default function DocumentVerificationPage({ params }: { params: { id: string } }) {
  const certId = params.id || 'ECO-CERT-2026-99A82B';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6">
      {/* Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/" />
          <div>
            <span className="text-base font-black tracking-tight text-white block">SCHOOLLIFE CERTIFICATE</span>
            <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase block">Système d'Authentification Anti-Fraude</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Certifié Authentique
        </span>
      </header>

      {/* Main Certificate Verification Card */}
      <main className="max-w-xl mx-auto w-full my-8 space-y-6">
        <div className="p-8 rounded-3xl bg-slate-850 border border-emerald-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Validation Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-3xl text-emerald-400">
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Document Officiel Vérifié</h1>
              <p className="text-xs text-slate-400 mt-1">Ce bulletin de notes est conforme aux registres numériques du Ministère & de l'Établissement.</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400 font-semibold">Numéro de Certificat :</span>
              <span className="font-mono font-bold text-amber-400">{certId.toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400 font-semibold">Établissement :</span>
              <span className="font-bold text-white">Groupe Scolaire Horizon</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400 font-semibold">Élève :</span>
              <span className="font-bold text-white">TRAORÉ Mohamed</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400 font-semibold">Matricule :</span>
              <span className="font-mono font-bold text-emerald-400">ECO-2026-00001</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400 font-semibold">Classe & Niveau :</span>
              <span className="font-bold text-white">3ème A (Collège / Brevet)</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <span className="text-slate-400 font-semibold">Période d'Évaluation :</span>
              <span className="font-bold text-white">1er Trimestre 2026-2027</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 font-semibold">Moyenne Générale :</span>
              <div className="text-right">
                <span className="font-mono font-black text-emerald-400 text-sm">15.65 / 20</span>
                <span className="text-[10px] text-slate-400 block font-semibold">(2ème sur 42 élèves • Mention Bien)</span>
              </div>
            </div>
          </div>

          {/* Security Hash info */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
            <i className="fa-solid fa-fingerprint text-emerald-400 text-base"></i>
            <div>
              <p className="font-bold text-slate-300">Empreinte Cryptographique SHA-256 :</p>
              <p className="font-mono text-[9px] text-slate-500 break-all">8f3a9e2c4b71...d0429f55ae031ecolia2026</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-xl mx-auto w-full text-center text-xs text-slate-500 pt-6 border-t border-slate-800">
        <p>SCHOOLLIFE © 2026 — Plateforme d'Authentification Scolaire Certifiée.</p>
      </footer>
    </div>
  );
}
