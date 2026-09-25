/**
 * ÉCOLIA SaaS - Service Annonces & Communication Établissement
 * Gestion de la publication des annonces ciblées et diffusion automatique des notifications
 */

import { supabase, isSupabaseConfigured, isProductionEnv } from '../supabase/client';
import type { Announcement, AnnouncementInsert, AnnouncementUpdate, AnnouncementTarget } from '../supabase/types';
import { createBatchNotifications } from './notifications';


// Base d'annonces de démonstration pour développement local
let localAnnouncements: Announcement[] = [
  {
    id: 'ann-2026-001',
    school_id: 'sch-ecolia-001',
    title: 'Rentrée des classes et organisation pédagogique',
    content: 'La rentrée scolaire est fixée au Lundi 15 Septembre à 07h30 pour l\'ensemble des cycles. Les emplois du temps sont disponibles dans votre espace.',
    target: 'TOUS',
    target_class_id: null,
    target_level: null,
    is_published: true,
    published_by: 'usr-admin-001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'ann-2026-002',
    school_id: 'sch-ecolia-001',
    title: 'Réunion générale des parents d\'élèves',
    content: 'Une assemblée générale des parents se tiendra le Samedi 27 Septembre à 09h00 dans la grande salle polyvalente pour la présentation de l\'année.',
    target: 'PARENTS',
    target_class_id: null,
    target_level: null,
    is_published: true,
    published_by: 'usr-admin-001',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'ann-2026-003',
    school_id: 'sch-ecolia-001',
    title: 'Conseil des professeurs de 3ème',
    content: 'Conseil pédagogique préparatoire aux examens blancs le Mercredi 1er Octobre à 15h00.',
    target: 'ENSEIGNANTS',
    target_class_id: null,
    target_level: '3eme',
    is_published: false,
    published_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

export async function getAnnouncements(
  schoolId: string,
  options?: {
    target?: AnnouncementTarget;
    isPublished?: boolean;
    classId?: string;
    level?: string;
  }
): Promise<{ data: Announcement[]; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { data: [], error: 'CRITICAL: Supabase non configuré en environnement de production.', source: 'SUPABASE' };
  }

  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (options?.isPublished !== undefined) {
        query = query.eq('is_published', options.isPublished);
      }

      if (options?.target) {
        query = query.eq('target', options.target);
      }

      const { data, error } = await query;
      if (error) {
        return { data: [], error: error.message, source: 'SUPABASE' };
      }
      return { data: data || [], error: null, source: 'SUPABASE' };
    } catch (err: any) {
      console.error('Erreur getAnnouncements Supabase:', err);
    }
  }

  // Filtrage démo
  let filtered = localAnnouncements.filter(a => a.school_id === schoolId);

  if (options?.isPublished !== undefined) {
    filtered = filtered.filter(a => a.is_published === options.isPublished);
  }
  if (options?.target) {
    filtered = filtered.filter(a => a.target === options.target || a.target === 'TOUS');
  }

  return {
    data: filtered,
    error: null,
    source: 'DEMO_STORE',
  };
}

export async function getAnnouncementById(
  id: string
): Promise<{ data: Announcement | null; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) return { data: null, error: error.message, source: 'SUPABASE' };
      return { data, error: null, source: 'SUPABASE' };
    } catch (err: any) {
      return { data: null, error: err.message, source: 'SUPABASE' };
    }
  }

  const found = localAnnouncements.find(a => a.id === id) || null;
  return { data: found, error: null, source: 'DEMO_STORE' };
}

export async function createAnnouncement(
  payload: AnnouncementInsert
): Promise<{ data: Announcement | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([payload])
        .select()
        .single();

      if (error) return { data: null, error: error.message };

      // Audit Log
      await supabase.from('audit_logs').insert([{
        school_id: payload.school_id,
        user_id: payload.published_by || null,
        action: 'CREATE_ANNOUNCEMENT',
        entity_type: 'announcement',
        entity_id: data.id,
        details: { title: payload.title, target: payload.target },
      }]);

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Erreur création annonce' };
    }
  }

  const newAnn: Announcement = {
    id: 'ann-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    school_id: payload.school_id,
    title: payload.title,
    content: payload.content,
    target: payload.target || 'TOUS',
    target_class_id: payload.target_class_id || null,
    target_level: payload.target_level || null,
    is_published: payload.is_published || false,
    published_by: payload.published_by || null,
    created_at: new Date().toISOString(),
  };

  localAnnouncements.unshift(newAnn);
  return { data: newAnn, error: null };
}

