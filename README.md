# 🎓 Apex Coaching - Application Multi-Tenant

Application de coaching moderne pour accompagner les élèves (10-18 ans) avec un système de gestion de tâches en temps réel et un timer Pomodoro intégré.

## 🚀 Stack Technologique

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Supabase (Auth + Database + Realtime)
- **UI**: Shadcn/UI + Tailwind CSS
- **Animations**: canvas-confetti

## ✨ Fonctionnalités

### 👨‍🏫 Dashboard Coach
- Vue d'ensemble de tous les élèves
- Accès au dashboard individuel de chaque élève
- Création et gestion de tâches pour les élèves
- Suivi en temps réel de leur progression
- Statistiques détaillées (tâches complétées, temps Pomodoro)

### 🎓 Dashboard Élève
- Liste de tâches synchronisée en temps réel
- Timer Pomodoro circulaire interactif
- Confettis lors de la complétion de tâches
- Suivi personnel de la progression

### 🔐 Authentification
- Inscription avec rôle (Coach ou Élève)
- Connexion sécurisée via Supabase Auth
- Redirection automatique selon le rôle

### ⚡ Temps Réel
- Synchronisation instantanée des tâches
- Le coach et l'élève voient les modifications en direct
- Mise à jour automatique des statistiques

## 📦 Installation

### 1. Cloner le projet

```bash
cd /chemin/vers/Apex-Driver
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

#### A. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL** et votre **anon key**

#### B. Configurer les variables d'environnement

Copiez le fichier `.env.example` en `.env.local` et remplacez les valeurs :

```bash
cp .env.example .env.local
```

Éditez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
```

#### C. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez tout le contenu du fichier `supabase/schema.sql`
3. Exécutez le script

Cela va créer :
- Les tables `profiles`, `tasks`, `pomodoro_sessions`
- Les politiques RLS (Row Level Security)
- Les triggers automatiques
- Les fonctions utilitaires

#### D. Activer Realtime

1. Dans Supabase, allez dans **Database** → **Replication**
2. Activez la réplication pour les tables :
   - `tasks`
   - `pomodoro_sessions`

## 🎯 Lancer l'application

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build production

```bash
npm run build
npm start
```

## 📖 Guide d'utilisation

### Première connexion

1. **Créer un compte Coach**
   - Allez sur `/auth/signup`
   - Remplissez le formulaire
   - Sélectionnez "Coach"
   - Validez

2. **Créer des comptes Élèves**
   - Les élèves peuvent s'inscrire directement via `/auth/signup`
   - Ou vous pouvez les créer depuis le SQL Editor de Supabase

### Dashboard Coach

- **Vue principale** : Liste de tous vos élèves
- **Clic sur un élève** : Accède à son dashboard personnel
- **Gestion des tâches** :
  - Cliquez sur "Ajouter une tâche"
  - Renseignez le titre et la priorité (Urgent, Important, Normal)
  - La tâche apparaît instantanément chez l'élève
- **Cocher une tâche** : Visible en temps réel par l'élève

### Dashboard Élève

- **Plan d'Action** :
  - Visualise tes tâches en temps réel
  - Coche les tâches complétées (confettis ! 🎉)
  - Les modifications du coach apparaissent instantanément

- **Timer Pomodoro** :
  - Choisis un mode : Pomodoro (25min), Pause Courte (5min), Pause Longue (15min)
  - Clique sur "Démarrer"
  - Le timer enregistre automatiquement tes sessions
  - Visualise tes statistiques (sessions complétées, minutes totales)

## 🎨 Design System - "Super Friendly"

### Palette de couleurs Pastel Techno

- **Indigo → Purple** : Actions principales, plan d'action
- **Teal → Cyan** : Pauses courtes, éléments secondaires
- **Amber → Orange** : Pauses longues, alertes positives

### Composants

- **Rounded-3xl** : Tous les cards et boutons principaux
- **Ombres douces** : `shadow-lg` pour la profondeur
- **Feedback visuel** : Confettis, transitions fluides, hovers marqués
- **Typographie grande** : Lisibilité maximale pour les jeunes élèves

## 🏗️ Architecture

```
/app
  /auth
    /login          # Page de connexion
    /signup         # Page d'inscription
  /dashboard
    page.tsx        # Redirection automatique selon le rôle
    /coach          # Dashboard coach
    /student        # Dashboard élève
  globals.css       # Styles globaux + thème Super Friendly
  layout.tsx        # Layout principal
  page.tsx          # Page d'accueil

/components
  ActionPlan.tsx         # Composant Plan d'Action
  PomodoroTimer.tsx      # Composant Timer Pomodoro
  /ui                    # Composants Shadcn/UI

/hooks
  useTasks.ts            # Hook pour les tâches + Realtime
  usePomodoroSessions.ts # Hook pour les sessions Pomodoro
  useProfile.ts          # Hook pour le profil utilisateur

/lib
  /supabase
    client.ts       # Client Supabase (browser)
    server.ts       # Client Supabase (server)
  database.types.ts # Types TypeScript générés
  utils.ts          # Utilitaires

/supabase
  schema.sql        # Schéma complet de la base de données

middleware.ts       # Middleware d'authentification
```

## 🔒 Sécurité - Row Level Security (RLS)

### Policies appliquées

**Profiles**
- Les utilisateurs voient leur propre profil
- Les coaches voient tous les profils
- Les coaches peuvent créer des profils

**Tasks**
- Les élèves voient uniquement leurs tâches
- Les coaches voient toutes les tâches
- Les coaches peuvent créer/modifier/supprimer toutes les tâches
- Les élèves peuvent modifier leurs propres tâches

**Pomodoro Sessions**
- Les élèves voient uniquement leurs sessions
- Les coaches voient toutes les sessions
- Les élèves peuvent créer et modifier leurs sessions

## 🚀 Déploiement

### Vercel (recommandé)

1. Connectez votre repository GitHub
2. Ajoutez les variables d'environnement dans Vercel
3. Déployez !

```bash
# Ou en ligne de commande
vercel
```

### Autres plateformes

L'application est compatible avec toutes les plateformes supportant Next.js 14 :
- Netlify
- Railway
- AWS Amplify
- Etc.

## 🐛 Troubleshooting

### Les modifications ne se synchronisent pas

- Vérifiez que Realtime est activé sur Supabase
- Vérifiez la console : il ne doit pas y avoir d'erreurs de connexion
- Vérifiez que les politiques RLS sont bien configurées

### Erreur de connexion Supabase

- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que l'URL et la clé anon sont bien configurées dans `.env.local`

### Les tâches ne s'affichent pas

- Vérifiez les politiques RLS dans Supabase
- Vérifiez que l'utilisateur est bien authentifié
- Regardez la console pour les erreurs

## 📝 Licence

MIT

## 👨‍💻 Auteur

Créé avec ❤️ pour les coachs et leurs élèves motivés !

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ou consultez la [documentation Supabase](https://supabase.com/docs).
