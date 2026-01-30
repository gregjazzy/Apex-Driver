# 📚 Documentation Technique - Apex Coaching

## 🎯 Architecture de l'application

### Vue d'ensemble

L'application utilise une architecture client-serveur moderne avec Next.js 14 (App Router) et Supabase comme backend.

```
Client (Next.js)
    ↓
Supabase Client SDK
    ↓
Supabase (Auth + Database + Realtime)
    ↓
PostgreSQL avec RLS
```

## 🔧 Hooks personnalisés

### `useTasks(studentId: string | null)`

Hook pour gérer les tâches avec synchronisation temps réel.

**Paramètres:**
- `studentId`: ID de l'élève dont on veut charger les tâches

**Retour:**
```typescript
{
  tasks: Task[]           // Liste des tâches
  loading: boolean        // État de chargement
  toggleTask: (taskId, currentStatus) => Promise<void>
  addTask: (title, priority) => Promise<void>
  deleteTask: (taskId) => Promise<void>
}
```

**Fonctionnalités:**
- ✅ Chargement initial des tâches
- ✅ Abonnement Realtime aux changements
- ✅ Mise à jour optimiste de l'UI
- ✅ Gestion automatique de la souscription

**Exemple d'utilisation:**
```typescript
const { tasks, loading, toggleTask, addTask } = useTasks(studentId)

// Ajouter une tâche
await addTask("Finir les devoirs de maths", 1)

// Toggler une tâche
await toggleTask(task.id, task.status)
```

### `usePomodoroSessions(studentId: string | null)`

Hook pour gérer les sessions Pomodoro.

**Paramètres:**
- `studentId`: ID de l'élève

**Retour:**
```typescript
{
  sessions: PomodoroSession[]  // Liste des sessions
  loading: boolean
  createSession: (duration, status) => Promise<void>
  getTotalCompletedTime: () => number
  getCompletedSessionsCount: () => number
}
```

**Exemple:**
```typescript
const { createSession, getTotalCompletedTime } = usePomodoroSessions(userId)

// Créer une session complétée
await createSession(25, 'completed')

// Obtenir le temps total
const totalMinutes = getTotalCompletedTime()
```

### `useProfile()`

Hook pour obtenir le profil de l'utilisateur connecté.

**Retour:**
```typescript
{
  profile: Profile | null
  loading: boolean
  isCoach: boolean
}
```

## 🗂️ Types TypeScript

### Profile
```typescript
type Profile = {
  id: string              // UUID de l'utilisateur
  role: 'coach' | 'student'
  full_name: string
  created_at: string
  updated_at: string
}
```

### Task
```typescript
type Task = {
  id: string
  student_id: string      // Référence au profil
  title: string
  status: boolean         // true = complété
  priority: 1 | 2 | 3    // 1=Urgent, 2=Important, 3=Normal
  created_at: string
  updated_at: string
}
```

### PomodoroSession
```typescript
type PomodoroSession = {
  id: string
  student_id: string
  duration: number                    // En minutes
  status: 'completed' | 'abandoned'
  created_at: string
}
```

## 🔐 Sécurité - Row Level Security

### Philosophie

Chaque table utilise RLS pour garantir que :
- Les élèves ne voient **que** leurs propres données
- Les coaches voient **toutes** les données
- Les modifications sont auditées automatiquement

### Exemple de politique RLS

```sql
-- Les élèves voient uniquement leurs tâches
CREATE POLICY "Students can view own tasks"
ON tasks FOR SELECT
USING (
  student_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'coach'
  )
);
```

## 🚀 Realtime Subscriptions

### Fonctionnement

Supabase Realtime utilise PostgreSQL's `LISTEN/NOTIFY` pour propager les changements en temps réel.

```typescript
// Abonnement aux changements
const channel = supabase
  .channel(`tasks:student_id=eq.${studentId}`)
  .on('postgres_changes', {
    event: '*',           // INSERT, UPDATE, DELETE
    schema: 'public',
    table: 'tasks',
    filter: `student_id=eq.${studentId}`
  }, (payload) => {
    // Mise à jour de l'état local
  })
  .subscribe()
```

