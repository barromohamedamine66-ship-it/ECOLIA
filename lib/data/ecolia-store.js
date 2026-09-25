/**
 * ÉCOLIA SaaS - Moteur de Données & Gestionnaire d'État Local/Persistant
 * Établissement de Référence : « Groupe Scolaire Horizon » (Abidjan, Côte d'Ivoire)
 * Devise : FCFA | Année académique : 2026-2027
 */

const ECOLIA_STORAGE_KEY = 'ECOLIA_SAAS_DATABASE_V1';

const INITIAL_ECOLIA_DB = {
  school: {
    id: "sch-horizon-001",
    code: "HORIZON-ABJ",
    name: "Groupe Scolaire Horizon",
    motto: "Discipline • Travail • Excellence",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    commune: "Cocody Riviera 3",
    address: "Boulevard François Mitterrand, Abidjan",
    phone: "+225 27 22 44 55 66",
    email: "direction@horizon-abidjan.ci",
    currency: "FCFA",
    academicYear: "2026-2027",
    principalName: "M. KOUASSI Jean-Baptiste (Directeur des Études)",
    foundedYear: 2012
  },

  // Utilisateurs Authentifiés par Rôle
  users: [
    {
      id: "usr-dir-01",
      name: "M. KOUASSI Jean-Baptiste",
      role: "DIRECTOR",
      roleLabel: "Directeur des Études",
      email: "directeur@horizon.ci",
      password: "admin",
      phone: "+225 07 08 09 10 11",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      description: "Accès complet à la scolarité, aux résultats pédagogiques et à la supervision générale."
    },
    {
      id: "usr-tea-01",
      name: "M. KOFFI Yao Simplice",
      role: "TEACHER",
      roleLabel: "Professeur de Mathématiques",
      email: "prof.koffi@horizon.ci",
      password: "prof",
      phone: "+225 05 12 34 56 78",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      assignedClass: "cls-3a",
      assignedSubject: "MATH",
      description: "Saisie des notes de Mathématiques, feuille d'appel journalière et emploi du temps."
    },
    {
      id: "usr-acc-01",
      name: "Mme. BAKAYOKO Aminata",
      role: "ACCOUNTANT",
      roleLabel: "Chef Comptable & Trésorière",
      email: "compta@horizon.ci",
      password: "compta",
      phone: "+225 01 23 45 67 89",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      description: "Gestion des frais, enregistrement des paiements (Wave, MoMo, Espèces) et émission de reçus."
    },
    {
      id: "usr-par-01",
      name: "M. TRAORÉ Ibrahim",
      role: "PARENT",
      roleLabel: "Parent d'Élèves (3 enfants inscrits)",
      email: "ibrahim.traore@gmail.com",
      password: "parent",
      phone: "+225 07 48 55 12 00",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      childrenIds: ["stu-2026-001", "stu-2026-002", "stu-2026-003"],
      description: "Portail familial pour Mohamed (3e A), Aïcha (6e B) et Mariam (CM2 A)."
    },
    {
      id: "usr-sec-01",
      name: "Mme. TIECOURA Florence",
      role: "SECRETARY",
      roleLabel: "Secrétariat Général & Admissions",
      email: "secretariat@horizon.ci",
      password: "sec",
      phone: "+225 27 22 44 55 67",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      description: "Inscriptions, création des fiches élèves et documents administratifs."
    }
  ],

  classes: [
    { id: "cls-cm2", name: "CM2 A", level: "Primaire", room: "Bâtiment Primaire - Salle 05", headTeacher: "M. GOHOU Michel", capacity: 40, feeAnnual: 180000 },
    { id: "cls-6a", name: "6e A", level: "Collège", room: "Bâtiment A - Salle 101", headTeacher: "Mme. ADOU Marie", capacity: 45, feeAnnual: 220000 },
    { id: "cls-6b", name: "6e B", level: "Collège", room: "Bâtiment A - Salle 102", headTeacher: "M. KOUAME Paul", capacity: 45, feeAnnual: 220000 },
    { id: "cls-5a", name: "5e A", level: "Collège", room: "Bâtiment A - Salle 104", headTeacher: "Dr. BAMBA Ousmane", capacity: 45, feeAnnual: 230000 },
    { id: "cls-4a", name: "4e A", level: "Collège", room: "Bâtiment B - Salle 201", headTeacher: "Mme. COULIBALY Sita", capacity: 45, feeAnnual: 240000 },
    { id: "cls-3a", name: "3e A (Brevet)", level: "Collège", room: "Bâtiment B - Salle 204", headTeacher: "M. KOFFI Yao Simplice", capacity: 45, feeAnnual: 250000 },
    { id: "cls-tled", name: "Terminale D (Bac)", level: "Lycée", room: "Bâtiment C - Salle 302", headTeacher: "Prof. N'GUESSAN Eric", capacity: 40, feeAnnual: 280000 }
  ],

  subjects: [
    { id: "MATH", name: "Mathématiques", code: "MATH", coef: 4, category: "Scientifique" },
    { id: "FR", name: "Français & Expression", code: "FR", coef: 4, category: "Littéraire" },
    { id: "SP", name: "Physique - Chimie", code: "SP", coef: 3, category: "Scientifique" },
    { id: "SVT", name: "Sciences de la Vie & Terre", code: "SVT", coef: 2, category: "Scientifique" },
    { id: "HG", name: "Histoire - Géographie", code: "HG", coef: 3, category: "Littéraire" },
    { id: "ANG", name: "Anglais (LV1)", code: "ANG", coef: 3, category: "Langues" },
    { id: "EPS", name: "Éducation Physique & Sportive", code: "EPS", coef: 2, category: "Sport" },
    { id: "EDHC", name: "Éducation aux Droits de l'Homme", code: "EDHC", coef: 1, category: "Citoyenneté" }
  ],

  // Liste des Élèves avec Fiches Complètes
  students: [
    {
      id: "stu-2026-001",
      matricule: "ECO-2026-00001",
      first_name: "Mohamed",
      last_name: "TRAORÉ",
      gender: "M",
      birth_date: "2011-04-12",
      birth_place: "Abidjan Cocody",
      nationality: "Ivoirienne",
      class_id: "cls-3a",
      class_name: "3e A (Brevet)",
      parent_name: "M. TRAORÉ Ibrahim",
      parent_phone: "+225 07 48 55 12 00",
      parent_email: "ibrahim.traore@gmail.com",
      parent_relationship: "Père",
      address: "Riviera Palmeraie, Villa 142",
      photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      annual_tuition: 250000,
      paid_tuition: 250000,
      balance_tuition: 0,
      payment_status: "SOLDE",
      conduct: "Élève exemplaire, délégué adjoint de classe.",
      medical_notes: "Aucune allergie connue. Groupe sanguin O+"
    },
    {
      id: "stu-2026-002",
      matricule: "ECO-2026-00002",
      first_name: "Aïcha",
      last_name: "TRAORÉ",
      gender: "F",
      birth_date: "2014-08-25",
      birth_place: "Bouaké",
      nationality: "Ivoirienne",
      class_id: "cls-6b",
      class_name: "6e B",
      parent_name: "M. TRAORÉ Ibrahim",
      parent_phone: "+225 07 48 55 12 00",
      parent_email: "ibrahim.traore@gmail.com",
      parent_relationship: "Père",
      address: "Riviera Palmeraie, Villa 142",
      photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      annual_tuition: 220000,
      paid_tuition: 150000,
      balance_tuition: 70000,
      payment_status: "PARTIEL",
      conduct: "Très assidue, participation active.",
      medical_notes: "Porte des lunettes de vue."
    },
    {
      id: "stu-2026-003",
      matricule: "ECO-2026-00003",
      first_name: "Mariam",
      last_name: "TRAORÉ",
      gender: "F",
      birth_date: "2016-01-19",
      birth_place: "Abidjan",
      nationality: "Ivoirienne",
      class_id: "cls-cm2",
      class_name: "CM2 A",
      parent_name: "M. TRAORÉ Ibrahim",
      parent_phone: "+225 07 48 55 12 00",
      parent_email: "ibrahim.traore@gmail.com",
      parent_relationship: "Père",
      address: "Riviera Palmeraie, Villa 142",
      photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      annual_tuition: 180000,
      paid_tuition: 180000,
      balance_tuition: 0,
      payment_status: "SOLDE",
      conduct: "Travail soigné et régulier.",
      medical_notes: "R.A.S."
    },
    {
      id: "stu-2026-004",
      matricule: "ECO-2026-00004",
      first_name: "Aïcha",
      last_name: "KONÉ",
      gender: "F",
      birth_date: "2011-06-10",
      birth_place: "Korhogo",
      nationality: "Ivoirienne",
      class_id: "cls-3a",
      class_name: "3e A (Brevet)",
      parent_name: "Mme. KONÉ Fatoumata",
      parent_phone: "+225 05 04 11 22 33",
      parent_email: "f.kone@ci-services.com",
      parent_relationship: "Mère",
      address: "Angré 8ème Tranche",
      photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      annual_tuition: 250000,
      paid_tuition: 250000,
      balance_tuition: 0,
      payment_status: "SOLDE",
      conduct: "Major de classe, brillante.",
      medical_notes: "Groupe A+"
    },
    {
      id: "stu-2026-005",
      matricule: "ECO-2026-00005",
      first_name: "Mariam",
      last_name: "DIALLO",
      gender: "F",
      birth_date: "2011-09-03",
      birth_place: "Abidjan Treichville",
      nationality: "Ivoirienne",
      class_id: "cls-3a",
      class_name: "3e A (Brevet)",
      parent_name: "Dr. DIALLO Ousmane",
      parent_phone: "+225 07 89 44 12 30",
      parent_email: "diallo.ousmane@santeci.org",
      parent_relationship: "Père",
      address: "Marcory Zone 4",
      photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      annual_tuition: 250000,
      paid_tuition: 150000,
      balance_tuition: 100000,
      payment_status: "PARTIEL",
      conduct: "Bonne élève, travail constant.",
      medical_notes: "R.A.S."
    },
    {
      id: "stu-2026-006",
      matricule: "ECO-2026-00006",
      first_name: "Ibrahim",
      last_name: "COULIBALY",
      gender: "M",
      birth_date: "2010-12-14",
      birth_place: "Yamoussoukro",
      nationality: "Ivoirienne",
      class_id: "cls-3a",
      class_name: "3e A (Brevet)",
      parent_name: "M. COULIBALY Seydou",
      parent_phone: "+225 01 98 76 54 32",
      parent_email: "c.seydou@avocat-ci.com",
      parent_relationship: "Père",
      address: "Deux-Plateaux Vallon",
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      annual_tuition: 250000,
      paid_tuition: 50000,
      balance_tuition: 200000,
      payment_status: "IMPAYE",
      conduct: "Doit redoubler d'efforts et de concentration.",
      medical_notes: "Asthme léger."
    },
    {
      id: "stu-2026-007",
      matricule: "ECO-2026-00007",
      first_name: "Koffi Jean-Eudes",
      last_name: "N'GUESSAN",
      gender: "M",
      birth_date: "2009-02-18",
      birth_place: "Daloa",
      nationality: "Ivoirienne",
      class_id: "cls-tled",
      class_name: "Terminale D (Bac)",
      parent_name: "Mme. N'GUESSAN Akissi",
      parent_phone: "+225 07 14 25 36 47",
      parent_email: "akissi.nguessan@orange.ci",
      parent_relationship: "Mère",
      address: "Cocody Cité des Arts",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      annual_tuition: 280000,
      paid_tuition: 280000,
      balance_tuition: 0,
      payment_status: "SOLDE",
      conduct: "Excellent niveau scientifique.",
      medical_notes: "R.A.S."
    }
  ],

  // Évaluations & Saisie des Notes réelles
  evaluations: [
    { id: "eval-3a-math-1", class_id: "cls-3a", subject_id: "MATH", period: "T1", title: "Devoir Surveillé N°1 (Thalès & Calcul)", date: "2026-10-15", max_score: 20, coef: 2 },
    { id: "eval-3a-fr-1", class_id: "cls-3a", subject_id: "FR", period: "T1", title: "Contrôle Continu : Expression écrite", date: "2026-10-20", max_score: 20, coef: 2 },
    { id: "eval-3a-sp-1", class_id: "cls-3a", subject_id: "SP", period: "T1", title: "Devoir Surveillé de Chimie", date: "2026-10-28", max_score: 20, coef: 2 },
    { id: "eval-3a-hg-1", class_id: "cls-3a", subject_id: "HG", period: "T1", title: "Évaluation : Histoire de la Côte d'Ivoire", date: "2026-11-05", max_score: 20, coef: 2 }
  ],

  grades: [
    // 3e A - Mathématiques Devoir 1 (Données réelles demandées)
    { id: "grd-1", eval_id: "eval-3a-math-1", student_id: "stu-2026-001", score: 14.0, comment: "Bonne maîtrise des propriétés géométriques." },
    { id: "grd-2", eval_id: "eval-3a-math-1", student_id: "stu-2026-004", score: 16.5, comment: "Excellent raisonnement logique." },
    { id: "grd-3", eval_id: "eval-3a-math-1", student_id: "stu-2026-005", score: 11.0, comment: "Ensemble convenable, persévérer." },
    { id: "grd-4", eval_id: "eval-3a-math-1", student_id: "stu-2026-006", score: 8.5, comment: "Insuffisant. Réviser les théorèmes de base." },

    // 3e A - Français
    { id: "grd-5", eval_id: "eval-3a-fr-1", student_id: "stu-2026-001", score: 15.0, comment: "Très bonne argumentation et style clair." },
    { id: "grd-6", eval_id: "eval-3a-fr-1", student_id: "stu-2026-004", score: 17.0, comment: "Remarquable expression écrite." },
    { id: "grd-7", eval_id: "eval-3a-fr-1", student_id: "stu-2026-005", score: 13.5, comment: "Travail satisfaisant." },
    { id: "grd-8", eval_id: "eval-3a-fr-1", student_id: "stu-2026-006", score: 9.0, comment: "Faire attention à la syntaxe." },

    // 3e A - Sciences Physiques
    { id: "grd-9", eval_id: "eval-3a-sp-1", student_id: "stu-2026-001", score: 14.5, comment: "Bonne démarche scientifique." },
    { id: "grd-10", eval_id: "eval-3a-sp-1", student_id: "stu-2026-004", score: 18.0, comment: "Parfait." },
    { id: "grd-11", eval_id: "eval-3a-sp-1", student_id: "stu-2026-005", score: 12.0, comment: "Assez bien." },
    { id: "grd-12", eval_id: "eval-3a-sp-1", student_id: "stu-2026-006", score: 7.5, comment: "Des lacunes à combler." }
  ],

  // Registre des Absences
  attendance: [
    { id: "att-1", student_id: "stu-2026-001", date: "2026-10-12", slot: "Matinée", status: "PRESENT", reason: "" },
    { id: "att-2", student_id: "stu-2026-004", date: "2026-10-12", slot: "Matinée", status: "PRESENT", reason: "" },
    { id: "att-3", student_id: "stu-2026-005", date: "2026-10-12", slot: "Matinée", status: "ABSENT_JUSTIFIE", reason: "Visite médicale certifiée" },
    { id: "att-4", student_id: "stu-2026-006", date: "2026-10-12", slot: "Matinée", status: "RETARD", reason: "Embouteillages Boulevard Mitterrand (20 min)" }
  ],

  // Emploi du Temps Hebdomadaire (3e A)
  schedules: [
    { id: "sch-1", class_id: "cls-3a", day: 1, day_name: "Lundi", start: "07:30", end: "09:30", subject: "Mathématiques", teacher: "M. KOFFI Yao", room: "Salle 204" },
    { id: "sch-2", class_id: "cls-3a", day: 1, day_name: "Lundi", start: "09:45", end: "11:45", subject: "Français", teacher: "Mme. ADOU", room: "Salle 204" },
    { id: "sch-3", class_id: "cls-3a", day: 1, day_name: "Lundi", start: "13:30", end: "15:30", subject: "Physique - Chimie", teacher: "Dr. BAMBA", room: "Labo Sciences" },
    { id: "sch-4", class_id: "cls-3a", day: 2, day_name: "Mardi", start: "07:30", end: "09:30", subject: "Histoire - Géo", teacher: "M. KOUAME", room: "Salle 204" },
    { id: "sch-5", class_id: "cls-3a", day: 2, day_name: "Mardi", start: "09:45", end: "11:45", subject: "Anglais", teacher: "Mme. COULIBALY", room: "Salle 204" },
    { id: "sch-6", class_id: "cls-3a", day: 2, day_name: "Mardi", start: "14:00", end: "16:00", subject: "EPS (Sport)", teacher: "M. GOHOU", room: "Terrain Omnisports" },
    { id: "sch-7", class_id: "cls-3a", day: 3, day_name: "Mercredi", start: "07:30", end: "09:30", subject: "Mathématiques", teacher: "M. KOFFI Yao", room: "Salle 204" },
    { id: "sch-8", class_id: "cls-3a", day: 3, day_name: "Mercredi", start: "09:45", end: "11:45", subject: "SVT", teacher: "Dr. BAMBA", room: "Salle 204" },
    { id: "sch-9", class_id: "cls-3a", day: 4, day_name: "Jeudi", start: "07:30", end: "09:30", subject: "Français", teacher: "Mme. ADOU", room: "Salle 204" },
    { id: "sch-10", class_id: "cls-3a", day: 4, day_name: "Jeudi", start: "13:30", end: "15:30", subject: "Sciences Physiques", teacher: "Dr. BAMBA", room: "Labo Sciences" },
    { id: "sch-11", class_id: "cls-3a", day: 5, day_name: "Vendredi", start: "07:30", end: "09:30", subject: "Anglais", teacher: "Mme. COULIBALY", room: "Salle 204" },
    { id: "sch-12", class_id: "cls-3a", day: 5, day_name: "Vendredi", start: "09:45", end: "11:45", subject: "Histoire - Géo", teacher: "M. KOUAME", room: "Salle 204" }
  ],

  // Module Financier en FCFA & Échéanciers par Tranches
  payments: [
    {
      id: "pay-001",
      receipt_number: "REC-2026-000001",
      student_id: "stu-2026-001",
      amount: 50000,
      fee_category: "Frais d'Inscription & Dossier",
      date: "2026-09-02",
      mode: "WAVE",
      reference: "WAVE-CI-998241",
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    },
    {
      id: "pay-002",
      receipt_number: "REC-2026-000002",
      student_id: "stu-2026-001",
      amount: 100000,
      fee_category: "1ère Tranche Scolarité",
      date: "2026-09-05",
      mode: "ORANGE_MONEY",
      reference: "OM-CI-441290",
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    },
    {
      id: "pay-003",
      receipt_number: "REC-2026-000003",
      student_id: "stu-2026-001",
      amount: 100000,
      fee_category: "2ème & 3ème Tranches (Solde)",
      date: "2026-10-02",
      mode: "VIREMENT_BANCAIRE",
      reference: "VIR-SGBCI-88210",
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    },
    {
      id: "pay-004",
      receipt_number: "REC-2026-000004",
      student_id: "stu-2026-004",
      amount: 250000,
      fee_category: "Scolarité Annuelle Intégrale",
      date: "2026-09-01",
      mode: "CHEQUE",
      reference: "CHQ-NSIA-120045",
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    },
    {
      id: "pay-005",
      receipt_number: "REC-2026-000005",
      student_id: "stu-2026-005",
      amount: 150000,
      fee_category: "Inscription + 1ère Tranche",
      date: "2026-09-10",
      mode: "MTN_MOMO",
      reference: "MOMO-CI-773120",
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    },
    {
      id: "pay-006",
      receipt_number: "REC-2026-000006",
      student_id: "stu-2026-006",
      amount: 50000,
      fee_category: "Frais d'Inscription (Acompte)",
      date: "2026-09-12",
      mode: "ESPECES",
      reference: "ESP-CAISSE-004",
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    },
    {
      id: "pay-007",
      receipt_number: "REC-2026-000007",
      student_id: "stu-2026-007",
      amount: 280000,
      fee_category: "Scolarité Terminale Solde Complet",
      date: "2026-09-03",
      mode: "WAVE",
      reference: "WAVE-CI-552011",
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    }
  ],

  // Annonces & Circulaires Officielles
  announcements: [
    {
      id: "anc-01",
      title: "Rentrée Académique 2026-2027 & Réunions avec les Parents",
      content: "Chers parents d'élèves, l'administration du Groupe Scolaire Horizon vous souhaite la bienvenue pour cette nouvelle année scolaire. Les rencontres pédagogiques de rentrée débuteront le samedi 10 octobre à 09h00 dans la grande salle polyvalente.",
      target: "TOUS",
      target_label: "Tous les Parents & Enseignants",
      date: "2026-09-15 08:30",
      published_by: "M. KOUASSI (Direction)"
    },
    {
      id: "anc-02",
      title: "Échéance de paiement de la 2ème Tranche de Scolarité",
      content: "Rappel : la 2ème tranche des frais de scolarité arrive à échéance le 15 décembre 2026. Les règlements peuvent être effectués directement à la caisse ou via Mobile Money (Wave / Orange Money / MTN MoMo).",
      target: "PARENTS",
      target_label: "Parents d'élèves",
      date: "2026-10-01 10:00",
      published_by: "Service Comptabilité"
    },
    {
      id: "anc-03",
      title: "Arrêt des notes du 1er Trimestre & Conseils de Classe",
      content: "Messieurs et Mesdames les professeurs, la date limite de saisie et de validation des notes pour le 1er Trimestre est fixée au vendredi 04 décembre 2026 à 18h00.",
      target: "ENSEIGNANTS",
      target_label: "Corps Professoral",
      date: "2026-10-18 14:00",
      published_by: "Direction des Études"
    }
  ]
};

// Gestionnaire Singleton de Base de Données
class EcoliaStore {
  constructor() {
    this.data = this.loadDatabase();
  }

  loadDatabase() {
    try {
      const saved = localStorage.getItem(ECOLIA_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Erreur de chargement localStorage, utilisation des données initiales", e);
    }
    this.saveDatabase(INITIAL_ECOLIA_DB);
    return JSON.parse(JSON.stringify(INITIAL_ECOLIA_DB));
  }

  saveDatabase(customData = null) {
    if (customData) {
      this.data = customData;
    }
    try {
      localStorage.setItem(ECOLIA_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Échec de la persistance des données", e);
    }
  }

  resetDemo() {
    this.data = JSON.parse(JSON.stringify(INITIAL_ECOLIA_DB));
    this.saveDatabase();
  }
}

const ecoliaDB = new EcoliaStore();
