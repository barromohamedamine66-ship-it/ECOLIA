# 🏫 ÉCOLIA — *L'école, simplement.*

> **Plateforme numérique SaaS de gestion des établissements scolaires**, conçue en Côte d'Ivoire et pensée pour l'Afrique francophone.

---

## 🌟 Présentation

**ÉCOLIA** est une solution SaaS tout-en-un moderne, multi-tenant et sécurisée permettant aux groupes scolaires et établissements privés (Primaire, Collège, Lycée) de piloter l'intégralité de leur activité pédagogique, administrative et financière :

- 📊 **Tableau de bord de direction** : Indicateurs clés temps réel (effectifs, taux de présence, recouvrement financier, impayés).
- 👨‍🎓 **Gestion de la Scolarité** : Élèves avec matricules uniques (`ECO-2026-XXXXX`), parents tuteurs multi-enfants, enseignants, classes et coefficients.
- 📝 **Pédagogie & Évaluations** : Saisie rapide des notes, calcul automatique des moyennes pondérées par matière et générale, validation à 3 niveaux (*Brouillon*, *Soumis*, *Validé*).
- 📑 **Bulletins Scolaires Officiels A4** : Conformes aux normes du Ministère de l'Éducation Nationale et de l'Alphabétisation (MENA) de Côte d'Ivoire avec QR Code, moyennes min/max de classe, appréciations et mentions.
- ⏱️ **Présence & Absences** : Appel en 1 clic optimisé mobile/tablette avec justification et calcul des taux d'assiduité.
- 💰 **Finances en FCFA & Caisse** : Échéanciers par tranches configurables, enregistrement des paiements (Espèces, Virement, Wave, Orange Money, MTN MoMo), gestion des impayés et édition instantanée de reçus certifiés (`REC-2026-XXXXXX`).
- 👥 **Portails Dédiés (RBAC)** : Espaces personnalisés pour la **Direction**, le **Secrétariat**, la **Comptabilité**, l'**Enseignant**, le **Parent** et l'**Élève**.
- 📢 **Communication & Notifications** : Annonces ciblées par audience (établissement, parents, enseignants, élèves, classes) et centre de notifications in-app avec gestion du badge non lu et protection anti-doublon.
- 🔐 **Coffre-fort Documentaire Sécurisé** : Stockage privé Supabase Storage (`ecolia-documents`), URLs signées temporaires, classement par catégorie et archivage.

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router), TypeScript strict, Tailwind CSS, Lucide Icons, Chart.js.
- **Backend / Base de données** : Supabase (PostgreSQL 15), Supabase Auth, Row Level Security (RLS) multi-tenant par `school_id`, Supabase Storage privé.
- **Devise native** : Franc CFA (FCFA / XOF).
- **Prêt pour le déploiement** : Vercel + Supabase Cloud.

---

## 🚀 Guide de Déploiement & Mise en Production

### 1. Configuration Supabase Cloud
1. Créez un nouveau projet sur [Supabase](https://supabase.com).
2. Rendez-vous dans le **SQL Editor** et exécutez dans l'ordre :
   - [`supabase/migrations/01_schema.sql`](file:///C:/Users/DAVIDPC/.gemini/antigravity-ide/scratch/ecolia/supabase/migrations/01_schema.sql) (Création des 27+ tables, types et index)
   - [`supabase/migrations/02_rls_policies.sql`](file:///C:/Users/DAVIDPC/.gemini/antigravity-ide/scratch/ecolia/supabase/migrations/02_rls_policies.sql) (Politiques de sécurité RLS et Storage)
   - *(Optionnel pour tester)* [`supabase/seed.sql`](file:///C:/Users/DAVIDPC/.gemini/antigravity-ide/scratch/ecolia/supabase/seed.sql) (Jeu de données initial pour le Groupe Scolaire Horizon)
3. Dans la section **Storage**, vérifiez que le bucket `ecolia-documents` est créé et configuré en mode **PRIVATE**.

### 2. Variables d'Environnement
Créez votre fichier `.env.local` à partir de `.env.example` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_publique
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_NAME="ÉCOLIA"
NEXT_PUBLIC_DEFAULT_CURRENCY="FCFA"
```

> ⚠️ **Sécurité** : Ne JAMAIS exposer la clé `SUPABASE_SERVICE_ROLE_KEY` dans le frontend ou sous le préfixe `NEXT_PUBLIC_`.

### 3. Lancement Local / Tests
```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Vérification du build de production
npm run build
```

### 4. Déploiement sur Vercel
1. Importez votre dépôt Git dans le dashboard [Vercel](https://vercel.com).
2. Configurez le framework sur **Next.js** (App Router détecté automatiquement).
3. Renseignez les variables d'environnement `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et `NEXT_PUBLIC_APP_ENV=production`.
4. Lancez le déploiement.

---

## 🔑 Rôles & Matrice de Sécurité (RBAC)

| Rôle | Espace | Droits Clés |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | Global | Administration multi-établissements |
| `SCHOOL_ADMIN` / `DIRECTOR` | Direction | Supervision 360°, validation des notes, finances, annonces, documents |
| `SECRETARY` | Scolarité | Inscriptions, fiches élèves, gestion des classes, édition des bulletins |
| `ACCOUNTANT` | Caisse | Frais de scolarité, encaissements, reçus, gestion des impayés (aucun accès aux notes) |
| `TEACHER` | Enseignant | Saisie des notes de ses classes, feuille d'appel, emploi du temps (aucun accès aux finances) |
| `PARENT` | Famille | Consultation des notes, bulletins, absences et reçus de ses enfants uniquement |
| `STUDENT` | Élève | Consultation de son emploi du temps, ses devoirs, notes et bulletins personnels |

---

*ÉCOLIA © 2026 — L'école, simplement.*  
*Développé avec fierté pour l'éducation en Côte d'Ivoire et en Afrique francophone.*