### Événements supportés

- `INSERT`: Nouvelle ligne créée
- `UPDATE`: Ligne modifiée
- `DELETE`: Ligne supprimée
- `*`: Tous les événements

## 🎨 Composants UI

### `<ActionPlan>`

Composant principal pour gérer les tâches.

**Props:**
```typescript
interface ActionPlanProps {
  studentId: string
  isCoach?: boolean      // Active le mode édition
  studentName?: string   // Affiché dans le header
}
```

**Fonctionnalités:**
- ✅ Liste des tâches avec tri par priorité
- ✅ Checkbox interactive avec confettis
- ✅ Barre de progression
- ✅ Mode coach : ajout/suppression de tâches
- ✅ Sync temps réel automatique

### `<PomodoroTimer>`

Timer Pomodoro circulaire avec tracking.

**Props:**
```typescript
interface PomodoroTimerProps {
  studentId: string
}
```

**Fonctionnalités:**
- ✅ Timer circulaire SVG animé
- ✅ 3 modes : Pomodoro (25m), Pause courte (5m), Pause longue (15m)
- ✅ Enregistrement automatique des sessions
- ✅ Statistiques en temps réel
- ✅ Notifications de fin (si autorisées)

## 🔄 Flux de données

### Création d'une tâche (Coach)

```
1. Coach clique "Ajouter"
2. addTask() appelé
   ↓
3. INSERT dans Supabase
   ↓
4. Trigger Realtime
   ↓
5. Hook useTasks reçoit l'événement
   ↓
6. État local mis à jour
   ↓
7. UI re-render (Coach ET Élève)
   ↓
8. Tâche visible instantanément
```

### Complétion d'une tâche (Élève)

```
1. Élève coche la tâche
2. toggleTask() appelé
   ↓
3. UPDATE dans Supabase
   ↓
4. Trigger Realtime
   ↓
5. Confettis ! 🎉
   ↓
6. Coach voit le changement en direct
```

## 🧪 Testing (à implémenter)

### Tests unitaires recommandés

```typescript
// hooks/useTasks.test.ts
describe('useTasks', () => {
  it('should load tasks on mount', async () => {
    // Test du chargement initial
  })

  it('should update tasks on realtime event', async () => {
    // Test de la sync realtime
  })
})
```

### Tests E2E recommandés

Avec Playwright ou Cypress :
- Inscription Coach
- Inscription Élève
- Création de tâche
- Vérification sync temps réel
- Pomodoro complet

## 📊 Performance

### Optimisations appliquées

1. **Subscriptions Realtime**
   - Un seul canal par élève
   - Nettoyage automatique (cleanup)

2. **Queries Supabase**
   - Index sur `student_id`
   - Index sur `created_at`
   - RLS optimisé avec EXISTS

3. **React**
   - useCallback pour les fonctions
   - Memoization des composants lourds (à venir)

### Métriques cibles

- Temps de chargement initial : < 2s
- Latence Realtime : < 100ms
- First Contentful Paint : < 1.5s

## 🔧 Configuration avancée

### Variables d'environnement

```env
# Obligatoires
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Optionnelles (production)
NEXT_PUBLIC_APP_URL=https://apex-coaching.app
```

### Middleware

Le middleware vérifie l'authentification sur toutes les routes sauf :
- `/auth/*`
- `/` (page d'accueil)
- Assets statiques

## 🚀 Évolutions futures

### V2 - Fonctionnalités prévues

- [ ] Upload de fichiers (devoirs)
- [ ] Chat en temps réel Coach ↔ Élève
- [ ] Calendrier partagé
- [ ] Gamification (badges, streak)
- [ ] Rapports hebdomadaires automatiques
- [ ] Mode dark
- [ ] Application mobile (React Native)
- [ ] Notifications push

### V3 - Avancées

- [ ] IA pour suggestions de tâches
- [ ] Analytics avancés
- [ ] Intégration Google Calendar
- [ ] API publique
- [ ] Mode multi-coach

## 📚 Ressources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Shadcn/UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

Pour toute question, consultez le README.md ou ouvrez une issue !
