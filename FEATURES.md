# 🎯 Fonctionnalités - Apex Coaching

## 📊 Vue d'ensemble

Apex Coaching est une plateforme complète de coaching pour élèves avec synchronisation temps réel, gestion de tâches et suivi Pomodoro.

---

## 🎭 Rôles et Permissions

### 👨‍🏫 Coach

| Fonctionnalité | Description | Accès |
|----------------|-------------|-------|
| Vue des élèves | Liste complète de tous les élèves | ✅ |
| Dashboard élève | Accès au dashboard de chaque élève | ✅ |
| Créer des tâches | Ajouter des tâches pour un élève | ✅ |
| Modifier des tâches | Cocher/décocher les tâches | ✅ |
| Supprimer des tâches | Retirer des tâches de la liste | ✅ |
| Voir les statistiques | Stats complètes par élève | ✅ |
| Gérer son profil | Modifier ses informations | ✅ |

### 🎓 Élève

| Fonctionnalité | Description | Accès |
|----------------|-------------|-------|
| Voir ses tâches | Liste personnelle des tâches | ✅ |
| Cocher des tâches | Marquer comme complété | ✅ |
| Créer des tâches | Ajouter ses propres tâches | ❌ (V2) |
| Supprimer des tâches | Retirer des tâches | ❌ |
| Timer Pomodoro | Utiliser le timer de concentration | ✅ |
| Voir ses stats | Progression personnelle | ✅ |
| Gérer son profil | Modifier ses informations | ✅ |

---

## 📋 Gestion des Tâches

### Création de Tâche (Coach)

- ✅ Formulaire intuitif
- ✅ Champ titre (texte libre)
- ✅ 3 niveaux de priorité :
  - 🔴 **Urgent** (priorité 1)
  - 🟡 **Important** (priorité 2)
  - 🟢 **Normal** (priorité 3)
- ✅ Attribution automatique à l'élève
- ✅ Apparition instantanée (Realtime)

### Affichage des Tâches

- ✅ Tri automatique par priorité puis date
- ✅ Cards épurées avec typographie grande
- ✅ Badges de couleur par priorité
- ✅ Barre de progression globale
- ✅ Compteur : X/Y tâches complétées
- ✅ Animation au hover

### Complétion de Tâche

- ✅ Checkbox interactive circulaire
- ✅ Feedback visuel immédiat :
  - Checkmark animée
  - Texte barré
  - Opacité réduite
  - **Confettis** 🎉
- ✅ Synchronisation bidirectionnelle temps réel
- ✅ Mise à jour automatique des statistiques

### État de Synchronisation

| Événement | Coach voit | Élève voit |
|-----------|-----------|-----------|
| Coach crée tâche | Immédiat | **Temps réel** |
| Élève coche tâche | **Temps réel** + stats | Immédiat + confettis |
| Coach coche tâche | Immédiat | **Temps réel** |
| Coach supprime tâche | Immédiat | **Temps réel** |

---

## ⏱️ Timer Pomodoro

### Modes Disponibles

| Mode | Durée | Couleur | Usage |
|------|-------|---------|-------|
| 🎯 Pomodoro | 25 minutes | Indigo → Purple | Concentration intense |
| ☕ Pause Courte | 5 minutes | Teal → Cyan | Pause entre Pomodoros |
| 🌴 Grande Pause | 15 minutes | Amber → Orange | Pause après 4 Pomodoros |

### Fonctionnalités du Timer

- ✅ **Timer circulaire SVG** :
  - Animation fluide
  - Progression visuelle
  - Temps affiché au centre (MM:SS)
  - Couleur adaptée au mode

- ✅ **Contrôles** :
  - ▶️ Démarrer
  - ⏸️ Pause
  - 🔄 Reset
  - ❌ Abandonner

- ✅ **Tracking automatique** :
  - Enregistrement à la fin du timer
  - Statut : `completed` ou `abandoned`
  - Durée enregistrée en minutes

- ✅ **Indicateurs visuels** :
  - Points pour compter les Pomodoros (0/4)
  - Auto-switch vers pause après Pomodoro
  - Grande pause tous les 4 Pomodoros

- ✅ **Notifications** (si autorisées) :
  - Notification de fin de timer
  - Message de félicitation

### Statistiques Pomodoro

| Métrique | Description | Visible par |
|----------|-------------|-------------|
| Sessions complétées | Nombre de Pomodoros terminés | Coach + Élève |
| Minutes totales | Temps de concentration cumulé | Coach + Élève |
| Historique | Liste de toutes les sessions | Coach |
| Streak quotidien | Points visuels 0/4 | Élève |

---

## 📊 Statistiques

### Dashboard Coach (par élève)

```
┌─────────────────────────────────────────┐
│  Tâches complétées    │    5           │
├─────────────────────────────────────────┤
│  Tâches totales       │    8           │
├─────────────────────────────────────────┤
│  Minutes Pomodoro     │  125           │
├─────────────────────────────────────────┤
│  Taux de complétion   │  62%           │
└─────────────────────────────────────────┘
```

### Dashboard Élève

```
┌─────────────────────────────────────────┐
│  Sessions complétées  │    7           │
├─────────────────────────────────────────┤
│  Minutes totales      │  175           │
└─────────────────────────────────────────┘
```

