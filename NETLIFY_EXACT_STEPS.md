# 🎯 CONFIGURATION EXACTE NETLIFY - COPIER-COLLER

## ÉTAPE 1 : Récupérer votre Anon Key Supabase

### 1.1 - Allez sur cette URL exacte :
```
https://supabase.com/dashboard/project/ehlpgctnlugghegyzeqc/settings/api
```

### 1.2 - Cherchez la section "Project API keys"

### 1.3 - Copiez la clé "anon" / "public"
Elle ressemble à ça :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobHBnY3RubHVnZ2hlZ3l6ZXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDI1MDAwMDAsImV4cCI6MTk1ODA3NjAwMH0.XXXXXXXXXXXXXXXXXXXX
```
**⚠️ C'est un long texte qui commence par "eyJ"**

---

## ÉTAPE 2 : Configurer Netlify (EXACTEMENT)

### 2.1 - Allez sur Netlify
```
https://app.netlify.com
```

### 2.2 - Cliquez sur votre site "Apex Driver"

### 2.3 - Cliquez sur "Site configuration" (dans le menu de gauche)

### 2.4 - Cliquez sur "Environment variables"

### 2.5 - Cliquez sur "Add a variable"

---

## ÉTAPE 3 : Ajouter la PREMIÈRE variable

### Cliquez sur "Add a single variable"

**Key** (copiez exactement) :
```
NEXT_PUBLIC_SUPABASE_URL
```

**Value** (copiez exactement) :
```
https://ehlpgctnlugghegyzeqc.supabase.co
```

### Scope : **All scopes** (laissez par défaut)

Cliquez sur **"Create variable"**

---

## ÉTAPE 4 : Ajouter la DEUXIÈME variable

### Cliquez à nouveau sur "Add a variable"

### Cliquez sur "Add a single variable"

**Key** (copiez exactement) :
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Value** : **[COLLEZ ICI LA CLÉ COPIÉE À L'ÉTAPE 1]**

### Scope : **All scopes** (laissez par défaut)

Cliquez sur **"Create variable"**

---

## ÉTAPE 5 : Vérifier

Vous devez voir **2 variables** dans la liste :

```
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## ÉTAPE 6 : Re-déployer

### 6.1 - Cliquez sur "Deploys" (dans le menu de gauche)

### 6.2 - Cliquez sur "Trigger deploy" (bouton en haut à droite)

### 6.3 - Cliquez sur "Deploy site"

---

## ✅ VÉRIFICATION DU BUILD

### Le build doit afficher :
```
✓ Compiled successfully
✓ Generating static pages (9/9)
```

### Si vous voyez ça : **C'EST RÉUSSI ! 🎉**

---

## 🆘 EN CAS DE PROBLÈME

### Problème 1 : "Invalid supabaseUrl"
➡️ Vérifiez que vous avez bien copié : `https://ehlpgctnlugghegyzeqc.supabase.co`

### Problème 2 : "Invalid API key"
➡️ Retournez sur Supabase et re-copiez la clé "anon" / "public"

### Problème 3 : Le build échoue toujours
➡️ Envoyez-moi le log complet du déploiement

---

## 📋 CHECKLIST FINALE

- [ ] J'ai récupéré ma anon key sur Supabase
- [ ] J'ai ajouté `NEXT_PUBLIC_SUPABASE_URL` sur Netlify
- [ ] J'ai ajouté `NEXT_PUBLIC_SUPABASE_ANON_KEY` sur Netlify
- [ ] J'ai re-déclenché le déploiement
- [ ] Le build est réussi
- [ ] Mon site est accessible

---

## 🎯 RÉSUMÉ EN 3 ACTIONS

1. **Supabase** → Copier la clé anon
2. **Netlify** → Ajouter 2 variables d'environnement
3. **Netlify** → Re-déployer

**Temps total : 2-3 minutes**
