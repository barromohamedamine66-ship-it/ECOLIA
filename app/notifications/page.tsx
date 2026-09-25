'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from '../../lib/services/notifications';
import type { Notification, NotificationType } from '../../lib/supabase/types';

export default function NotificationsCenterPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const schoolId = 'sch-ecolia-001';
  const profileId = 'usr-admin-001';

  const loadData = async () => {
    setLoading(true);
    const [notifsRes, countRes] = await Promise.all([
      getNotifications(schoolId, profileId, activeTab),
      getUnreadCount(schoolId, profileId),
    ]);

    setNotifications(notifsRes.data);
    setUnreadCount(countRes.count);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleMarkAsRead = async (notifId: string, link?: string | null) => {
    await markAsRead(notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    if (link) {
      router.push(link);
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead(schoolId, profileId);
    if (res.success) {
      setStatusMessage(`${res.countUpdated} notification(s) marquée(s) comme lue(s).`);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return { icon: 'fa-bullhorn', bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
      case 'PAYMENT':
        return { icon: 'fa-receipt', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'REPORT_CARD':
        return { icon: 'fa-award', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'GRADE':
        return { icon: 'fa-pen-ruler', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'ATTENDANCE':
        return { icon: 'fa-calendar-check', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' };
      default:
        return { icon: 'fa-bell', bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Centre de Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Alertes pédagogiques, finances, annonces et activités scolaires
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                unreadCount > 0
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 shadow-md'
                  : 'bg-slate-900/50 text-slate-600 border border-slate-800/40 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-check-double"></i>
              Tout marquer comme lu
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <i className="fa-solid fa-circle-check"></i>
            {statusMessage}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ALL'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <i className="fa-solid fa-inbox"></i>
            Toutes les alertes
          </button>

          <button
            onClick={() => setActiveTab('UNREAD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'UNREAD'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <i className="fa-solid fa-envelope"></i>
            Non lues
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('READ')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'READ'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <i className="fa-solid fa-envelope-open"></i>
            Historique / Lues
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs flex items-center justify-center gap-3">
            <i className="fa-solid fa-spinner fa-spin text-emerald-400 text-base"></i>
            Actualisation des notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-regular fa-bell-slash"></i>
            </div>
            <h3 className="font-bold text-white text-sm">Aucune notification pour le moment</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Vous êtes à jour ! Toutes les annonces officielles et notifications d'événements s'afficheront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => {
              const meta = getTypeIcon(notif.type);

              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.link)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    notif.is_read
                      ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 opacity-75'
                      : 'bg-slate-900/90 border-slate-700 hover:border-emerald-500/50 shadow-lg'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 border ${meta.bg} ${meta.text} ${meta.border}`}>
                    <i className={`fa-solid ${meta.icon}`}></i>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h2 className={`text-xs sm:text-sm font-bold truncate ${notif.is_read ? 'text-slate-300' : 'text-white'}`}>
                          {notif.title}
                        </h2>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(notif.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300">
                        <span>Voir la ressource associée</span>
                        <i className="fa-solid fa-arrow-right text-[9px]"></i>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
