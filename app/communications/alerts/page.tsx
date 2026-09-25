'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AlertTemplate {
  id: string;
  type: 'ABSENCE' | 'BULLETIN' | 'FINANCE_RELANCE' | 'URGENCE';
  title: string;
  recipientName: string;
  recipientPhone: string;
  studentName: string;
  className: string;
  amountDue?: number;
  messageText: string;
}

export default function WhatsAppAlertsCenterPage() {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);

  const alertsList: AlertTemplate[] = [
    {
      id: 'alt-01',
      type: 'ABSENCE',
      title: 'Alerte Absence Matinale non justifiée',
      recipientName: 'M. TRAORÉ Souleymane',
      recipientPhone: '+2250708123456',
      studentName: 'Mohamed TRAORÉ',
      className: '3e A',
      messageText: `Bonjour M. TRAORÉ,\nLe Groupe Scolaire Horizon vous informe que votre enfant Mohamed (3e A) a été marqué ABSENT ce matin à 08h00 au cours de Mathématiques.\nMerci de contacter le secrétariat au +225 27 22 44 55 66 pour tout justificatif.`,
    },
    {
      id: 'alt-02',
      type: 'FINANCE_RELANCE',
      title: 'Rappel Échéance 2ème Tranche Scolarité',
      recipientName: 'Mme KOUASSI Patricia',
      recipientPhone: '+2250544221100',
      studentName: 'Ange Emmanuel KOUASSI',
      className: '6e A',
      amountDue: 50000,
      messageText: `Chère Mme KOUASSI,\nRappel bienveillant du Groupe Scolaire Horizon : la 2ème tranche de scolarité pour Ange Emmanuel (6e A) d'un montant de 50 000 FCFA arrive à échéance le 15 Janvier.\nPaiement possible par Wave / Orange Money ou à la caisse de l'école. Merci pour votre collaboration.`,
    },
    {
      id: 'alt-03',
      type: 'BULLETIN',
      title: 'Publication Bulletin du 1er Trimestre',
      recipientName: 'M. BAMBA Yacouba',
      recipientPhone: '+2250102030405',
      studentName: 'Yasmine BAMBA',
      className: 'Terminale D',
      messageText: `Bonjour M. BAMBA,\nLe bulletin du 1er Trimestre de Yasmine (Terminale D) est disponible !\nMoyenne Générale : 16.20 / 20 (Tableau d'Honneur).\nConsultez et téléchargez le bulletin officiel certifié sur votre espace ÉCOLIA : https://ecolia.vercel.app/report-cards`,
    },
    {
      id: 'alt-04',
      type: 'ABSENCE',
      title: 'Alerte Retard en classe',
      recipientName: 'M. YAO Kouamé',
      recipientPhone: '+2250777889900',
      studentName: 'David YAO',
      className: '4e A',
      messageText: `Bonjour M. YAO,\nVotre enfant David (4e A) est arrivé avec un retard de 25 minutes ce matin au cours d'Histoire-Géographie. Merci de veiller à sa ponctualité.`,
    }
  ];

  const filtered = selectedType === 'ALL'
    ? alertsList
    : alertsList.filter(a => a.type === selectedType);

  const generateWhatsAppLink = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleSimulateSend = (title: string, phone: string) => {
    setSentSuccess(`Message envoyé avec succès à ${phone} pour « ${title} » !`);
    setTimeout(() => setSentSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            É
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Centre d'Alertes WhatsApp & SMS</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-green-100 text-green-800 flex items-center gap-1.5">
                <i className="fa-brands fa-whatsapp text-green-600 text-sm"></i>
                Canal Direct Parent
              </span>
            </h1>
            <p className="text-xs text-slate-500">Envoi automatisé des notifications d'absences, de bulletins et de relances financières</p>
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
        {/* Success Alert */}
        {sentSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-xl text-emerald-400"></i>
              <span className="text-sm font-semibold">{sentSuccess}</span>
            </div>
            <button onClick={() => setSentSuccess(null)} className="text-xs text-emerald-300 font-bold">✕</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-slate-400">Taux d'Ouverture WhatsApp</span>
            <p className="text-3xl font-black text-emerald-600 font-mono mt-1">98.4 %</p>
            <span className="text-[11px] text-slate-500">vs 18% par email</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-slate-400">Alertes Absences Aujourd'hui</span>
            <p className="text-3xl font-black text-amber-500 font-mono mt-1">4</p>
            <span className="text-[11px] text-slate-500">Transmises en temps réel</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-slate-400">Relances Tranches FCFA</span>
            <p className="text-3xl font-black text-blue-600 font-mono mt-1">12</p>
            <span className="text-[11px] text-slate-500">Échéances de Janvier</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-slate-400">Bulletins Transmis</span>
            <p className="text-3xl font-black text-purple-600 font-mono mt-1">240</p>
            <span className="text-[11px] text-slate-500">Avec QR Code sécurisé</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['ALL', 'ABSENCE', 'FINANCE_RELANCE', 'BULLETIN'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {type === 'ALL' && 'Toutes les Alertes'}
              {type === 'ABSENCE' && '🚨 Absences & Retards'}
              {type === 'FINANCE_RELANCE' && '💰 Relances Scolarité FCFA'}
              {type === 'BULLETIN' && '📄 Bulletins Trimestriels'}
            </button>
          ))}
        </div>

        {/* Alerts Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(alert => (
            <div key={alert.id} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      alert.type === 'ABSENCE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' :
                      alert.type === 'FINANCE_RELANCE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                    }`}>
                      {alert.type === 'ABSENCE' && <i className="fa-solid fa-user-clock"></i>}
                      {alert.type === 'FINANCE_RELANCE' && <i className="fa-solid fa-money-bill-transfer"></i>}
                      {alert.type === 'BULLETIN' && <i className="fa-solid fa-file-lines"></i>}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{alert.title}</h3>
                      <p className="text-xs text-slate-500">Élève : <strong className="text-slate-800 dark:text-slate-200">{alert.studentName}</strong> ({alert.className})</p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {alert.recipientName}
                  </span>
                </div>

                {/* Message preview box */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-mono whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                  {alert.messageText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <a
                  href={generateWhatsAppLink(alert.recipientPhone, alert.messageText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  Ouvrir WhatsApp Direct
                </a>

                <button
                  onClick={() => handleSimulateSend(alert.title, alert.recipientPhone)}
                  className="px-4 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                  Envoi SMS
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
