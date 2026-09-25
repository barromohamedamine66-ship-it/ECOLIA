/**
 * ÉCOLIA SaaS - Service Notifications
 * Gestion du centre de notifications internes, marquage lu/non-lu, compteur et émission ciblée
 */

import { supabase, isSupabaseConfigured, isProductionEnv, assertSupabaseConfigured } from '../supabase/client';
import type { Notification, NotificationInsert, NotificationType } from '../supabase/types';

// Store local mémoire / fallback démo pour le développement hors-ligne
let localNotifications: Notification[] = [
  {
    id: 'notif-2026-001',
    school_id: 'sch-ecolia-001',
    profile_id: 'usr-admin-001',
    title: 'Rentrée scolaire 2026-2027',
    message: 'La note de service pour la rentrée a été publiée avec succès.',
    link: '/announcements',
    type: 'ANNOUNCEMENT',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-2026-002',
    school_id: 'sch-ecolia-001',
    profile_id: 'usr-admin-001',
    title: 'Nouveau paiement enregistré',
    message: 'Un versement de 150 000 FCFA a été enregistré pour l\'élève TRAORÉ Mohamed (Reçu #REC-2026-00042).',
    link: '/finance/payments',
    type: 'PAYMENT',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'notif-2026-003',
    school_id: 'sch-ecolia-001',
    profile_id: 'usr-admin-001',
    title: 'Bulletins du 1er Trimestre prêts',
    message: 'Les calculs de moyennes pour la 6ème A sont validés par la Direction.',
    link: '/report-cards',
    type: 'REPORT_CARD',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export async function getNotifications(
  schoolId: string,
  profileId: string,
  filter: 'ALL' | 'UNREAD' | 'READ' = 'ALL',
  limit = 50
): Promise<{ data: Notification[]; count: number; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return {
      data: [],
      count: 0,
      error: 'CRITICAL: Supabase non configuré en environnement de production.',
      source: 'SUPABASE',
    };
  }

  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('school_id', schoolId)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filter === 'UNREAD') {
        query = query.eq('is_read', false);
      } else if (filter === 'READ') {
        query = query.eq('is_read', true);
      }

      const { data, count, error } = await query;
      if (error) {
        return { data: [], count: 0, error: error.message, source: 'SUPABASE' };
      }
      return { data: data || [], count: count || (data?.length ?? 0), error: null, source: 'SUPABASE' };
    } catch (err: any) {
      console.error('Erreur getNotifications Supabase:', err);
    }
  }

  // Mode démo / fallback
  let filtered = localNotifications.filter(
    n => n.school_id === schoolId && (n.profile_id === profileId || profileId === 'usr-admin-001')
  );

  if (filter === 'UNREAD') {
    filtered = filtered.filter(n => !n.is_read);
  } else if (filter === 'READ') {
    filtered = filtered.filter(n => n.is_read);
  }

  return {
    data: filtered.slice(0, limit),
    count: filtered.length,
    error: null,
    source: 'DEMO_STORE',
  };
}

export async function getUnreadCount(
  schoolId: string,
  profileId: string
): Promise<{ count: number; error: string | null; source: 'SUPABASE' | 'DEMO_STORE' }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { count: 0, error: 'Supabase non configuré en production.', source: 'SUPABASE' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('profile_id', profileId)
        .eq('is_read', false);

      if (error) {
        return { count: 0, error: error.message, source: 'SUPABASE' };
      }
      return { count: count || 0, error: null, source: 'SUPABASE' };
    } catch (err: any) {
      console.error('Erreur getUnreadCount Supabase:', err);
    }
  }

  const unread = localNotifications.filter(
    n => n.school_id === schoolId && (n.profile_id === profileId || profileId === 'usr-admin-001') && !n.is_read
  ).length;

  return { count: unread, error: null, source: 'DEMO_STORE' };
}

export async function markAsRead(
  notificationId: string
): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur inconnue' };
    }
  }

  const notif = localNotifications.find(n => n.id === notificationId);
  if (notif) {
    notif.is_read = true;
  }
  return { success: true, error: null };
}

