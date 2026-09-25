'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';
import { getStudents, createStudent, archiveStudent, type StudentRow } from '../../lib/services/students';
import { isSupabaseConfigured } from '../../lib/supabase/client';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dataSource, setDataSource] = useState<'SUPABASE' | 'DEMO_STORE'>('DEMO_STORE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Nouveau formulaire élève
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'M' as 'M' | 'F',
    birth_date: '2012-05-14',
    birth_place: 'Abidjan',
    nationality: 'Ivoirienne',
    phone: '',
    address: '',
    conduct_notes: '',
  });

  const loadData = async (query = '') => {
    setLoading(true);
    const res = await getStudents({ search: query });
    if (res.data) {
      setStudents(res.data);
    }
    setDataSource(res.source);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(search);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const matricule = `ECO-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;

    const res = await createStudent({
      school_id: 'a0000000-0000-0000-0000-000000000001',
      matricule,
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      birth_date: formData.birth_date,
      birth_place: formData.birth_place,
      nationality: formData.nationality,
      phone: formData.phone || null,
      address: formData.address || null,
      photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      conduct_notes: formData.conduct_notes || null,
      medical_notes: null,
    });

    if (res.data) {
      setIsModalOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        gender: 'M',
        birth_date: '2012-05-14',
        birth_place: 'Abidjan',
        nationality: 'Ivoirienne',
        phone: '',
        address: '',
        conduct_notes: '',
      });
      loadData(search);
    }
    setCreating(false);
  };

  const handleArchive = async (id: string, name: string) => {
    if (confirm(`Confirmez-vous l'archivage de l'élève ${name} ?`)) {
      await archiveStudent(id);
      loadData(search);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SchoolLifeLogo size="sm" withText={false} href="/" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Gestion des Élèves</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                Registre Officiel
              </span>
            </h1>
            <p className="text-xs text-slate-500">Groupe Scolaire Horizon — Année Scolaire 2026-2027</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/students/import"
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all border border-slate-300 dark:border-slate-600"
          >
            <i className="fa-solid fa-file-excel text-emerald-600"></i>
            Import Excel / CSV
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <i className="fa-solid fa-user-plus"></i>
            Inscrire un Élève
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-1">
        {/* Filters and Search Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-wrap gap-3 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 min-w-[280px] relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, prénom ou matricule..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </form>

          <div className="text-xs text-slate-500 font-semibold">
            {students.length} élève{students.length > 1 ? 's' : ''} répertorié{students.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <i className="fa-solid fa-spinner animate-spin text-3xl text-emerald-500"></i>
              <p className="text-sm font-medium">Chargement des élèves depuis la base de données...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <i className="fa-solid fa-user-slash text-4xl text-slate-300 dark:text-slate-600"></i>
              <p className="text-base font-bold text-slate-700 dark:text-slate-200">Aucun élève trouvé</p>
              <p className="text-xs">Ajustez vos filtres ou inscrivez un nouvel élève.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Élève</th>
                    <th className="px-6 py-4">Matricule</th>
                    <th className="px-6 py-4">Sexe / Âge</th>
                    <th className="px-6 py-4">Lieu de Naissance</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                            alt={student.first_name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {student.last_name.toUpperCase()} {student.first_name}
                            </span>
                            <span className="text-xs text-slate-400">{student.nationality}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {student.matricule}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                          student.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {student.gender === 'M' ? 'Masculin' : 'Féminin'}
                        </span>
                        <span className="ml-2 text-slate-400">Né(e) le {student.birth_date}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                        {student.birth_place || 'Abidjan'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleArchive(student.id, `${student.first_name} ${student.last_name}`)}
                            title="Archiver"
                            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/40 text-slate-500 transition-colors flex items-center justify-center text-xs"
                          >
                            <i className="fa-solid fa-box-archive"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Inscription */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Inscription d'un Nouvel Élève</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Ex: KOUAME"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Prénoms *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Ex: Jean-Eudes"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Genre *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-medium"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Date de Naissance *</label>
                  <input
                    type="date"
                    required
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Lieu de Naissance</label>
                  <input
                    type="text"
                    value={formData.birth_place}
                    onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                    placeholder="Ex: Abidjan"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Téléphone Tuteur</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: +225 07 08 09 10"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  {creating && <i className="fa-solid fa-spinner animate-spin"></i>}
                  Confirmer l'Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
