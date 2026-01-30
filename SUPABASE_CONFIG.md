# 🔧 Configuration Supabase - Apex Driver

## 📋 Informations de votre projet

**URL du projet** : https://supabase.com/dashboard/project/ehlpgctnlugghegyzeqc  
**ID du projet** : `ehlpgctnlugghegyzeqc`

⚠️ **Important** : Ce projet Supabase est partagé avec d'autres applications. Toutes les tables utilisent le préfixe `apexdriver_` pour éviter les conflits.

---

## 🚀 Étapes d'installation

### 1. Récupérer vos clés API

1. Connectez-vous à votre projet Supabase : https://supabase.com/dashboard/project/ehlpgctnlugghegyzeqc
2. Allez dans **Settings** → **API**
3. Copiez ces deux valeurs :
   - **Project URL** : `https://ehlpgctnlugghegyzeqc.supabase.co`
   - **anon/public key** : (une longue chaîne)

### 2. Configurer les variables d'environnement

Éditez le fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ehlpgctnlugghegyzeqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
```

### 3. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez **tout** le contenu du fichier `supabase/schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** (en bas à droite)
6. Vous devriez voir : "Success. No rows returned" ou un message de confirmation

✅ Cela va créer :
- 3 tables avec préfixe `apexdriver_` :
  - `apexdriver_profiles`
  - `apexdriver_tasks`
  - `apexdriver_pomodoro_sessions`
- Toutes les politiques RLS (Row Level Security)
- Les triggers automatiques
- Les fonctions utilitaires

### 4. Activer Realtime

1. Allez dans **Database** → **Replication**
2. Cherchez et activez la réplication pour :
   - ✅ `apexdriver_tasks`
   - ✅ `apexdriver_pomodoro_sessions`

⚠️ **Important** : Sans cette étape, les modifications ne seront pas synchronisées en temps réel !

### 5. Vérifier les tables créées

1. Allez dans **Database** → **Tables**
2. Vous devriez voir vos 3 nouvelles tables :
   - ✅ `apexdriver_profiles`
   - ✅ `apexdriver_tasks`
   - ✅ `apexdriver_pomodoro_sessions`

---

## 🗄️ Structure des tables

### Table `apexdriver_profiles`
Stocke les profils utilisateurs (Coach et Élèves).

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | ID de l'utilisateur (référence auth.users) |
| role | text | 'coach' ou 'student' |
| full_name | text | Nom complet |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Dernière mise à jour |

