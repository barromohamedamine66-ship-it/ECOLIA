/**
 * ÉCOLIA SaaS - Service Documents & Coffre-fort Documentaire
 * Gestion sécurisée du stockage (Supabase Storage privé), métadonnées, URLs signées et traçabilité d'audit
 */

import { supabase, isSupabaseConfigured, isProductionEnv } from '../supabase/client';
import type { DocumentItem, DocumentInsert, DocumentUpdate, DocumentCategory } from '../supabase/types';

export const STORAGE_BUCKET = 'ecolia-documents';
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo


export const ALLOWED_MIME_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
};

export interface DocumentStats {
  totalDocuments: number;
  activeDocuments: number;
  archivedDocuments: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  countByCategory: Record<DocumentCategory, number>;
}

// Données de secours / mode démo hors-ligne
let localDocuments: DocumentItem[] = [
  {
    id: 'doc-2026-001',
    school_id: 'sch-ecolia-001',
    uploaded_by: 'usr-admin-001',
    name: 'Extrait d\'acte de naissance - TRAORÉ Mohamed',
    file_path: 'school/sch-ecolia-001/student/stu-2026-001/doc-2026-001-acte-naissance.pdf',
    storage_bucket: STORAGE_BUCKET,
    mime_type: 'application/pdf',
    file_size: 1420500, // 1.42 Mo
    document_category: 'STUDENT',
    document_type: 'EXTRAIT_NAISSANCE',
    entity_type: 'student',
    entity_id: 'stu-2026-001',
    description: 'Extrait certifié conforme délivré par la mairie de Cocody.',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'doc-2026-002',
    school_id: 'sch-ecolia-001',
    uploaded_by: 'usr-admin-001',
    name: 'Certificat médical d\'aptitude physique - KOUASSI Ange',
    file_path: 'school/sch-ecolia-001/student/stu-2026-004/doc-2026-002-certif-medical.pdf',
    storage_bucket: STORAGE_BUCKET,
    mime_type: 'application/pdf',
    file_size: 890300, // 890 Ko
    document_category: 'STUDENT',
    document_type: 'CERTIFICAT_MEDICAL',
    entity_type: 'student',
    entity_id: 'stu-2026-004',
    description: 'Aptitude aux épreuves d\'EPS.',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'doc-2026-003',
    school_id: 'sch-ecolia-001',
    uploaded_by: 'usr-admin-001',
    name: 'Règlement Intérieur Établissement 2026-2027',
    file_path: 'school/sch-ecolia-001/school/general/doc-2026-003-reglement-interieur.pdf',
    storage_bucket: STORAGE_BUCKET,
    mime_type: 'application/pdf',
    file_size: 3250000, // 3.25 Mo
    document_category: 'SCHOOL',
    document_type: 'REGLEMENT_INTERIEUR',
    entity_type: 'school',
    entity_id: 'sch-ecolia-001',
    description: 'Statuts, discipline et charte de bonne conduite.',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'doc-2026-004',
    school_id: 'sch-ecolia-001',
    uploaded_by: 'usr-tea-01',
    name: 'Diplôme CAPES Mathématiques - M. KOFFI Yao',
    file_path: 'school/sch-ecolia-001/teacher/usr-tea-01/doc-2026-004-diplome-capes.pdf',
    storage_bucket: STORAGE_BUCKET,
    mime_type: 'application/pdf',
    file_size: 2100400, // 2.1 Mo
    document_category: 'TEACHER',
    document_type: 'DIPLOME',
    entity_type: 'teacher',
    entity_id: 'usr-tea-01',
    description: 'Copie certifiée conforme du diplôme d\'enseignement secondaire.',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: 'doc-2026-005',
    school_id: 'sch-ecolia-001',
    uploaded_by: 'usr-admin-001',
    name: 'Attestation de Paiement Frais Inscription - #REC-2026-00042',
    file_path: 'school/sch-ecolia-001/finance/stu-2026-001/doc-2026-005-recu-42.pdf',
    storage_bucket: STORAGE_BUCKET,
    mime_type: 'application/pdf',
    file_size: 450100, // 450 Ko
    document_category: 'FINANCE',
    document_type: 'RECU_PAIEMENT',
    entity_type: 'student',
    entity_id: 'stu-2026-001',
    description: 'Reçu officiel de caisse 150 000 FCFA.',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Ko';
  const k = 1024;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Valide les contraintes de sécurité sur le fichier
 */
export function validateFileConstraints(file: { size: number; type: string; name: string }): {
  isValid: boolean;
  error: string | null;
} {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Taille maximale dépassée (${formatFileSize(file.size)}). La limite est de 10 Mo par document.`,
    };
  }

  const isMimeAllowed = Object.keys(ALLOWED_MIME_TYPES).includes(file.type);
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'webp'];

  if (!isMimeAllowed || (ext && !allowedExts.includes(ext))) {
    return {
      isValid: false,
      error: `Format de fichier non autorisé (${file.type || ext}). Formats acceptés : PDF, Word, Excel, JPG, PNG, WEBP.`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Récupère la liste des documents avec filtres et recherche
 */
export async function getDocuments(
  schoolId: string,
  options?: {
    category?: DocumentCategory | 'ALL';
    entityType?: string;
    entityId?: string;
    isArchived?: boolean;
    searchQuery?: string;
  }
): Promise<{ data: DocumentItem[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { data: [], error: 'CRITICAL: Supabase non configuré en environnement de production.', source: 'SUPABASE' };
  }

  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (options?.isArchived !== undefined) {
        query = query.eq('is_archived', options.isArchived);
      }

      if (options?.category && options.category !== 'ALL') {
        query = query.eq('document_category', options.category);
      }

      if (options?.entityType) {
        query = query.eq('entity_type', options.entityType);
      }

      if (options?.entityId) {
        query = query.eq('entity_id', options.entityId);
      }

      const { data, error } = await query;
      if (error) return { data: [], error: error.message, source: 'SUPABASE' };

      let list = data || [];
      if (options?.searchQuery && options.searchQuery.trim()) {
        const q = options.searchQuery.toLowerCase();
        list = list.filter(
          d =>
            d.name.toLowerCase().includes(q) ||
            (d.description && d.description.toLowerCase().includes(q)) ||
            d.document_type.toLowerCase().includes(q)
        );
      }

      return { data: list, error: null, source: 'SUPABASE' };
    } catch (err: any) {
      console.error('Erreur getDocuments Supabase:', err);
    }
  }

  // Filtrage mode démo
  let filtered = localDocuments.filter(d => d.school_id === schoolId);

  if (options?.isArchived !== undefined) {
    filtered = filtered.filter(d => d.is_archived === options.isArchived);
  }

  if (options?.category && options.category !== 'ALL') {
    filtered = filtered.filter(d => d.document_category === options.category);
  }

  if (options?.entityType) {
    filtered = filtered.filter(d => d.entity_type === options.entityType);
  }

  if (options?.entityId) {
    filtered = filtered.filter(d => d.entity_id === options.entityId);
  }

  if (options?.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.toLowerCase();
    filtered = filtered.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        d.document_type.toLowerCase().includes(q)
    );
  }

  return { data: filtered, error: null, source: 'DEMO_STORE' };
}

/**
 * Récupère un document unique par son identifiant
 */
export async function getDocumentById(
  id: string
): Promise<{ data: DocumentItem | null; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) return { data: null, error: error.message, source: 'SUPABASE' };
      return { data, error: null, source: 'SUPABASE' };
    } catch (err: any) {
      return { data: null, error: err.message, source: 'SUPABASE' };
    }
  }

  const doc = localDocuments.find(d => d.id === id) || null;
  return { data: doc, error: null, source: 'DEMO_STORE' };
}

/**
 * Génère une URL signée sécurisée et temporaire (défaut : 5 minutes)
 */
export async function getDocumentDownloadUrl(
  filePath: string,
  expiresInSeconds = 300
): Promise<{ signedUrl: string | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, expiresInSeconds);

      if (error) return { signedUrl: null, error: error.message };
      return { signedUrl: data?.signedUrl || null, error: null };
    } catch (err: any) {
      return { signedUrl: null, error: err.message || 'Erreur génération URL signée' };
    }
  }

  // Simulation mode démo : génère une fausse URL sécurisée pour prévisualisation locale
  return {
    signedUrl: `#preview-${encodeURIComponent(filePath)}`,
    error: null,
  };
}

/**
 * Téléverse un document dans Supabase Storage privé et enregistre les métadonnées
 */
export async function uploadDocument(
  schoolId: string,
  uploadedByProfileId: string,
  file: File,
  metadata: {
    name: string;
    documentCategory: DocumentCategory;
    documentType: string;
    entityType?: string;
    entityId?: string;
    description?: string;
  }
): Promise<{ data: DocumentItem | null; error: string | null }> {
  // 1. Validation de sécurité des fichiers
  const validation = validateFileConstraints(file);
  if (!validation.isValid) {
    return { data: null, error: validation.error };
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const cleanBaseName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 40);
  const docId = 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  
  // Chemin structuré et multi-tenant dans le bucket privé
  const categoryFolder = metadata.documentCategory.toLowerCase();
  const entityFolder = metadata.entityId ? `${metadata.entityId}` : 'general';
  const storageFilePath = `school/${schoolId}/${categoryFolder}/${entityFolder}/${docId}_${cleanBaseName}`;

  if (isSupabaseConfigured()) {
    try {
      // 2. Upload binaire vers Supabase Storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storageFilePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (storageError) {
        return { data: null, error: `Erreur stockage Storage: ${storageError.message}` };
      }

      // 3. Insertion métadonnées en base de données
      const insertPayload: DocumentInsert = {
        id: docId,
        school_id: schoolId,
        uploaded_by: uploadedByProfileId,
        name: metadata.name.trim(),
        file_path: storageFilePath,
        storage_bucket: STORAGE_BUCKET,
        mime_type: file.type,
        file_size: file.size,
        document_category: metadata.documentCategory,
        document_type: metadata.documentType,
        entity_type: metadata.entityType || null,
        entity_id: metadata.entityId || null,
        description: metadata.description?.trim() || null,
        is_archived: false,
      };

      const { data, error: dbError } = await supabase
        .from('documents')
        .insert([insertPayload])
        .select()
        .single();

      if (dbError) {
        // Nettoyage Storage en cas d'échec SQL
        await supabase.storage.from(STORAGE_BUCKET).remove([storageFilePath]);
        return { data: null, error: `Erreur enregistrement métadonnées: ${dbError.message}` };
      }

      // 4. Audit Log
      await supabase.from('audit_logs').insert([{
        school_id: schoolId,
        user_id: uploadedByProfileId,
        action: 'UPLOAD_DOCUMENT',
        entity_type: 'document',
        entity_id: data.id,
        details: {
          name: metadata.name,
          category: metadata.documentCategory,
          type: metadata.documentType,
          file_size: file.size,
        },
      }]);

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Erreur lors du téléversement' };
    }
  }

  // Mode Démo / Hors-ligne
  const newDoc: DocumentItem = {
    id: docId,
    school_id: schoolId,
    uploaded_by: uploadedByProfileId,
    name: metadata.name.trim(),
    file_path: storageFilePath,
    storage_bucket: STORAGE_BUCKET,
    mime_type: file.type || 'application/pdf',
    file_size: file.size,
    document_category: metadata.documentCategory,
    document_type: metadata.documentType,
    entity_type: metadata.entityType || null,
    entity_id: metadata.entityId || null,
    description: metadata.description?.trim() || null,
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localDocuments.unshift(newDoc);
  return { data: newDoc, error: null };
}

/**
 * Archive un document
 */
export async function archiveDocument(
  id: string,
  archivedByProfileId: string
): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          is_archived: true,
          archived_at: new Date().toISOString(),
          archived_by: archivedByProfileId,
        })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const doc = localDocuments.find(d => d.id === id);
  if (doc) {
    doc.is_archived = true;
    doc.archived_at = new Date().toISOString();
    doc.archived_by = archivedByProfileId;
    return { success: true, error: null };
  }
  return { success: false, error: 'Document introuvable' };
}

