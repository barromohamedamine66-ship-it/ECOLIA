'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';

interface TeacherItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  classes: string[];
  accessCode: string;
  isHeadTeacher?: string; // Classe dont il est professeur principal
  status: 'ACTIVE' | 'PENDING';
}

export default function TeachersManagementPage() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([
    {
      id: 'tea-001',
      name: 'M. KOFFI Yao Simplice',
      phone: '+2250708123456',
      email: 'koffi.yao@horizon.ci',
      subject: 'Mathématiques',
      classes: ['6e A', '3e A', 'Terminale C', 'Terminale D'],
      accessCode: 'PROF-MATH-7721',
      isHeadTeacher: '3e A',
      status: 'ACTIVE',
    },
    {
      id: 'tea-002',
      name: 'Mme KONE Fatou',
      phone: '+2250544221100',
      email: 'kone.fatou@horizon.ci',
      subject: 'Français & Expression',
      classes: ['6e A', '6e B', '4e A', '3e A'],
      accessCode: 'PROF-FR-8834',
      isHeadTeacher: '6e A',
      status: 'ACTIVE',
    },
    {
      id: 'tea-003',
      name: 'M. COULIBALY Dramane',
      phone: '+2250102030405',
      email: 'd.coulibaly@horizon.ci',
      subject: 'Physique - Chimie',
      classes: ['4e A', '3e A', '2nde C', 'Terminale D'],
      accessCode: 'PROF-SP-9912',
      status: 'ACTIVE',
    },
    {
      id: 'tea-004',
      name: 'Mlle DIALLO Mariam',
      phone: '+2250777889900',
      email: 'm.diallo@horizon.ci',
      subject: 'Anglais (LV1)',
      classes: ['6e A', '5e A', '3e A', 'Terminale A'],
      accessCode: 'PROF-ANG-4451',
      status: 'ACTIVE',
    },
    {
      id: 'tea-005',
      name: 'M. N\'GUESSAN Kouadio',
      phone: '+2250599887766',
      email: 'k.nguessan@horizon.ci',
      subject: 'Philosophie',
      classes: ['Terminale A', 'Terminale D'],
      accessCode: 'PROF-PHILO-1120',
      status: 'ACTIVE',
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '+225 ',
    email: '',
    subject: 'Mathématiques',
    classes: ['6e A'],
    isHeadTeacher: '',
  });

  const availableSubjects = [
    'Mathématiques',
    'Français & Expression',
    'Physique - Chimie',
    'Sciences de la Vie et de la Terre (SVT)',
    'Histoire - Géographie',
    'Anglais (LV1)',
    'Philosophie',
    'Éducation Physique & Sportive (EPS)',
    'Allemand / Espagnol',
  ];

  const availableClasses = ['6e A', '6e B', '5e A', '4e A', '3e A', '2nde A', '2nde C', '1ère D', 'Terminale D', 'Terminale A'];

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `PROF-${formData.subject.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTeacher: TeacherItem = {
      id: `tea-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject,
      classes: formData.classes,
      accessCode: newCode,
      isHeadTeacher: formData.isHeadTeacher || undefined,
      status: 'ACTIVE',
    };

    setTeachers([newTeacher, ...teachers]);
    setIsModalOpen(false);
    setToastMessage(`L'enseignant « ${formData.name} » a été ajouté avec le code ${newCode} !`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleClassSelection = (cls: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter(c => c !== cls)
        : [...prev.classes, cls],
    }));
  };

  const generateTeacherWhatsAppInvite = (teacher: TeacherItem) => {
    const text = `Bonjour ${teacher.name},\nVoici vos accès officiels à la plateforme SCHOOLLIFE du Groupe Scolaire Horizon :\n\n👉 Espace Enseignant : https://schoollife.africa/teacher\n🔑 Votre Code d'Accès : ${teacher.accessCode}\n📚 Matière : ${teacher.subject}\n👥 Vos Classes : ${teacher.classes.join(', ')}\n\nVous pouvez dès maintenant saisir vos notes et faire l'appel des présences depuis votre smartphone. Bonne rentrée !`;
    const cleanPhone = teacher.phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLifeLogo size="sm" withText={false} href="/" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Gestion du Corps Enseignant</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                {teachers.length} Professeurs
              </span>
            </h1>
            <p className="text-xs text-slate-500">Affectations des matières, classes et distribution des codes d'accès</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <i className="fa-solid fa-user-plus"></i>
            Ajouter un Enseignant
          </button>
          <Link href="/admin" className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200">
            Retour Administration
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-xl text-emerald-400"></i>
              <span className="text-sm font-semibold">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-xs text-emerald-300 font-bold">✕</button>
          </div>
        )}

        {/* Informational Workflow Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-850 text-white border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-key text-amber-400"></i>
              Comment fonctionne l'accès d'un enseignant sur ÉCOLIA ?
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              1. Enregistrez le professeur avec sa matière et ses classes.<br />
              2. Transmettez-lui son <strong>Code d'accès unique</strong> en 1 clic par WhatsApp ou fiche imprimée.<br />
              3. Le professeur se connecte depuis son téléphone pour saisir ses notes et faire l'appel sans voir la comptabilité.
            </p>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-chalkboard-user text-emerald-600"></i>
              Liste des Enseignants & Codes d'Accès ({teachers.length})
            </h3>
            <span className="text-xs text-slate-500">Année Académique 2026-2027</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-750 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Enseignant</th>
                  <th className="p-4">Matière Principale</th>
                  <th className="p-4">Classes Affectées</th>
                  <th className="p-4">Prof. Principal</th>
                  <th className="p-4 font-mono text-emerald-800 dark:text-emerald-300">Code d'Accès</th>
                  <th className="p-4 text-center">Transmission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {teachers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                      <span className="text-[11px] text-slate-400 font-mono">{t.phone} • {t.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold">
                        {t.subject}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {t.classes.map(c => (
                          <span key={c} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[10px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      {t.isHeadTeacher ? (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                          ⭐ {t.isHeadTeacher}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                      {t.accessCode}
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={generateTeacherWhatsAppInvite(t)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-[11px] shadow-sm transition-all"
                        title="Envoyer les accès par WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp text-sm"></i>
                        Envoyer Accès
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Ajout Enseignant */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-user-plus text-emerald-600"></i>
                  Enregistrer un Nouvel Enseignant
                </h3>
                <p className="text-xs text-slate-500">Génération immédiate de ses droits et de son code d'accès</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nom Complet & Titre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: M. OUATTARA Lassina"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Numéro WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+225 07 ..."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Matière Enseignée *</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    {availableSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Classes Affectées :</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableClasses.map(cls => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => toggleClassSelection(cls)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                        formData.classes.includes(cls)
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Enregistrer & Générer le Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
