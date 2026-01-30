# 🏗️ Structure du Projet - Apex Coaching

## 📁 Arborescence complète

```
apex-coaching/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 auth/                     # Pages d'authentification
│   │   ├── 📂 login/
│   │   │   └── page.tsx            # Page de connexion
│   │   └── 📂 signup/
│   │       └── page.tsx            # Page d'inscription
│   │
│   ├── 📂 dashboard/                # Dashboards protégés
│   │   ├── page.tsx                # Redirection automatique par rôle
│   │   ├── 📂 coach/
│   │   │   └── page.tsx            # Dashboard coach (liste élèves)
│   │   └── 📂 student/
│   │       └── page.tsx            # Dashboard élève (tâches + pomodoro)
│   │
│   ├── layout.tsx                   # Layout global (fonts, metadata)
│   ├── page.tsx                     # Page d'accueil marketing
│   └── globals.css                  # Styles globaux + thème Super Friendly
│
├── 📂 components/                   # Composants React
│   ├── ActionPlan.tsx              # ⭐ Composant Plan d'Action (tâches en temps réel)
│   ├── PomodoroTimer.tsx           # ⭐ Composant Timer Pomodoro circulaire
│   └── 📂 ui/                       # Composants Shadcn/UI
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       ├── dropdown-menu.tsx
│       └── separator.tsx
│
├── 📂 hooks/                        # Hooks personnalisés
│   ├── useTasks.ts                 # ⭐ Hook tâches + sync Realtime
│   ├── usePomodoroSessions.ts      # ⭐ Hook sessions Pomodoro + stats
│   └── useProfile.ts               # Hook profil utilisateur + rôle
│
├── 📂 lib/                          # Utilitaires et configuration
│   ├── 📂 supabase/
│   │   ├── client.ts               # Client Supabase (browser)
│   │   └── server.ts               # Client Supabase (server components)
│   ├── database.types.ts           # ⭐ Types TypeScript des tables
│   └── utils.ts                    # Utilitaires (cn, etc.)
│
├── 📂 supabase/                     # Configuration Supabase
│   └── schema.sql                  # ⭐ Schéma complet avec RLS
│
├── 📄 middleware.ts                 # ⭐ Middleware auth (routes protégées)
│
├── 📄 .env.local                    # Variables d'environnement (gitignored)
├── 📄 .env.example                  # Template des variables
│
├── 📄 package.json                  # Dépendances npm
├── 📄 tsconfig.json                 # Configuration TypeScript
├── 📄 tailwind.config.ts            # Configuration Tailwind
├── 📄 postcss.config.mjs            # Configuration PostCSS
├── 📄 components.json               # Configuration Shadcn/UI
├── 📄 next.config.ts                # Configuration Next.js
│
├── 📄 README.md                     # ⭐ Documentation principale
├── 📄 SUPABASE_SETUP.md            # ⭐ Guide setup Supabase
├── 📄 DOCUMENTATION.md             # ⭐ Documentation technique
└── 📄 .gitignore                    # Fichiers ignorés par Git
```

## 🎯 Fichiers clés (⭐)

### 1. Configuration Backend

#### `supabase/schema.sql`
- **Rôle** : Schéma PostgreSQL complet
- **Contenu** :
  - Tables : `profiles`, `tasks`, `pomodoro_sessions`
  - Politiques RLS (sécurité)
  - Triggers automatiques
  - Fonctions utilitaires
  - Configuration Realtime

#### `lib/database.types.ts`
- **Rôle** : Types TypeScript pour la base de données
- **Usage** : Typage fort dans toute l'application

### 2. Authentification

#### `middleware.ts`
- **Rôle** : Protection des routes
- **Fonctionnement** :
  - Vérifie la session Supabase
  - Redirige vers `/auth/login` si non connecté
  - Redirige vers `/dashboard` si déjà connecté

### 3. Hooks Temps Réel

#### `hooks/useTasks.ts`
- **Responsabilités** :
  - Charger les tâches d'un élève
  - S'abonner aux changements Realtime
  - CRUD tâches (create, update, delete)
- **Realtime** : ✅ Sync bidirectionnelle instantanée

#### `hooks/usePomodoroSessions.ts`
- **Responsabilités** :
  - Charger l'historique des sessions
  - Créer de nouvelles sessions
  - Calculer les statistiques