export async function markAllAsRead(
  schoolId: string,
  profileId: string
): Promise<{ success: boolean; countUpdated: number; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('school_id', schoolId)
        .eq('profile_id', profileId)
        .eq('is_read', false)
        .select();

      if (error) return { success: false, countUpdated: 0, error: error.message };
      return { success: true, countUpdated: data?.length || 0, error: null };
    } catch (err: any) {
      return { success: false, countUpdated: 0, error: err.message || 'Erreur inconnue' };
    }
  }

  let count = 0;
  localNotifications = localNotifications.map(n => {
    if (n.school_id === schoolId && (n.profile_id === profileId || profileId === 'usr-admin-001') && !n.is_read) {
      count++;
      return { ...n, is_read: true };
    }
    return n;
  });

  return { success: true, countUpdated: count, error: null };
}

/**
 * Crée une notification individuelle avec protection anti-doublon déterministe (Idempotence)
 */
export async function createNotification(
  payload: NotificationInsert
): Promise<{ data: Notification | null; error: string | null }> {
  if (isProductionEnv() && !isSupabaseConfigured()) {
    return { data: null, error: 'CRITICAL: Supabase non configuré en production.' };
  }

  if (isSupabaseConfigured()) {
    try {
      // 1. Clé d'idempotence basée sur (school_id, profile_id, link / title) dans une fenêtre de 10 min
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      let dedupQuery = supabase
        .from('notifications')
        .select('id')
        .eq('school_id', payload.school_id)
        .eq('profile_id', payload.profile_id)
        .gte('created_at', tenMinutesAgo);

      if (payload.link) {
        dedupQuery = dedupQuery.eq('link', payload.link);
      } else {
        dedupQuery = dedupQuery.eq('title', payload.title);
      }

      const { data: existing } = await dedupQuery.maybeSingle();

      if (existing) {
        // Doublon évité
        return { data: null, error: 'Notification identique récemment envoyée (protection anti-doublon idempotente).' };
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert([payload])
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Erreur création notification' };
    }
  }

  // Mode démo
  const newNotif: Notification = {
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    school_id: payload.school_id,
    profile_id: payload.profile_id,
    title: payload.title,
    message: payload.message,
    link: payload.link || null,
    type: payload.type || 'SYSTEM',
    is_read: payload.is_read || false,
    created_at: new Date().toISOString(),
  };

  localNotifications.unshift(newNotif);
  return { data: newNotif, error: null };
}


/**
 * Génère des notifications en masse pour un groupe d'utilisateurs ciblés
 */
export async function createBatchNotifications(
  schoolId: string,
  recipientProfileIds: string[],
  title: string,
  message: string,
  type: NotificationType = 'ANNOUNCEMENT',
  link?: string
): Promise<{ successCount: number; error: string | null }> {
  if (!recipientProfileIds || recipientProfileIds.length === 0) {
    return { successCount: 0, error: null };
  }

  // Filtrer les IDs uniques pour éviter les doublons d'un même utilisateur
  const uniqueIds = Array.from(new Set(recipientProfileIds));

  if (isSupabaseConfigured()) {
    try {
      const rows: NotificationInsert[] = uniqueIds.map(profileId => ({
        school_id: schoolId,
        profile_id: profileId,
        title,
        message,
        type,
        link: link || null,
        is_read: false,
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(rows)
        .select();

      if (error) return { successCount: 0, error: error.message };
      return { successCount: data?.length || 0, error: null };
    } catch (err: any) {
      return { successCount: 0, error: err.message || 'Erreur création notifications de groupe' };
    }
  }

  // Mode Démo
  let count = 0;
  for (const profileId of uniqueIds) {
    localNotifications.unshift({
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      school_id: schoolId,
      profile_id: profileId,
      title,
      message,
      link: link || null,
      type,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    count++;
  }

  return { successCount: count, error: null };
}
