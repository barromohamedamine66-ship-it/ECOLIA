'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSchoolById, updateSchoolSettings, type SchoolCustomizationPayload } from '../../../lib/services/schools';
import { useSchool } from '../../../lib/context/SchoolContext';

export default function SchoolSettingsPage() {
  const { currentSchool, setCurrentSchool, refreshSchools } = useSchool();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState<SchoolCustomizationPayload>({
    name: currentSchool.name,
    motto: currentSchool.motto || 'Discipline • Travail • Excellence',
    logo_url: currentSchool.logo_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
    phone: currentSchool.phone || '+225 27 22 44 55 66',
    email: currentSchool.email || 'direction@ecole.ci',
    address: currentSchool.address || 'Boulevard François Mitterrand',
    city: currentSchool.city || 'Abidjan',
    commune: currentSchool.commune || 'Cocody',
    currency: currentSchool.currency || 'FCFA',
    education_types: currentSchool.education_types || ['COLLEGE', 'LYCEE'],
  });

  const [drenaName, setDrenaName] = useState('DRENA Abidjan 1');
  const [directorSignatureName, setDirectorSignatureName] = useState('M. KOFFI N\'Dri Emmanuel');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getSchoolById(currentSchool.id);
      if (res.data) {
        setFormData({
          name: res.data.name,
          motto: res.data.motto || 'Discipline • Travail • Excellence',
          logo_url: res.data.logo_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150',
          phone: res.data.phone || '+225 27 22 44 55 66',
          email: res.data.email || 'contact@ecole.ci',
          address: res.data.address || 'Boulevard Principal',
          city: res.data.city || 'Abidjan',
          commune: res.data.commune || 'Cocody',
          currency: res.data.currency || 'FCFA',
          education_types: res.data.education_types || ['COLLEGE', 'LYCEE'],
        });
      }
      setLoading(false);
    }
    load();
  }, [currentSchool.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessToast(null);

    const res = await updateSchoolSettings(currentSchool.id, formData);
    setSaving(false);

    if (res.data) {
      setCurrentSchool(res.data);
      refreshSchools();
      setSuccessToast('Paramètres et personnalisation enregistrés avec succès ! Les bulletins, reçus et portails sont mis à jour.');
      setTimeout(() => setSuccessToast(null), 5000);
    }
  };

  const toggleEducationType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      education_types: prev.education_types.includes(type)
        ? prev.education_types.filter(t => t !== type)
        : [...prev.education_types, type],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            SL
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Personnalisation & Paramètres de l'Établissement</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                Identité Visuelle
              </span>
            </h1>
            <p className="text-xs text-slate-500">Logo, en-tête des bulletins officiels, devise, contacts et informations légales</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200">
            Retour Administration
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-xl text-emerald-400"></i>
              <span className="text-sm font-semibold">{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-xs text-emerald-300 font-bold">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-pen-ruler text-emerald-600"></i>
                  Informations Générales & Image de Marque
                </h2>
                <span className="text-xs text-slate-400 font-mono">Code : HORIZON-ABJ</span>
              </div>

              {/* Nom & Devise */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom Officiel de l'Établissement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Devise de l'École (apparaît sur les bulletins)
                  </label>
                  <input
                    type="text"
                    value={formData.motto}
                    onChange={e => setFormData({ ...formData, motto: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL du Logo Officiel (Image HD)
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={formData.logo_url || ''}
                    onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150' })}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-xs font-bold rounded-xl"
                  >
                    Logo Démo
                  </button>
                </div>
              </div>

              {/* Coordonnées & Ville */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Commune / Quartier</label>
                  <input
                    type="text"
                    value={formData.commune}
                    onChange={e => setFormData({ ...formData, commune: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Téléphone de l'Établissement</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Officiel</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Adresse Physique Complète</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* DRENA & Direction */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">DRENA de Rattachement</label>
                  <input
                    type="text"
                    value={drenaName}
                    onChange={e => setDrenaName(e.target.value)}
                    placeholder="Ex: DRENA Abidjan 1"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nom du Chef d'Établissement</label>
                  <input
                    type="text"
                    value={directorSignatureName}
                    onChange={e => setDirectorSignatureName(e.target.value)}
                    placeholder="Ex: M. KOFFI N'Dri Emmanuel"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Cycles d'enseignement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Cycles d'Enseignement :</label>
                <div className="flex gap-4">
                  {['PRIMAIRE', 'COLLEGE', 'LYCEE'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={formData.education_types.includes(type)}
                        onChange={() => toggleEducationType(type)}
                        className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i>
                      Enregistrer les Personnalisations
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column (Aperçu En-tête Bulletin & Reçu) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-2">
                  <i className="fa-solid fa-eye text-emerald-600"></i>
                  Aperçu En Direct de l'En-tête Officiel
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Bulletin A4
                </span>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                {/* Official State Header */}
                <div className="flex items-center justify-between text-[8px] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="text-left">
                    <p>Ministère de l'Éducation Nationale</p>
                    <p className="text-emerald-700 dark:text-emerald-400">{drenaName.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p>République de Côte d'Ivoire</p>
                    <p className="text-amber-700 dark:text-amber-400">Union • Discipline • Travail</p>
                  </div>
                </div>

                {/* School Visual Branding */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  {formData.logo_url && (
                    <img
                      src={formData.logo_url}
                      alt="Logo de l'école"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                  )}
                  <div className="text-left">
                    <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-300 uppercase leading-tight">
                      {formData.name}
                    </h4>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 italic font-semibold">
                      « {formData.motto} »
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {formData.address} • Tél: {formData.phone}
                    </p>
                  </div>
                </div>

                {/* Bulletin Title Sample */}
                <div className="p-2 rounded-xl bg-emerald-900 text-white text-xs font-black tracking-wider uppercase">
                  BULLETIN DE NOTES — 1ER TRIMESTRE
                </div>

                {/* Stamp & Signature Preview */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[9px] text-slate-500">
                  <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Chef d'Établissement</p>
                    <p className="italic mt-1 text-emerald-600 font-semibold">{directorSignatureName}</p>
                  </div>
                  <div className="border border-dashed border-emerald-500/40 rounded-xl p-2 flex items-center justify-center text-emerald-700 font-bold uppercase text-[8px]">
                    Cachet Électronique
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
                <i className="fa-solid fa-circle-info text-amber-500 mr-1.5"></i>
                Toutes les modifications saisies ici sont répercutées instantanément sur vos <strong>bulletins trimestriels</strong>, vos <strong>reçus de paiement FCFA</strong> et vos <strong>certificats de scolarité</strong>.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
