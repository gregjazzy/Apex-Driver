# 📚 Documentation Apex Coaching - Index

Bienvenue dans la documentation complète d'Apex Coaching !

## 🚀 Pour bien démarrer

Nouveau sur le projet ? Commencez par ici :

### 1. **[QUICKSTART.md](./QUICKSTART.md)** ⚡
Guide de démarrage ultra-rapide (5 minutes).  
Idéal pour avoir l'app qui tourne localement rapidement.

### 2. **[README.md](./README.md)** 📖
Documentation principale et complète du projet.  
Installation détaillée, architecture, usage, déploiement.

### 3. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** 🔧
Guide pas à pas pour configurer Supabase.  
Création du projet, schéma SQL, RLS, Realtime.

---

## 📋 Documentation par thème

### 🏗️ Architecture et Structure

#### [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
Arborescence complète du projet, rôle de chaque fichier, flux de données.

**Contenu :**
- 📁 Structure des dossiers
- 🗂️ Rôle de chaque fichier clé
- 🔄 Flux d'authentification
- 🔄 Flux de synchronisation Realtime
- 🎨 Design system

#### [DOCUMENTATION.md](./DOCUMENTATION.md)
Documentation technique détaillée : hooks, composants, types.

**Contenu :**
- 🧰 Hooks personnalisés (useTasks, usePomodoroSessions, useProfile)
- 🗃️ Types TypeScript
- 🔐 Politiques RLS
- ⚡ Subscriptions Realtime
- 🎨 Composants UI
- 🔄 Flux de données

---

### ✨ Fonctionnalités

#### [FEATURES.md](./FEATURES.md)
Liste exhaustive de toutes les fonctionnalités avec détails.

**Contenu :**
- 🎭 Rôles et permissions (Coach/Élève)
- 📋 Gestion des tâches
- ⏱️ Timer Pomodoro (3 modes)
- 📊 Statistiques
- 🎨 Design System "Super Friendly"
- ⚡ Synchronisation temps réel
- 🔐 Sécurité (RLS)
- 📱 Responsive design
- 🔮 Roadmap (V2, V3)

---

### 🗄️ Base de données

#### [supabase/schema.sql](./supabase/schema.sql)
Schéma SQL complet de la base de données.

**Contenu :**
- Tables : `profiles`, `tasks`, `pomodoro_sessions`
- Politiques RLS (Row Level Security)
- Triggers automatiques
- Fonctions utilitaires
- Configuration Realtime
- Exemples de données de test

---

### 📝 Historique et Releases

#### [CHANGELOG.md](./CHANGELOG.md)
Historique de toutes les versions et modifications.

**Contenu :**
- 🎉 Version 1.0.0 (release initiale)
- 🚧 Fonctionnalités à venir (V2, V3)
- 📅 Dates de release
- 🏷️ Conventions de versioning

---

## 🎯 Par cas d'usage

### "Je veux juste lancer l'app rapidement"
→ **[QUICKSTART.md](./QUICKSTART.md)**

### "Je veux comprendre comment tout fonctionne"
→ **[README.md](./README.md)** + **[DOCUMENTATION.md](./DOCUMENTATION.md)**

### "Je veux configurer Supabase correctement"
→ **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

### "Je veux comprendre la structure du code"
→ **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

### "Je veux voir toutes les fonctionnalités"
→ **[FEATURES.md](./FEATURES.md)**

### "Je veux modifier le schéma de la base"
→ **[supabase/schema.sql](./supabase/schema.sql)**

### "Je veux contribuer au projet"
→ **[README.md](./README.md)** section Contribution

### "Je veux déployer en production"
→ **[README.md](./README.md)** section Déploiement

---

## 🔍 Par composant technique

### Authentification
- **Fichiers** : `middleware.ts`, `app/auth/*`, `lib/supabase/server.ts`
- **Docs** : [README.md](./README.md) + [DOCUMENTATION.md](./DOCUMENTATION.md)

### Gestion des tâches
- **Fichiers** : `components/ActionPlan.tsx`, `hooks/useTasks.ts`
- **Docs** : [FEATURES.md](./FEATURES.md) + [DOCUMENTATION.md](./DOCUMENTATION.md)

### Timer Pomodoro
- **Fichiers** : `components/PomodoroTimer.tsx`, `hooks/usePomodoroSessions.ts`
- **Docs** : [FEATURES.md](./FEATURES.md) + [DOCUMENTATION.md](./DOCUMENTATION.md)

