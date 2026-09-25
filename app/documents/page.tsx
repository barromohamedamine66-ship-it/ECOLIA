'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SchoolLifeLogo from '../../components/SchoolLifeLogo';
import {
  getDocuments,
  uploadDocument,
  archiveDocument,
  restoreDocument,
  deleteDocument,
  getDocumentDownloadUrl,
  getDocumentStats,
  formatFileSize,
  type DocumentStats,
} from '../../lib/services/documents';
import type { DocumentItem, DocumentCategory } from '../../lib/supabase/types';
import { isSupabaseConfigured } from '../../lib/supabase/client';

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('STUDENT');
  const [docType, setDocType] = useState('EXTRAIT_NAISSANCE');
  const [entityType, setEntityType] = useState('student');
  const [entityId, setEntityId] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const schoolId = 'sch-ecolia-001';
  const profileId = 'usr-admin-001';

  const loadData = async () => {
    setLoading(true);
    const [docsRes, statsRes] = await Promise.all([
      getDocuments(schoolId, {
        category: selectedCategory,
        isArchived: showArchived,
        searchQuery: searchQuery.trim() || undefined,
      }),
      getDocumentStats(schoolId),
    ]);

    setDocuments(docsRes.data);
    setStats(statsRes.stats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, showArchived]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatusMessage({ type: 'error', text: 'Veuillez sélectionner un fichier à téléverser.' });
      return;
    }
    if (!docName.trim()) {
      setStatusMessage({ type: 'error', text: 'Veuillez renseigner le nom du document.' });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    const res = await uploadDocument(schoolId, profileId, file, {
      name: docName.trim(),
      documentCategory: docCategory,
      documentType: docType,
      entityType: entityType || undefined,
      entityId: entityId.trim() || undefined,
      description: description.trim() || undefined,
    });

    if (res.data) {
      setStatusMessage({
        type: 'success',
        text: `Document "${docName}" téléversé avec succès dans le coffre-fort (${formatFileSize(file.size)}).`,
      });
      setFile(null);
      setDocName('');
      setDescription('');
      setEntityId('');
      setIsUploadModalOpen(false);
      await loadData();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Erreur lors du téléversement.' });
    }

    setIsUploading(false);
  };

  const handleDownload = async (filePath: string, name: string) => {
    const res = await getDocumentDownloadUrl(filePath);
    if (res.signedUrl) {
      if (res.signedUrl.startsWith('#')) {
        alert(`Mode Démonstration : Simulation de consultation du document "${name}" (${filePath})`);
      } else {
        window.open(res.signedUrl, '_blank');
      }
    } else {
      alert(`Erreur d'accès : ${res.error || 'Impossible de générer le lien de téléchargement sécurisé.'}`);
    }
  };

  const handleArchiveToggle = async (doc: DocumentItem) => {
    if (doc.is_archived) {
      await restoreDocument(doc.id);
      setStatusMessage({ type: 'success', text: `Document "${doc.name}" restauré.` });
    } else {
      await archiveDocument(doc.id, profileId);
      setStatusMessage({ type: 'success', text: `Document "${doc.name}" archivé.` });
    }
    await loadData();
  };

  const handleDelete = async (doc: DocumentItem) => {
    if (confirm(`Confirmez-vous la suppression définitive du document "${doc.name}" ? Cette action sera tracée dans le journal d'audit.`)) {
      const res = await deleteDocument(doc.id, profileId);
      if (res.success) {
        setStatusMessage({ type: 'success', text: `Document "${doc.name}" supprimé définitivement.` });
        await loadData();
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Erreur suppression.' });
      }
    }
  };

  const getCategoryBadge = (cat: DocumentCategory) => {
    switch (cat) {
      case 'STUDENT':
        return { label: 'Élève', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'PARENT':
        return { label: 'Parent', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'TEACHER':
        return { label: 'Enseignant', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'SCHOOL':
        return { label: 'Établissement', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'ACADEMIC':
        return { label: 'Pédagogie', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'FINANCE':
        return { label: 'Finance & Reçu', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      default:
        return { label: 'Autre', bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
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
                  Coffre-fort Documentaire SCHOOLLIFE
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                  Storage Privé RLS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestion sécurisée, classement et archivage des pièces d'élèves, enseignants, reçus et administratifs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-2"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              Nouveau Document
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between animate-fadeIn ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/80 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <i className={`fa-solid ${statusMessage.type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-red-400'}`}></i>
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* Real KPI Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Documents</span>
              <span className="text-2xl font-black text-white block font-mono">{stats.totalDocuments}</span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <i className="fa-solid fa-folder-tree"></i>
                {stats.activeDocuments} actifs
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Espace Utilisé</span>
              <span className="text-2xl font-black text-emerald-400 block font-mono">{stats.totalSizeFormatted}</span>
              <span className="text-[11px] text-slate-400">Quota SaaS : 50 Go</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dossiers Élèves</span>
              <span className="text-2xl font-black text-blue-400 block font-mono">{stats.countByCategory.STUDENT}</span>
              <span className="text-[11px] text-slate-400">Extraits, certificats, photos</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Archives Sécurisées</span>
              <span className="text-2xl font-black text-amber-400 block font-mono">{stats.archivedDocuments}</span>
              <span className="text-[11px] text-slate-400">Historique conservé</span>
            </div>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
              <input
                type="text"
                placeholder="Rechercher par nom, type ou mot-clé..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </form>

            <div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as DocumentCategory | 'ALL')}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Toutes les catégories</option>
                <option value="STUDENT">Dossiers Élèves</option>
                <option value="PARENT">Pièces Parents</option>
                <option value="TEACHER">Ressources Enseignants</option>
                <option value="SCHOOL">Administration Établissement</option>
                <option value="ACADEMIC">Pédagogie & Bulletins</option>
                <option value="FINANCE">Finances & Justificatifs</option>
                <option value="OTHER">Autres documents</option>
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 px-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={e => setShowArchived(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Afficher les archives</span>
              </label>
            </div>
          </div>
        </div>

        {/* Documents Table View */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-3">
            <i className="fa-solid fa-spinner fa-spin text-emerald-400 text-base"></i>
            Chargement des documents du coffre-fort...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <h3 className="font-bold text-white text-sm">Aucun document trouvé</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Aucune pièce ne correspond aux filtres actuels. Téléversez un document pour alimenter le coffre-fort.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-800/80 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Document</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Taille</th>
                  <th className="p-4">Date Ajout</th>
                  <th className="p-4 text-right">Actions Sécurisées</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.map(doc => {
                  const badge = getCategoryBadge(doc.document_category);
                  const isPdf = doc.mime_type === 'application/pdf';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-sm shrink-0">
                            <i className={`fa-solid ${isPdf ? 'fa-file-pdf text-red-400' : 'fa-file-lines text-blue-400'}`}></i>
                          </div>
                          <div>
                            <span className="font-bold text-white block">{doc.name}</span>
                            {doc.description && (
                              <span className="text-[11px] text-slate-400 line-clamp-1">{doc.description}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-slate-300">
                        {doc.document_type}
                      </td>

                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {formatFileSize(doc.file_size)}
                      </td>

                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(doc.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(doc.file_path, doc.name)}
                            title="Ouvrir via URL signée sécurisée"
                            className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all text-xs"
                          >
                            <i className="fa-solid fa-arrow-down"></i>
                          </button>

                          <button
                            onClick={() => handleArchiveToggle(doc)}
                            title={doc.is_archived ? 'Désarchiver' : 'Archiver'}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-all text-xs"
                          >
                            <i className={`fa-solid ${doc.is_archived ? 'fa-box-open' : 'fa-box-archive'}`}></i>
                          </button>

                          <button
                            onClick={() => handleDelete(doc)}
                            title="Supprimer définitivement"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-500 hover:text-red-400 transition-all text-xs"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <i className="fa-solid fa-cloud-arrow-up text-emerald-400"></i>
                  Téléverser un Nouveau Document
                </h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Sélectionner le Fichier (Max 10 Mo) *
                  </label>
                  <input
                    type="file"
                    onChange={e => {
                      const f = e.target.files?.[0] || null;
                      setFile(f);
                      if (f && !docName) {
                        setDocName(f.name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
                  />
                  {file && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Taille : {formatFileSize(file.size)} • Type : {file.type || 'Inconnu'}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nom du Document *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Extrait d'acte de naissance..."
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={docCategory}
                      onChange={e => {
                        const cat = e.target.value as DocumentCategory;
                        setDocCategory(cat);
                        if (cat === 'STUDENT') {
                          setEntityType('student');
                          setDocType('EXTRAIT_NAISSANCE');
                        } else if (cat === 'TEACHER') {
                          setEntityType('teacher');
                          setDocType('DIPLOME');
                        } else if (cat === 'FINANCE') {
                          setEntityType('payment');
                          setDocType('RECU_PAIEMENT');
                        } else if (cat === 'SCHOOL') {
                          setEntityType('school');
                          setDocType('REGLEMENT_INTERIEUR');
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="STUDENT">Dossier Élève</option>
                      <option value="PARENT">Dossier Parent</option>
                      <option value="TEACHER">Enseignant / RH</option>
                      <option value="SCHOOL">Établissement</option>
                      <option value="ACADEMIC">Pédagogie</option>
                      <option value="FINANCE">Finance</option>
                      <option value="OTHER">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Type Documentaire *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: EXTRAIT_NAISSANCE"
                      value={docType}
                      onChange={e => setDocType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    ID Entité Associée (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: stu-2026-001 (Identifiant élève ou enseignant)"
                    value={entityId}
                    onChange={e => setEntityId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Description & Précisions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Notes relatives au document..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Téléversement...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-lock"></i>
                        Stocker en Coffre-fort
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
