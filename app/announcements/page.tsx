'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';
import { getAnnouncements, createAnnouncement, publishAnnouncement, archiveAnnouncement } from '../../lib/services/announcements';
import type { Announcement, AnnouncementTarget } from '../../lib/supabase/types';
import { isSupabaseConfigured } from '../../lib/supabase/client';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTarget, setFilterTarget] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<AnnouncementTarget>('TOUS');
  const [targetLevel, setTargetLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schoolId = 'sch-ecolia-001';
  const profileId = 'usr-admin-001';

  const loadData = async () => {
    setLoading(true);
    const res = await getAnnouncements(schoolId);
    setAnnouncements(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (publishDirectly: boolean) => {
    if (!title.trim() || !content.trim()) {
      setActionError('Veuillez remplir le titre et le contenu du message.');
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    const res = await createAnnouncement({
      school_id: schoolId,
      title: title.trim(),
      content: content.trim(),
      target,
      target_level: target === 'NIVEAU' ? targetLevel : null,
      is_published: publishDirectly,
      published_by: publishDirectly ? profileId : null,
    });

    if (res.data) {
      if (publishDirectly) {
        await publishAnnouncement(res.data.id, profileId, schoolId);
        setActionSuccess(`Annonce "${title}" publiée et notifications transmises aux destinataires !`);
      } else {
        setActionSuccess(`Brouillon d'annonce "${title}" enregistré.`);
      }
      setTitle('');
      setContent('');
      setTarget('TOUS');
      setTargetLevel('');
      setIsCreateModalOpen(false);
      await loadData();
    } else {
      setActionError(res.error || 'Erreur lors de la création');
    }
    setIsSubmitting(false);
  };

  const handlePublish = async (id: string, annTitle: string) => {
    const res = await publishAnnouncement(id, profileId, schoolId);
    if (res.success) {
      setActionSuccess(`Annonce "${annTitle}" publiée avec succès (${res.notificationCount} notifications émises) !`);
      await loadData();
    } else {
      setActionError(res.error || 'Erreur lors de la publication');
    }
  };

  const handleArchive = async (id: string, annTitle: string) => {
    const res = await archiveAnnouncement(id);
    if (res.success) {
      setActionSuccess(`Annonce "${annTitle}" archivée.`);
      await loadData();
    } else {
      setActionError(res.error || 'Erreur lors de l\'archivage');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTarget = filterTarget === 'ALL' || a.target === filterTarget;
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PUBLISHED' && a.is_published) ||
      (filterStatus === 'DRAFT' && !a.is_published);

    return matchesSearch && matchesTarget && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <SchoolLifeLogo size="sm" withText={false} href="/admin" />
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Communication & Annonces Scolaires
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Phase 6
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Diffusion officielle aux enseignants, parents, élèves et classes de l'établissement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/notifications"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-bell text-amber-400"></i>
              Centre de Notifications
            </Link>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              Nouvelle Annonce
            </button>
          </div>
        </div>

        {/* Alerts */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-400"></i>
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-red-400"></i>
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-200">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input
              type="text"
              placeholder="Rechercher par titre ou mot-clé..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={filterTarget}
              onChange={e => setFilterTarget(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Toutes les audiences cibles</option>
              <option value="TOUS">Général (Tout l'établissement)</option>
              <option value="ENSEIGNANTS">Enseignants uniquement</option>
              <option value="PARENTS">Parents d'élèves</option>
              <option value="ELEVES">Élèves</option>
              <option value="CLASSE">Par Classe spécifique</option>
              <option value="NIVEAU">Par Niveau</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PUBLISHED">Publiées en ligne</option>
              <option value="DRAFT">Brouillons / En attente</option>
            </select>
          </div>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-3">
            <i className="fa-solid fa-spinner fa-spin text-emerald-400 text-base"></i>
            Chargement des annonces...
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <h3 className="font-bold text-white text-sm">Aucune annonce trouvée</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Aucune annonce ne correspond aux filtres actuels. Créez une nouvelle annonce pour informer la communauté scolaire.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnnouncements.map(ann => {
              const targetBadge = {
                TOUS: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', label: 'Tout l\'établissement' },
                ENSEIGNANTS: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', label: 'Enseignants' },
                PARENTS: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', label: 'Parents' },
                ELEVES: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30', label: 'Élèves' },
                CLASSE: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', label: 'Classe ciblée' },
                NIVEAU: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30', label: `Niveau ${ann.target_level || ''}` },
              }[ann.target] || { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600', label: ann.target };

              return (
                <div
                  key={ann.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${targetBadge.bg} ${targetBadge.text} ${targetBadge.border}`}>
                        <i className="fa-solid fa-bullhorn mr-1.5"></i>
                        {targetBadge.label}
                      </span>

                      {ann.is_published ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Publiée
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          Brouillon
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-extrabold text-white leading-snug">
                      {ann.title}
                    </h2>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {ann.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <i className="fa-regular fa-clock"></i>
                      <span>
                        {new Date(ann.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!ann.is_published ? (
                        <button
                          onClick={() => handlePublish(ann.id, ann.title)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-paper-plane"></i>
                          Publier & Notifier
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(ann.id, ann.title)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-box-archive"></i>
                          Archiver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Création Nouvelle Annonce */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <i className="fa-solid fa-bullhorn text-emerald-400"></i>
                  Nouvelle Annonce Scolaire
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Titre de l'annonce *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Assemblée générale des parents..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Audience Cible *
                  </label>
                  <select
                    value={target}
                    onChange={e => setTarget(e.target.value as AnnouncementTarget)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="TOUS">Tout l'établissement (Public général)</option>
                    <option value="ENSEIGNANTS">Enseignants & Personnel pédagogique</option>
                    <option value="PARENTS">Parents d'élèves</option>
                    <option value="ELEVES">Élèves</option>
                    <option value="NIVEAU">Niveau pédagogique spécifique</option>
                  </select>
                </div>

                {target === 'NIVEAU' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Niveau concerné *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 6eme, 3eme, Terminale..."
                      value={targetLevel}
                      onChange={e => setTargetLevel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Contenu du message *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Rédigez ici le communiqué officiel..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCreate(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all"
                >
                  Enregistrer Brouillon
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCreate(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  Publier Immédiatement
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