- **Realtime** : ✅ Nouvelles sessions visibles instantanément

### 4. Composants Principaux

#### `components/ActionPlan.tsx`
- **Props** :
  - `studentId`: string
  - `isCoach`: boolean (mode édition)
  - `studentName`: string (optionnel)
- **Fonctionnalités** :
  - Liste interactive des tâches
  - Tri par priorité
  - Barre de progression
  - Confettis à la complétion
  - Mode coach : ajout/suppression

#### `components/PomodoroTimer.tsx`
- **Props** :
  - `studentId`: string
- **Fonctionnalités** :
  - Timer circulaire SVG animé
  - 3 modes : Pomodoro, Pause courte, Pause longue
  - Enregistrement auto des sessions
  - Stats en temps réel
  - Notifications fin de timer

### 5. Pages Principales

#### `app/page.tsx`
- **Type** : Page publique
- **Rôle** : Landing page marketing
- **Design** : Thème Super Friendly

#### `app/dashboard/coach/page.tsx`
- **Type** : Page protégée (coach uniquement)
- **Fonctionnalités** :
  - Liste de tous les élèves
  - Clic → Dashboard individuel d'un élève
  - Stats par élève

#### `app/dashboard/student/page.tsx`
- **Type** : Page protégée (élève uniquement)
- **Fonctionnalités** :
  - Plan d'Action personnel
  - Timer Pomodoro
  - Stats personnelles

## 🔄 Flux de données

### Flux d'authentification

```
1. Utilisateur → /auth/signup
2. Supabase Auth → Créer utilisateur
3. Trigger SQL → Créer profil automatiquement
4. Redirect → /dashboard (middleware redirige selon le rôle)
```

### Flux de synchronisation temps réel

```
Coach crée une tâche
    ↓
INSERT dans Supabase
    ↓
PostgreSQL trigger Realtime
    ↓
Notification Supabase Realtime
    ↓
Hook useTasks (Coach) → État mis à jour
Hook useTasks (Élève) → État mis à jour
    ↓
UI re-render (les deux)
    ↓
Tâche visible instantanément partout
```

## 🎨 Design System

### Thème "Super Friendly"

Défini dans `app/globals.css` :

- **Rounded-3xl** : Tous les cards principaux
- **Ombres douces** : `shadow-lg`, `shadow-xl`
- **Gradients Pastel Techno** :
  - Indigo → Purple (actions principales)
  - Teal → Cyan (pauses, éléments secondaires)
  - Amber → Orange (alertes positives)

### Composants UI

Tous les composants UI de base proviennent de **Shadcn/UI** :
- Design system cohérent
- Accessible (ARIA)
- Customisable via Tailwind

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS :

- **Élèves** : Accès uniquement à leurs propres données
- **Coaches** : Accès à toutes les données
- **Vérification** : `auth.uid()` dans les policies SQL

### Middleware

- Toutes les routes `/dashboard/*` sont protégées
- Vérification de session à chaque requête
- Redirection automatique si non authentifié

## 📊 Performance

### Optimisations appliquées

1. **Realtime**
   - Un canal par élève (pas de canal global)
   - Cleanup automatique des subscriptions

2. **Database**
   - Index sur `student_id`
   - Index sur `created_at`
   - RLS optimisé

3. **React**
   - useCallback pour éviter re-renders
   - Composants légers

## 🚀 Déploiement

### Prérequis

1. Projet Supabase configuré (voir `SUPABASE_SETUP.md`)
2. Variables d'environnement configurées
3. Build Next.js réussi

### Commandes

```bash
# Développement
npm run dev

# Build production
npm run build
npm start

# Type-check
npm run type-check

# Lint
npm run lint
```

## 📚 Documentation

- **README.md** : Guide utilisateur complet
- **SUPABASE_SETUP.md** : Configuration Supabase pas à pas
- **DOCUMENTATION.md** : Documentation technique détaillée
- **PROJECT_STRUCTURE.md** : Ce fichier

## 🔮 Prochaines étapes

Pour étendre l'application :

1. **Ajouter une table** → Créer migration SQL + types TS
2. **Ajouter un hook** → Créer dans `/hooks` avec Realtime
3. **Ajouter une page** → Créer dans `/app` avec protection
4. **Ajouter un composant** → Créer dans `/components`

---

Besoin d'aide ? Consultez les autres fichiers de documentation !
