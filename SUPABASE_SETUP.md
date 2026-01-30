# Configuration Supabase - Instructions détaillées

## 🎯 Objectif

Ce guide vous accompagne pas à pas pour configurer votre instance Supabase pour l'application Apex Coaching.

## 📋 Prérequis

- Un compte Supabase (gratuit) sur [supabase.com](https://supabase.com)
- Accès au SQL Editor de votre projet

## 🔧 Étapes de configuration

### 1. Créer le projet Supabase

1. Connectez-vous sur [supabase.com](https://supabase.com)
2. Cliquez sur "New Project"
3. Renseignez :
   - **Name** : `apex-coaching` (ou un nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche de vos utilisateurs
   - **Pricing Plan** : Free (suffisant pour commencer)
4. Cliquez sur "Create new project"
5. Attendez quelques minutes que le projet soit prêt

### 2. Récupérer les clés API

1. Une fois le projet créé, allez dans **Settings** → **API**
2. Notez ces deux valeurs :
   - **Project URL** : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key** : `eyJhbG...` (une longue chaîne)
3. Copiez-les dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 3. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Ouvrez le fichier `supabase/schema.sql` de ce projet
4. Copiez **tout** le contenu
5. Collez-le dans l'éditeur SQL de Supabase
6. Cliquez sur "Run" (en bas à droite)
7. Vous devriez voir : "Success. No rows returned"

✅ Cela crée :
- Les 3 tables (`profiles`, `tasks`, `pomodoro_sessions`)
- Toutes les politiques de sécurité (RLS)
- Les triggers automatiques
- Les fonctions utilitaires

### 4. Vérifier les tables

1. Allez dans **Database** → **Tables**
2. Vous devriez voir :
   - ✅ `profiles`
   - ✅ `tasks`
   - ✅ `pomodoro_sessions`
3. Cliquez sur chaque table pour voir sa structure

### 5. Activer Realtime

1. Allez dans **Database** → **Replication**
2. Cherchez la table `tasks`
3. Activez le toggle à droite ✅
4. Faites de même pour `pomodoro_sessions`

⚠️ **Important** : Sans cette étape, les modifications ne seront pas synchronisées en temps réel !

### 6. Configurer l'authentification (optionnel)

Par défaut, Supabase Auth est activé avec email/password. Si vous voulez personnaliser :

1. Allez dans **Authentication** → **Providers**
2. Vous pouvez activer d'autres providers (Google, GitHub, etc.)
3. Pour l'instant, Email est suffisant

#### Configuration Email (recommandé pour la production)

1. **Authentication** → **Email Templates**
2. Personnalisez les emails de confirmation
3. **Authentication** → **URL Configuration**
4. Ajoutez votre URL de production dans "Site URL"

### 7. Tester la configuration

#### Test 1 : Créer un utilisateur

1. Allez dans **Authentication** → **Users**
2. Cliquez sur "Add user"
3. Créez un utilisateur de test :
   - Email : `coach@test.com`
   - Password : `test1234`
   - User Metadata (ajoutez) :
     ```json
     {
       "full_name": "Coach Test",
       "role": "coach"
     }
     ```
4. Cliquez sur "Create user"

#### Test 2 : Vérifier le profil

1. Allez dans **Database** → **Table Editor**
2. Sélectionnez la table `profiles`
3. Vous devriez voir le profil du coach créé automatiquement grâce au trigger !

#### Test 3 : Créer une tâche de test

1. Dans **SQL Editor**, créez une nouvelle query
2. Copiez-collez :

```sql
-- Créer un élève de test
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  'student@test.com',
  crypt('test1234', gen_salt('bf')),
  now(),
  '{"full_name": "Élève Test", "role": "student"}'::jsonb
);

-- Récupérer l'ID de l'élève
SELECT id, email FROM profiles WHERE role = 'student';
```

3. Notez l'ID de l'élève
4. Créez une tâche pour cet élève :

```sql
INSERT INTO tasks (student_id, title, priority, status)
VALUES (
  'UUID_DE_LELEVE_ICI',  -- Remplacez par l'UUID récupéré
  'Terminer les exercices de maths',
  1,
  false
);
```

5. Allez dans **Table Editor** → `tasks` pour vérifier

### 8. Vérifier les politiques RLS

Les politiques de sécurité sont essentielles. Pour les tester :

1. Allez dans **Database** → **Policies**
2. Vous devriez voir plusieurs politiques pour chaque table
3. Vérifiez que RLS est **activé** (enabled) pour chaque table

## 🎉 Configuration terminée !

Votre instance Supabase est prête ! Vous pouvez maintenant :

1. Lancer l'application Next.js : `npm run dev`
2. Créer un compte Coach via l'interface
3. Créer des comptes Élèves
4. Tester la synchronisation en temps réel !

## 🔍 Monitoring et Debug

### Logs en temps réel

1. **Database** → **Logs Explorer**
2. Vous pouvez voir toutes les requêtes SQL en temps réel
3. Utile pour debugger les problèmes

### Vérifier les politiques RLS

Si un utilisateur ne peut pas voir ses données :

1. Allez dans **SQL Editor**
2. Exécutez cette requête en tant que cet utilisateur :

```sql
-- Tester en tant qu'utilisateur spécifique
SET request.jwt.claims = '{"sub": "UUID_UTILISATEUR_ICI"}';

-- Essayer de récupérer ses tâches
SELECT * FROM tasks WHERE student_id = 'UUID_UTILISATEUR_ICI';
```

### Dashboard Supabase utile

- **Auth** → **Users** : Gérer les utilisateurs
- **Database** → **Backups** : Sauvegardes automatiques
- **Storage** : Si vous voulez ajouter des uploads de fichiers plus tard

## 📊 Limites du plan gratuit

- 500 MB de base de données
- 1 GB de stockage
- 2 GB de bande passante
- 50 000 utilisateurs actifs mensuels
- 500 000 requêtes Edge Functions

💡 Largement suffisant pour commencer !

## 🆘 Problèmes courants

### Erreur "relation does not exist"

→ Le schéma SQL n'a pas été exécuté correctement
→ Retournez à l'étape 3

### Erreur "new row violates row-level security policy"

→ Les politiques RLS bloquent l'accès
→ Vérifiez que l'utilisateur a bien le bon rôle dans son profil

### Les modifications ne se synchronisent pas

→ Realtime n'est pas activé
→ Retournez à l'étape 5

### Cannot read property 'id' of null

→ L'utilisateur n'est pas connecté
→ Vérifiez l'authentification dans l'application

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

Besoin d'aide ? Consultez les logs Supabase ou ouvrez une issue sur GitHub !