---

## 🎨 Design System "Super Friendly"

### Palette Pastel Techno

| Gradient | Usage | Exemple |
|----------|-------|---------|
| Indigo → Purple | Actions principales, tâches | Bouton "Ajouter", Plan d'Action |
| Teal → Cyan | Pauses courtes, éléments secondaires | Pause 5min, badges |
| Amber → Orange | Pauses longues, succès | Pause 15min, alertes positives |

### Composants Visuels

- ✅ **Rounded-3xl** : Tous les cards principaux
- ✅ **Ombres douces** : `shadow-lg`, `shadow-xl`
- ✅ **Bordures épaisses** : `border-2`
- ✅ **Typographie grande** : Titres en 2xl-4xl
- ✅ **Backdrop blur** : Effet de profondeur
- ✅ **Gradients de fond** : Indigo → Purple → Teal
- ✅ **Scrollbar custom** : Gradient Indigo → Purple

### Feedback Visuel

| Action | Feedback |
|--------|----------|
| Tâche complétée | ✅ Checkmark + Barré + **Confettis** |
| Hover sur card | ✅ Ombre + Border colorée |
| Hover sur bouton | ✅ Opacité + Scale |
| Chargement | ✅ Pulse animation |
| Timer en cours | ✅ Cercle progressif animé |

---

## ⚡ Synchronisation Temps Réel

### Architecture

```
Modification (Coach/Élève)
    ↓
Supabase Client SDK
    ↓
PostgreSQL INSERT/UPDATE/DELETE
    ↓
Trigger PostgreSQL → Notification
    ↓
Supabase Realtime (WebSocket)
    ↓
Hook React (useTasks / usePomodoroSessions)
    ↓
État local mis à jour
    ↓
UI Re-render (Coach ET Élève)
```

### Événements synchronisés

- ✅ **INSERT** : Nouvelle tâche créée
- ✅ **UPDATE** : Tâche modifiée (status, title, priority)
- ✅ **DELETE** : Tâche supprimée
- ✅ **Pomodoro** : Nouvelle session enregistrée

### Performance

- Latence : **< 100ms** en moyenne
- Channel dédié par élève (pas de bruit)
- Cleanup automatique des subscriptions
- Mise à jour optimiste de l'UI

---

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS avec ces règles :

#### Table `profiles`
- ✅ Utilisateur voit son propre profil
- ✅ Coach voit tous les profils
- ✅ Coach peut créer des profils

#### Table `tasks`
- ✅ Élève voit uniquement ses tâches
- ✅ Coach voit toutes les tâches
- ✅ Coach peut CRUD toutes les tâches
- ✅ Élève peut UPDATE ses tâches

#### Table `pomodoro_sessions`
- ✅ Élève voit uniquement ses sessions
- ✅ Coach voit toutes les sessions
- ✅ Élève peut créer ses sessions

### Authentification

- ✅ Supabase Auth (email/password)
- ✅ Session sécurisée (cookies httpOnly)
- ✅ Middleware Next.js pour protection des routes
- ✅ Redirection automatique si non authentifié
- ✅ Vérification du rôle côté serveur

---

## 🚀 Performance

### Optimisations appliquées

| Zone | Optimisation |
|------|-------------|
| Database | Index sur student_id, created_at |
| Queries | Select uniquement les colonnes nécessaires |
| Realtime | Channel par élève (pas global) |
| React | useCallback pour fonctions stables |
| Build | Code splitting automatique Next.js |
| Images | Optimisation automatique Next/Image |
| Fonts | Préchargement Geist Sans/Mono |

### Métriques cibles

- ⚡ **First Contentful Paint** : < 1.5s
- ⚡ **Time to Interactive** : < 2s
- ⚡ **Latence Realtime** : < 100ms
- ⚡ **Lighthouse Score** : > 90

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Colonnes empilées |
| Tablet (768px-1024px) | Grid 2 colonnes |
| Desktop (> 1024px) | Grid 2-3 colonnes |

Tous les composants s'adaptent automatiquement à la taille d'écran.

---

## 🔮 Roadmap

### V1.1 (Court terme)
- [ ] Mode sombre
- [ ] Filtres sur les tâches
- [ ] Export PDF des statistiques

### V2.0 (Moyen terme)
- [ ] Upload de fichiers
- [ ] Chat temps réel
- [ ] Calendrier partagé
- [ ] Gamification (badges)
- [ ] Notifications push

### V3.0 (Long terme)
- [ ] Application mobile
- [ ] IA pour suggestions
- [ ] API publique
- [ ] Mode multi-coach

---

## 🎓 Technologies utilisées

| Catégorie | Technologie | Version |
|-----------|------------|---------|
| Framework | Next.js | 16.1.6 |
| Frontend | React | 19.2.3 |
| Backend | Supabase | 2.93.3 |
| Database | PostgreSQL | (via Supabase) |
| Realtime | Supabase Realtime | (WebSocket) |
| Styling | Tailwind CSS | 4.0 |
| UI Components | Shadcn/UI | Latest |
| Icons | Lucide React | 0.563.0 |
| Animations | canvas-confetti | 1.9.4 |
| Language | TypeScript | 5.x |

---

**Apex Coaching** - Coaching moderne pour élèves motivés 🚀