/**
 * Restaure un document archivé
 */
export async function restoreDocument(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          is_archived: false,
          archived_at: null,
          archived_by: null,
        })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const doc = localDocuments.find(d => d.id === id);
  if (doc) {
    doc.is_archived = false;
    doc.archived_at = null;
    doc.archived_by = null;
    return { success: true, error: null };
  }
  return { success: false, error: 'Document introuvable' };
}

/**
 * Suppression définitive avec audit (strictement réservé aux administrateurs)
 */
export async function deleteDocument(
  id: string,
  deletedByProfileId: string
): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      // 1. Récupération du document pour obtenir le file_path
      const { data: doc } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (!doc) return { success: false, error: 'Document non trouvé' };

      // 2. Suppression dans Storage
      await supabase.storage.from(STORAGE_BUCKET).remove([doc.file_path]);

      // 3. Suppression dans PostgreSQL
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) return { success: false, error: error.message };

      // 4. Audit Log
      await supabase.from('audit_logs').insert([{
        school_id: doc.school_id,
        user_id: deletedByProfileId,
        action: 'DELETE_DOCUMENT',
        entity_type: 'document',
        entity_id: id,
        details: { name: doc.name, file_path: doc.file_path },
      }]);

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const idx = localDocuments.findIndex(d => d.id === id);
  if (idx !== -1) {
    localDocuments.splice(idx, 1);
    return { success: true, error: null };
  }
  return { success: false, error: 'Document non trouvé' };
}

