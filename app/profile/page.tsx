'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    fullName: 'M. KOUASSI Jean-Baptiste',
    email: 'directeur@horizon.ci',
    phone: '+225 07 08 09 10 11',
    role: 'DIRECTOR',
    roleLabel: 'Directeur des Études',
    schoolName: 'Groupe Scolaire Horizon',
    schoolAddress: 'Abidjan, Cocody Riviera 3',
    academicYear: '2026-2027',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('✅ Profil mis à jour avec succès !');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Profil & Paramètres du Compte</h1>
            <p className="text-xs text-slate-500">Informations personnelles et sécurité</p>
          </div>
        </div>

        <Link href="/" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl">
          ← Accueil
        </Link>
      </header>

      <main className="max-w-2xl w-full mx-auto p-6 flex-1 space-y-6">
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold">
            {toastMessage}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              K
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{userProfile.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {userProfile.roleLabel}
              </span>
              <p className="text-xs text-slate-400 mt-1">{userProfile.schoolName} — {userProfile.schoolAddress}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-500 mb-1">Nom & Prénoms</label>
              <input
                type="text"
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="w-full p-3 rounded-xl border bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
              >
                Enregistrer les Modifications
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
