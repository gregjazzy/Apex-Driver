# 🚀 Guide de Démarrage Rapide - Apex Coaching

Bienvenue ! Ce guide vous permet de démarrer l'application en **5 minutes**.

## ⚡ Installation Express

### Étape 1 : Cloner et installer (2 min)

```bash
cd /Users/gregorymittelette/Dev/Apex-Driver
npm install
```

### Étape 2 : Configurer Supabase (2 min)

1. **Créer un compte** sur [supabase.com](https://supabase.com) (gratuit)

2. **Créer un projet** :
   - Name: `apex-coaching`
   - Password: choisissez un mot de passe
   - Region: la plus proche de vous
   - Cliquez "Create new project"

3. **Récupérer les clés** :
   - Allez dans **Settings** → **API**
   - Copiez **Project URL** et **anon key**

4. **Configurer l'app** :
   
   Éditez `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
   ```

### Étape 3 : Créer la base de données (1 min)

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez "New query"
3. Copiez **tout** le contenu de `supabase/schema.sql`
4. Collez dans l'éditeur
5. Cliquez "Run"
6. Vous devriez voir "Success"

### Étape 4 : Activer Realtime (30 sec)

1. Allez dans **Database** → **Replication**
2. Activez la réplication pour :
   - ✅ `tasks`
   - ✅ `pomodoro_sessions`

### Étape 5 : Lancer l'app ! (10 sec)

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

🎉 **C'est prêt !**

## 🎯 Premiers pas

### Créer un compte Coach

1. Cliquez "Commencer" ou "Se connecter"
2. Allez sur "Pas encore de compte ? Inscris-toi"
3. Remplissez :
   - Nom : Votre nom
   - Email : coach@example.com
   - Mot de passe : test1234
   - Sélectionnez "👨‍🏫 Coach"
4. Validez

Vous êtes redirigé vers votre dashboard coach !

### Créer un compte Élève

Ouvrez un navigateur privé (ou un autre navigateur) :

1. Allez sur [http://localhost:3000](http://localhost:3000)
2. Inscrivez-vous avec :
   - Nom : Élève Test
   - Email : student@example.com
   - Mot de passe : test1234
   - Sélectionnez "🎓 Élève"
3. Validez

Vous êtes sur le dashboard élève !

### Tester la synchronisation temps réel

#### Côté Coach :

1. Dans votre liste d'élèves, cliquez sur "Élève Test"
2. Cliquez "Ajouter une tâche"
3. Entrez : "Terminer les devoirs de maths"
4. Priorité : Urgent
5. Validez

#### Côté Élève :

Regardez le dashboard élève → **La tâche apparaît instantanément !** ✨

#### Côté Élève :

Cochez la tâche → **Confettis !** 🎉

#### Côté Coach :

Regardez le dashboard → **La tâche est cochée en temps réel !**

### Tester le Pomodoro

Côté Élève :

1. Dans le composant Pomodoro
2. Cliquez "Démarrer"
3. Le timer démarre !
4. (Optionnel) Cliquez "Abandonner" ou attendez la fin
5. La session est enregistrée

Côté Coach :

- Retournez voir les stats de l'élève
- Vous voyez les **minutes Pomodoro** augmenter !

## 📚 Documentation complète

Si vous avez besoin de plus d'infos :

- **README.md** : Documentation complète
- **SUPABASE_SETUP.md** : Configuration détaillée Supabase
- **DOCUMENTATION.md** : Documentation technique (hooks, composants)
- **PROJECT_STRUCTURE.md** : Architecture du projet

## 🐛 Problèmes courants

### "Invalid supabaseUrl"
→ Vérifiez que vous avez bien mis les vraies valeurs dans `.env.local`

### "Row Level Security policy"
→ Vérifiez que vous avez exécuté tout le fichier `schema.sql`

### Les modifications ne se synchronisent pas
→ Activez Realtime dans Supabase (Étape 4)

### L'app ne démarre pas
→ Vérifiez que vous avez bien fait `npm install`

## 🚀 Prochaines étapes

Une fois que tout fonctionne :

1. **Personnalisez** les couleurs dans `app/globals.css`
2. **Ajoutez** vos propres fonctionnalités
3. **Déployez** sur Vercel (voir README.md)

## 💡 Astuces

- **Ouvrez deux navigateurs** pour tester coach + élève simultanément
- **Utilisez la console** pour voir les logs Supabase Realtime
- **Modifiez les durées** Pomodoro dans `components/PomodoroTimer.tsx`

## 🆘 Besoin d'aide ?

1. Consultez **SUPABASE_SETUP.md** pour les détails
2. Vérifiez les logs dans la console du navigateur
3. Vérifiez les logs dans Supabase → **Database** → **Logs Explorer**

---

**Profitez bien d'Apex Coaching !** 🎓✨
