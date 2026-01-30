# 👥 Création des Comptes - Apex Driver

## 🎯 Comptes à créer

### 👨‍🏫 Votre compte COACH (Admin)
- **Email** : `admin@apexdriver.com`
- **Mot de passe** : `admin`
- **Rôle** : Coach (accès à tous les élèves)

### 🎓 Compte ÉLÈVE (Sacha)
- **Email** : `sacha@apexdriver.com`
- **Mot de passe** : `Bertini`
- **Rôle** : Élève

---

## 🚀 Méthode Rapide : Créer les comptes via SQL

### Étape 1 : Exécuter le schéma principal

1. Allez sur https://supabase.com/dashboard/project/ehlpgctnlugghegyzeqc
2. **SQL Editor**
3. Copiez tout le contenu de `supabase/schema.sql`
4. **Run**

✅ Cela crée les tables avec préfixe `apexdriver_`

### Étape 2 : Créer les utilisateurs

1. Dans **SQL Editor**, nouvelle query
2. Copiez tout le contenu de `supabase/create_users.sql`
3. **Run**

✅ Cela crée les 2 comptes automatiquement !

### Étape 3 : Vérifier

Dans **SQL Editor** :
```sql
SELECT 
  email,
  raw_user_meta_data->>'full_name' as nom,
  raw_user_meta_data->>'role' as role
FROM auth.users
ORDER BY created_at DESC;
```

Vous devriez voir :
- ✅ admin@apexdriver.com (Coach)
- ✅ sacha@apexdriver.com (Élève)

### Étape 4 : Activer Realtime

**Database** → **Replication** → Activez :
- ✅ `apexdriver_tasks`
- ✅ `apexdriver_pomodoro_sessions`

---

## 🔑 Se connecter

### Vous (Coach)
```
Email : admin@apexdriver.com
Mot de passe : admin
```

### Sacha (Élève)
```
Email : sacha@apexdriver.com
Mot de passe : Bertini
```

⚠️ **Important** : Supabase Auth utilise des emails, pas des identifiants simples.

---

## ✅ Test complet

### 1. Lancez l'application
```bash
cd /Users/gregorymittelette/Dev/Apex-Driver
npm run dev
```

### 2. Ouvrez http://localhost:3000

### 3. Connectez-vous en tant que Coach
- Email : `admin@apexdriver.com`
- Mot de passe : `admin`
- ✅ Vous devez voir le dashboard coach (vide pour l'instant)

### 4. Dans un autre navigateur (ou mode privé)

Connectez-vous en tant qu'élève :
- Email : `sacha@apexdriver.com`
- Mot de passe : `Bertini`
- ✅ Vous devez voir le dashboard élève de Sacha

### 5. Test de synchronisation

**Côté Coach** :
1. Cliquez sur "Sacha" dans la liste
2. Ajoutez une tâche : "Faire les devoirs de maths"
3. Priorité : Urgent

**Côté Élève (Sacha)** :
- ✅ La tâche doit apparaître instantanément !

**Côté Élève** :
- Cochez la tâche
- ✅ Confettis ! 🎉

**Côté Coach** :
- ✅ La tâche est cochée en temps réel !
- ✅ Les statistiques se mettent à jour

---

## 🎓 Ajouter d'autres élèves

### Option 1 : Via l'interface Supabase

1. **Authentication** → **Users** → **Add user**
2. Remplissez :
   - Email : `eleve@example.com`
   - Password : son mot de passe
   - **User Metadata** :
     ```json
     {
       "full_name": "Nom Prénom",
       "role": "student"
     }
     ```

### Option 2 : Les élèves s'inscrivent

1. Donnez-leur le lien de votre application
2. Ils cliquent sur "Commencer" → "Inscris-toi"
3. Ils sélectionnent "🎓 Élève"
4. Ils remplissent leurs informations

⚠️ **Attention** : Cette option nécessite de valider les emails

---

## 🔐 Sécurité

### Données visibles par rôle

**Sacha (Élève)** voit :
- ✅ Ses propres tâches uniquement
- ✅ Ses propres sessions Pomodoro
- ✅ Ses statistiques personnelles
- ❌ Ne voit RIEN des autres élèves

**Vous (Coach)** voyez :
- ✅ Tous les élèves
- ✅ Toutes les tâches de tous les élèves
- ✅ Toutes les sessions Pomodoro
- ✅ Toutes les statistiques

---

## 📊 Données sauvegardées

Pour Sacha (et chaque élève) :

**Plan d'Action** :
- Chaque tâche que vous créez
- Son statut (cochée ou non)
- Sa priorité
- Date de création et modification

**Pomodoro** :
- Chaque session lancée
- Durée exacte
- Statut (complétée ou abandonnée)
- Date et heure

**Accessible depuis votre dashboard coach** :
- Statistiques en temps réel
- Historique complet
- Progression dans le temps

---

## 🆘 Problèmes

### "Invalid credentials"
→ Vérifiez que vous utilisez bien l'EMAIL (pas juste le prénom)
→ `admin@apexdriver.com` et non `admin`

### "User already exists"
→ Si vous relancez le script SQL, c'est normal
→ Supprimez d'abord l'utilisateur dans **Authentication** → **Users**

### Je ne vois pas les élèves
→ Vérifiez que vous êtes bien connecté en tant que Coach
→ Vérifiez la console (F12) pour les erreurs

---

**C'est prêt ! Bon coaching ! 🎓✨**
