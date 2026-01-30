# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2026-01-30

### ✨ Ajouté

#### Architecture
- Configuration Next.js 14 avec App Router
- Configuration Supabase (Auth + Database + Realtime)
- Middleware d'authentification
- Types TypeScript complets pour la base de données
- Système de routing automatique par rôle (coach/student)

#### Base de données
- Table `profiles` (utilisateurs avec rôle)
- Table `tasks` (tâches des élèves)
- Table `pomodoro_sessions` (sessions de travail)
- Politiques RLS (Row Level Security) complètes
- Triggers automatiques pour `updated_at`
- Fonction de création automatique de profil après signup
- Indexes optimisés sur toutes les tables

#### Authentification
- Page d'inscription avec choix du rôle
- Page de connexion
- Redirection automatique après connexion
- Gestion de session sécurisée
- Protection des routes via middleware

#### Dashboard Coach
- Vue liste de tous les élèves
- Accès au dashboard individuel de chaque élève
- Création de tâches pour les élèves
- Suppression de tâches
- Vue des statistiques par élève :
  - Tâches complétées / totales
  - Temps Pomodoro total
  - Taux de complétion
- Synchronisation temps réel avec les élèves

#### Dashboard Élève
- Vue personnelle des tâches
- Checkbox interactive pour compléter les tâches
- Animation confettis lors de la complétion
- Timer Pomodoro circulaire :
  - Mode Pomodoro (25 minutes)
  - Mode Pause Courte (5 minutes)
  - Mode Pause Longue (15 minutes)
  - Enregistrement automatique des sessions
  - Statistiques en temps réel
- Barre de progression des tâches
- Synchronisation temps réel avec le coach

#### Composants
- `<ActionPlan>` : Gestion des tâches avec sync temps réel
- `<PomodoroTimer>` : Timer circulaire avec tracking
- Composants UI Shadcn : Button, Card, Badge, Avatar, Progress, etc.

#### Hooks personnalisés
- `useTasks()` : CRUD tâches + subscription Realtime
- `usePomodoroSessions()` : Gestion sessions + statistiques
- `useProfile()` : Profil utilisateur + vérification rôle

#### Design System
- Thème "Super Friendly" - Pastel Techno
- Palette de couleurs : Indigo, Purple, Teal, Cyan, Amber
- Rounded-3xl sur tous les composants principaux
- Ombres douces et gradients
- Scrollbar personnalisée
- Typographie optimisée pour la lisibilité
- Animations fluides et feedback visuel fort

#### Fonctionnalités Realtime
- Synchronisation instantanée des tâches (bidirectionnelle)
- Mise à jour automatique des statistiques
- Channel Supabase par élève
- Gestion automatique des subscriptions
- Mise à jour optimiste de l'UI

#### Documentation
- README.md complet avec installation
- SUPABASE_SETUP.md détaillé
- DOCUMENTATION.md technique
- PROJECT_STRUCTURE.md
- QUICKSTART.md pour démarrage rapide
- CHANGELOG.md (ce fichier)

### 🔒 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Les élèves ne voient que leurs propres données
- Les coaches voient toutes les données
- Validation des rôles côté serveur
- Protection CSRF via Supabase
- Cookies sécurisés pour la session

### 🎨 UI/UX

- Interface "Super Friendly" adaptée aux jeunes (10-18 ans)
- Design responsive (mobile, tablet, desktop)
- Feedback visuel immédiat sur toutes les actions
- Confettis lors de la complétion de tâches
- Loading states sur tous les composants
- Messages d'erreur clairs et bienveillants
- Transitions fluides entre les pages

### ⚡ Performance

- Build Next.js optimisé
- Images optimisées automatiquement
- Code splitting automatique
- Préchargement des routes
- Indexes database optimisés
- Queries Supabase optimisées
- Subscription Realtime ciblée (pas de canal global)

### 📦 Dépendances principales

- next@16.1.6
- react@19.2.3
- @supabase/supabase-js@2.93.3
- @supabase/ssr@0.8.0
- tailwindcss@4
- lucide-react@0.563.0
- canvas-confetti@1.9.4
- Composants Shadcn/UI

## [Unreleased]

### 🚧 À venir dans la V2

- Upload de fichiers (devoirs, documents)
- Chat en temps réel Coach ↔ Élève
- Calendrier partagé
- Gamification (badges, streak, niveaux)
- Rapports hebdomadaires automatiques
- Mode sombre
- Notifications push
- Application mobile (React Native)
- Support multi-langues (i18n)

### 💡 Idées pour la V3

- Intelligence Artificielle pour suggestions de tâches
- Analytics avancés et insights
- Intégration Google Calendar / Outlook
- API publique REST
- Mode multi-coach (coaching d'équipe)
- Vidéo-conférence intégrée
- Templates de tâches
- Export de rapports PDF

---

## Conventions

- **Ajouté** : nouvelles fonctionnalités
- **Modifié** : changements dans des fonctionnalités existantes
- **Déprécié** : fonctionnalités bientôt supprimées
- **Supprimé** : fonctionnalités supprimées
- **Corrigé** : corrections de bugs
- **Sécurité** : en cas de vulnérabilités

[1.0.0]: https://github.com/apex-coaching/apex-coaching/releases/tag/v1.0.0
