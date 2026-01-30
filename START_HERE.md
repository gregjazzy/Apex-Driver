# 🚀 Apex Driver - Guide de Démarrage Rapide

## ✅ Ce qui est fait

- ✅ Application Next.js 14 complète
- ✅ Schéma Supabase adapté avec préfixe `apexdriver_`
- ✅ Tous les fichiers mis à jour
- ✅ Code poussé sur GitHub
- ✅ TypeScript compile sans erreurs

## 🎯 Prochaine étape : Configurer Supabase

### 1. Allez sur votre projet Supabase
👉 https://supabase.com/dashboard/project/ehlpgctnlugghegyzeqc

### 2. Récupérez vos clés
- **Settings** → **API**
- Copiez **Project URL** et **anon key**

### 3. Configurez .env.local
Éditez `/Users/gregorymittelette/Dev/Apex-Driver/.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ehlpgctnlugghegyzeqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
```

### 4. Exécutez le schéma SQL
1. **SQL Editor** dans Supabase
2. Copiez tout le contenu de `supabase/schema.sql`
3. Collez et **Run**

✅ Cela crée vos 3 tables :
- `apexdriver_profiles`
- `apexdriver_tasks`
- `apexdriver_pomodoro_sessions`

### 5. Activez Realtime
- **Database** → **Replication**
- Activez : `apexdriver_tasks` et `apexdriver_pomodoro_sessions`

### 6. Lancez l'application
```bash
npm run dev
```

Ouvrez http://localhost:3000

### 7. Créez les comptes utilisateurs

**Dans SQL Editor**, nouvelle query :
1. Copiez tout le contenu de `supabase/create_users.sql`
2. **Run**

✅ Cela crée automatiquement :
- **Votre compte Coach** : `admin@apexdriver.com` / `admin`
- **Compte élève Sacha** : `sacha@apexdriver.com` / `Bertini`

### 8. Testez la connexion

**Vous (Coach)** :
```
Email : admin@apexdriver.com
Mot de passe : admin
```

**Sacha (Élève)** :
```
Email : sacha@apexdriver.com
Mot de passe : Bertini
```

⚠️ Utilisez bien l'EMAIL complet pour vous connecter !

## 🎓 C'est prêt !

- **COMPTES_UTILISATEURS.md** - Gestion des comptes Coach/Élèves (IMPORTANT !)
- **SUPABASE_CONFIG.md** - Configuration détaillée (LISEZ-MOI EN PREMIER!)
- **QUICKSTART.md** - Guide rapide général
- **README.md** - Documentation complète

## 🔐 Important

- VOUS seul créez les comptes (Coach et Élèves)
- Les élèves ne voient que LEURS données
- VOUS voyez TOUTES les données
- Toutes les données sont sauvegardées automatiquement :
  - ✅ Tâches et leur complétion
  - ✅ Sessions Pomodoro
  - ✅ Progression dans le temps

## 💾 Données sauvegardées

### Pour chaque élève
- **Plan d'Action** : Toutes les tâches, statuts, priorités
- **Pomodoro** : Chaque session, durée, date/heure
- **Statistiques** : Accessibles depuis votre dashboard coach

## 🎓 C'est prêt !

Suivez les étapes ci-dessus et vous serez opérationnel en 5 minutes !

**Besoin d'aide ?** → Consultez `SUPABASE_CONFIG.md`