/**
 * Calcule les statistiques réelles du coffre-fort documentaire
 */
export async function getDocumentStats(
  schoolId: string
): Promise<{ stats: DocumentStats; error: string | null }> {
  const { data: docs, error } = await getDocuments(schoolId);
  if (error) {
    return {
      stats: {
        totalDocuments: 0,
        activeDocuments: 0,
        archivedDocuments: 0,
        totalSizeBytes: 0,
        totalSizeFormatted: '0 Ko',
        countByCategory: {
          STUDENT: 0,
          PARENT: 0,
          TEACHER: 0,
          SCHOOL: 0,
          ACADEMIC: 0,
          FINANCE: 0,
          OTHER: 0,
        },
      },
      error,
    };
  }

  const countByCategory: Record<DocumentCategory, number> = {
    STUDENT: 0,
    PARENT: 0,
    TEACHER: 0,
    SCHOOL: 0,
    ACADEMIC: 0,
    FINANCE: 0,
    OTHER: 0,
  };

  let totalSizeBytes = 0;
  let activeCount = 0;
  let archivedCount = 0;

  for (const doc of docs) {
    if (doc.is_archived) {
      archivedCount++;
    } else {
      activeCount++;
      totalSizeBytes += doc.file_size || 0;
      if (countByCategory[doc.document_category] !== undefined) {
        countByCategory[doc.document_category]++;
      } else {
        countByCategory.OTHER++;
      }
    }
  }

  return {
    stats: {
      totalDocuments: docs.length,
      activeDocuments: activeCount,
      archivedDocuments: archivedCount,
      totalSizeBytes,
      totalSizeFormatted: formatFileSize(totalSizeBytes),
      countByCategory,
    },
    error: null,
  };
}