### Table `apexdriver_tasks`
Stocke les tâches des élèves (Plan d'Action).

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | ID unique de la tâche |
| student_id | uuid | ID de l'élève |
| title | text | Titre de la tâche |
| status | boolean | Complétée (true) ou non (false) |
| priority | integer | 1=Urgent, 2=Important, 3=Normal |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Dernière mise à jour |

**Données sauvegardées** :
- ✅ Toutes les tâches créées par le coach
- ✅ Statut de complétion (coché/non coché)
- ✅ Historique complet avec horodatage

### Table `apexdriver_pomodoro_sessions`
Stocke les sessions Pomodoro des élèves.

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | ID unique de la session |
| student_id | uuid | ID de l'élève |
| duration | integer | Durée en minutes |
| status | text | 'completed' ou 'abandoned' |
| created_at | timestamp | Date de la session |

**Données sauvegardées** :
- ✅ Chaque session Pomodoro terminée
- ✅ Durée exacte de chaque session
- ✅ Statut (complétée ou abandonnée)
- ✅ Horodatage pour suivi dans le temps

---

## 🔐 Sécurité (RLS)

Toutes les tables ont la sécurité Row Level Security activée :

### Pour les Élèves
- ✅ Voient uniquement leurs propres données
- ✅ Peuvent modifier leurs propres tâches (cocher/décocher)
- ✅ Peuvent créer leurs sessions Pomodoro
- ❌ Ne peuvent pas voir les données des autres élèves
- ❌ Ne peuvent pas créer de tâches

### Pour vous (Coach)
- ✅ Voyez toutes les données de tous les élèves
- ✅ Créez des tâches pour n'importe quel élève
- ✅ Modifiez toutes les tâches
- ✅ Supprimez des tâches
- ✅ Accédez aux statistiques de tous les élèves

---

## 👤 Gestion des utilisateurs

### Créer votre compte Coach (VOUS)

1. Lancez l'application : `npm run dev`
2. Allez sur http://localhost:3000
3. Cliquez sur "Commencer" puis "Pas encore de compte ? Inscris-toi"
4. Remplissez :
   - Nom : Votre nom
   - Email : Votre email
   - Mot de passe : **Choisissez un mot de passe fort**
   - Rôle : Sélectionnez **"👨‍🏫 Coach"**
5. Validez

✅ Vous êtes maintenant coach et pouvez gérer vos élèves !

### Créer des comptes Élèves

**Option 1** : Les élèves s'inscrivent eux-mêmes
- Donnez-leur le lien de votre application
- Ils créent leur compte en sélectionnant "🎓 Élève"

**Option 2** : Vous créez les comptes via Supabase
1. Dans Supabase, allez dans **Authentication** → **Users**
2. Cliquez sur **Add user** → **Create new user**
3. Remplissez :
   - Email : email de l'élève
   - Password : mot de passe temporaire
   - **User Metadata** : Cliquez sur "Add metadata"
   - Ajoutez :
     ```json
     {
       "full_name": "Nom de l'élève",
       "role": "student"
     }
     ```
4. Créez l'utilisateur
5. Donnez les identifiants à l'élève

---

## 📊 Suivi et Statistiques

### Données sauvegardées par élève

#### Plan d'Action
- Chaque tâche créée
- Statut de chaque tâche (complétée ou non)
- Priorité de chaque tâche
- Date de création et de modification

#### Sessions Pomodoro
- Chaque session lancée
- Durée de chaque session (en minutes)
- Statut (complétée ou abandonnée)
- Date et heure de chaque session

### Accéder aux statistiques

**Dashboard Coach** :
1. Connectez-vous en tant que coach
2. Cliquez sur un élève dans la liste
3. Vous voyez :
   - Nombre de tâches complétées / totales
   - Temps total Pomodoro (en minutes)
   - Taux de complétion
   - Historique complet

---

## 🔄 Synchronisation Temps Réel

Grâce à Supabase Realtime :

- ✅ Quand vous créez une tâche → L'élève la voit instantanément
- ✅ Quand l'élève coche une tâche → Vous le voyez instantanément
- ✅ Quand l'élève fait un Pomodoro → Les stats se mettent à jour en direct

**Latence** : < 100ms en moyenne

---

## 🧪 Tester l'installation

### Test 1 : Authentification
```bash
npm run dev
# Ouvrir http://localhost:3000
# Créer votre compte coach
# ✅ Vous devez arriver sur le dashboard coach
```

### Test 2 : Base de données
1. Dans Supabase, allez dans **Table Editor**
2. Sélectionnez `apexdriver_profiles`
3. ✅ Vous devez voir votre profil coach

### Test 3 : Temps réel
1. Connectez-vous en tant que coach
2. Créez un élève (ou créez-en un depuis Supabase)
3. Créez une tâche pour cet élève
4. Dans un autre navigateur, connectez-vous en tant qu'élève
5. ✅ La tâche doit apparaître instantanément

---

## ⚠️ Important - Base partagée

Ce projet Supabase est partagé avec d'autres applications.

**Toutes les tables Apex Driver utilisent le préfixe `apexdriver_`** :
- ✅ `apexdriver_profiles`
- ✅ `apexdriver_tasks`
- ✅ `apexdriver_pomodoro_sessions`

Cela évite tout conflit avec les autres projets sur la même base.

---

## 🐛 Problèmes courants

### Erreur "Invalid supabaseUrl"
→ Vérifiez que vous avez bien configuré `.env.local` avec vos vraies clés

### Erreur "Row Level Security policy"
→ Vérifiez que vous avez exécuté tout le fichier `schema.sql`

### Les modifications ne se synchronisent pas
→ Vérifiez que Realtime est activé sur les tables

### "Table already exists"
→ Si vous relancez le script SQL, c'est normal. Les tables existent déjà.

---

## 📞 Support

Pour toute question :
1. Vérifiez **Supabase** → **Database** → **Logs Explorer**
2. Vérifiez la console du navigateur (F12)
3. Consultez SUPABASE_SETUP.md pour plus de détails

---

**Prêt à coacher vos élèves ! 🎓✨**