### Realtime
- **Fichiers** : `hooks/useTasks.ts`, `hooks/usePomodoroSessions.ts`
- **Docs** : [DOCUMENTATION.md](./DOCUMENTATION.md) + [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Base de données
- **Fichiers** : `supabase/schema.sql`, `lib/database.types.ts`
- **Docs** : [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### UI/Design
- **Fichiers** : `app/globals.css`, `components/ui/*`, `components/ActionPlan.tsx`
- **Docs** : [FEATURES.md](./FEATURES.md)

---

## 📂 Structure de la documentation

```
documentation/
├── README.md                   # Documentation principale
├── QUICKSTART.md              # Démarrage rapide
├── SUPABASE_SETUP.md          # Configuration Supabase
├── DOCUMENTATION.md           # Documentation technique
├── PROJECT_STRUCTURE.md       # Architecture du projet
├── FEATURES.md                # Liste des fonctionnalités
├── CHANGELOG.md               # Historique des versions
├── LICENSE                    # Licence MIT
└── INDEX.md                   # Ce fichier
```

---

## 🛠️ Ressources externes

### Frameworks et bibliothèques

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Concepts spécifiques

- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## 🎓 Tutoriels

### Tutoriel 1 : Ajouter une nouvelle table

1. Créer la migration SQL dans `supabase/schema.sql`
2. Ajouter les types dans `lib/database.types.ts`
3. Créer un hook personnalisé dans `hooks/`
4. Créer les politiques RLS
5. Tester

**Référence** : [DOCUMENTATION.md](./DOCUMENTATION.md)

### Tutoriel 2 : Ajouter un nouveau rôle

1. Modifier la table `profiles` (schéma SQL)
2. Mettre à jour les types TypeScript
3. Ajouter les politiques RLS pour ce rôle
4. Créer les pages spécifiques au rôle
5. Mettre à jour le middleware

**Référence** : [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### Tutoriel 3 : Personnaliser le thème

1. Modifier les couleurs dans `app/globals.css`
2. Ajuster les gradients dans les composants
3. Modifier les bordures radius si nécessaire
4. Tester la cohérence visuelle

**Référence** : [FEATURES.md](./FEATURES.md) section Design System

---

## ❓ FAQ

### Où trouver la configuration Supabase ?
→ `SUPABASE_SETUP.md` + `.env.local`

### Comment ajouter une nouvelle fonctionnalité ?
→ `DOCUMENTATION.md` + `PROJECT_STRUCTURE.md`

### Comment fonctionne le Realtime ?
→ `DOCUMENTATION.md` section Realtime

### Comment déployer en production ?
→ `README.md` section Déploiement

### Comment modifier les couleurs ?
→ `FEATURES.md` section Design System

---

## 🆘 Support

### Problèmes techniques

1. Consultez `README.md` section Troubleshooting
2. Vérifiez `SUPABASE_SETUP.md` section Problèmes courants
3. Regardez les logs Supabase
4. Vérifiez la console du navigateur

### Questions sur l'architecture

1. Lisez `PROJECT_STRUCTURE.md`
2. Consultez `DOCUMENTATION.md`
3. Explorez le code source

### Questions sur les fonctionnalités

1. Consultez `FEATURES.md`
2. Testez en local avec `npm run dev`

---

## 🎯 Checklist de démarrage

- [ ] Lire `QUICKSTART.md`
- [ ] Installer les dépendances (`npm install`)
- [ ] Configurer Supabase (voir `SUPABASE_SETUP.md`)
- [ ] Lancer l'app (`npm run dev`)
- [ ] Créer un compte Coach
- [ ] Créer un compte Élève
- [ ] Tester la synchronisation temps réel
- [ ] Tester le Pomodoro
- [ ] Lire `FEATURES.md` pour découvrir tout
- [ ] (Optionnel) Lire `DOCUMENTATION.md` pour approfondir

---

## 📊 Statistiques de la documentation

- **Fichiers de documentation** : 8
- **Lignes de code** : ~3 000+
- **Lignes de documentation** : ~2 500+
- **Composants React** : 10+
- **Hooks personnalisés** : 3
- **Tables Supabase** : 3
- **Routes** : 7

---

**Apex Coaching** - Une documentation complète pour un projet de qualité 🚀

*Dernière mise à jour : 30 janvier 2026*
