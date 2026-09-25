'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSchoolsList, createAndBootstrapSchool, type SchoolRow, type NewSchoolPayload } from '../../../lib/services/schools';

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<NewSchoolPayload>({
    name: '',
    code: '',
    motto: 'Discipline • Travail • Excellence',
    city: 'Abidjan',
    commune: 'Cocody',
    address: '',
    phone: '+225 ',
    email: '',
    education_types: ['COLLEGE', 'LYCEE'],
  });

  const loadSchools = async () => {
    setLoading(true);
    const res = await getSchoolsList();
    setSchools(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);

    const res = await createAndBootstrapSchool(formData);
    setSubmitting(false);

    if (res.data) {
      setSuccessMessage(`L'établissement « ${res.data.name} » a été créé et initialisé avec succès (Année 2026-2027, 3 trimestres, classes de la 6e à la Terminale) !`);
      setIsModalOpen(false);
      setFormData({
        name: '',
        code: '',
        motto: 'Discipline • Travail • Excellence',
        city: 'Abidjan',
        commune: 'Cocody',
        address: '',
        phone: '+225 ',
        email: '',
        education_types: ['COLLEGE', 'LYCEE'],
      });
      loadSchools();
    }
  };

  const toggleEducationType = (type: string) => {
    setFormData(prev => {
      const exists = prev.education_types.includes(type);
      return {
        ...prev,
        education_types: exists
          ? prev.education_types.filter(t => t !== type)
          : [...prev.education_types, type],
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-850 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-950">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Super Administration ÉCOLIA</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Multi-Établissements
              </span>
            </h1>
            <p className="text-xs text-slate-400">Gestion des écoles partenaires & Onboarding SaaS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <i className="fa-solid fa-plus-circle"></i>
            Ajouter un Établissement
          </button>

          <Link href="/" className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300">
            Retour Accueil
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-xl text-emerald-400"></i>
              <span className="text-sm font-semibold">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-xs text-emerald-300 hover:text-white font-bold">
              Fermer
            </button>
          </div>
        )}

        {/* Header Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Écoles Partenaires Actives</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-white font-mono">{schools.length}</span>
              <span className="text-xs text-emerald-400 font-bold">Établissements connectés</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Zone Géographique</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">Côte d'Ivoire</span>
              <span className="text-xs text-slate-400">Abidjan & Intérieur</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Sécurité des Données</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-400">Isolation RLS Active</span>
              <span className="text-xs text-slate-400">100% étanche</span>
            </div>
          </div>
        </div>

        {/* List of Schools */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-school text-emerald-400"></i>
              Liste des Établissements Partenaires
            </h2>
            <span className="text-xs text-slate-400">{schools.length} établissement(s) répertorié(s)</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Chargement des établissements...</div>
          ) : schools.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-3xl border border-slate-700">
              <p className="text-slate-400 mb-4">Aucun établissement enregistré pour le moment.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl"
              >
                Créer le premier établissement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schools.map(school => (
                <div key={school.id} className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xl">
                          {school.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{school.name}</h3>
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/20">
                            {school.code}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Actif
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 italic mt-3">« {school.motto} »</p>

                    <div className="mt-4 pt-4 border-t border-slate-700/80 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-location-dot text-slate-500 w-4"></i>
                        <span>{school.commune ? `${school.commune}, ${school.city}` : school.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-phone text-slate-500 w-4"></i>
                        <span>{school.phone || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-envelope text-slate-500 w-4"></i>
                        <span>{school.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Cycles :</span>
                        <div className="flex gap-1.5">
                          {school.education_types?.map(type => (
                            <span key={type} className="px-2 py-0.5 rounded bg-slate-700 text-[10px] font-bold text-slate-300">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700 flex items-center gap-3">
                    <Link
                      href="/admin"
                      className="flex-1 text-center py-2.5 bg-slate-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Ouvrir l'Espace École →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Onboarding Nouvel Établissement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-850 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-plus-circle text-emerald-400"></i>
                  Inscrire un Nouvel Établissement
                </h3>
                <p className="text-xs text-slate-400">Génération automatique de l'espace scolaire et des classes</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nom Officiel de l'École *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lycée Moderne Saint-Jean"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Code École *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: LMSJ-ABJ"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-amber-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Devise de l'Établissement</label>
                <input
                  type="text"
                  placeholder="Ex: Travail • Rigueur • Réussite"
                  value={formData.motto}
                  onChange={e => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ville *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Abidjan, Bouaké, Yamoussoukro..."
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Commune / Quartier *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cocody, Yopougon, Marcory..."
                    value={formData.commune}
                    onChange={e => setFormData({ ...formData, commune: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Téléphone de la Direction *</label>
                  <input
                    type="text"
                    required
                    placeholder="+225 27 22 ..."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email de Contact *</label>
                  <input
                    type="email"
                    required
                    placeholder="direction@ecole.ci"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Cycles d'Enseignement :</label>
                <div className="flex gap-4">
                  {['COLLEGE', 'LYCEE', 'PRIMAIRE'].map(type => (
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

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                <i className="fa-solid fa-wand-magic-sparkles text-emerald-400 mt-0.5"></i>
                <span>
                  <strong>Automatisation ÉCOLIA :</strong> La validation créera automatiquement l'année 2026-2027, les 3 trimestres, et les classes de la 6ème à la Terminale.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      Créer & Initialiser l'École
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