export async function updateAnnouncement(
  id: string,
  payload: AnnouncementUpdate
): Promise<{ data: Announcement | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Erreur mise à jour annonce' };
    }
  }

  const idx = localAnnouncements.findIndex(a => a.id === id);
  if (idx !== -1) {
    localAnnouncements[idx] = { ...localAnnouncements[idx], ...payload };
    return { data: localAnnouncements[idx], error: null };
  }
  return { data: null, error: 'Annonce non trouvée' };
}

/**
 * Publie une annonce et diffuse automatiquement les notifications internes aux profils concernés
 */
export async function publishAnnouncement(
  id: string,
  publisherProfileId: string,
  schoolId: string
): Promise<{ success: boolean; notificationCount: number; error: string | null }> {
  let announcement: Announcement | null = null;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update({
          is_published: true,
          published_by: publisherProfileId,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return { success: false, notificationCount: 0, error: error.message };
      announcement = data;

      // Récupération des destinataires selon l'audience
      let recipientProfileIds: string[] = [];

      if (announcement.target === 'TOUS') {
        const { data: users } = await supabase
          .from('profiles')
          .select('id')
          .eq('school_id', schoolId);
        recipientProfileIds = (users || []).map(u => u.id);
      } else if (announcement.target === 'ENSEIGNANTS') {
        const { data: teachers } = await supabase
          .from('profiles')
          .select('id')
          .eq('school_id', schoolId)
          .eq('role', 'TEACHER');
        recipientProfileIds = (teachers || []).map(u => u.id);
      } else if (announcement.target === 'PARENTS') {
        const { data: parents } = await supabase
          .from('profiles')
          .select('id')
          .eq('school_id', schoolId)
          .eq('role', 'PARENT');
        recipientProfileIds = (parents || []).map(u => u.id);
      } else if (announcement.target === 'ELEVES') {
        const { data: students } = await supabase
          .from('profiles')
          .select('id')
          .eq('school_id', schoolId)
          .eq('role', 'STUDENT');
        recipientProfileIds = (students || []).map(u => u.id);
      }

      // Diffusion des notifications internes avec anti-doublon
      const { successCount } = await createBatchNotifications(
        schoolId,
        recipientProfileIds,
        `Nouvelle annonce : ${announcement.title}`,
        announcement.content.substring(0, 140) + (announcement.content.length > 140 ? '...' : ''),
        'ANNOUNCEMENT',
        '/announcements'
      );

      // Audit Log
      await supabase.from('audit_logs').insert([{
        school_id: schoolId,
        user_id: publisherProfileId,
        action: 'PUBLISH_ANNOUNCEMENT',
        entity_type: 'announcement',
        entity_id: id,
        details: { target: announcement.target, notificationsSent: successCount },
      }]);

      return { success: true, notificationCount: successCount, error: null };
    } catch (err: any) {
      return { success: false, notificationCount: 0, error: err.message || 'Erreur lors de la publication' };
    }
  }

  // Mode Démo
  const targetAnn = localAnnouncements.find(a => a.id === id);
  if (targetAnn) {
    targetAnn.is_published = true;
    targetAnn.published_by = publisherProfileId;

    // Simulation de notification ciblée
    await createBatchNotifications(
      schoolId,
      ['usr-admin-001', 'usr-teacher-001', 'usr-parent-001'],
      `Nouvelle annonce : ${targetAnn.title}`,
      targetAnn.content.substring(0, 140) + '...',
      'ANNOUNCEMENT',
      '/announcements'
    );

    return { success: true, notificationCount: 3, error: null };
  }

  return { success: false, notificationCount: 0, error: 'Annonce introuvable' };
}

export async function archiveAnnouncement(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_published: false })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const targetAnn = localAnnouncements.find(a => a.id === id);
  if (targetAnn) {
    targetAnn.is_published = false;
    return { success: true, error: null };
  }
  return { success: false, error: 'Annonce introuvable' };
}
