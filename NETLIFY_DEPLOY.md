# 🚀 Déploiement sur Netlify - Apex Driver

## ❌ Erreur actuelle

Le build échoue car les **variables d'environnement Supabase** ne sont pas configurées sur Netlify.

---

## ✅ SOLUTION : Configurer les variables d'environnement

### Étape 1 : Allez dans les paramètres Netlify

1. Connectez-vous sur https://app.netlify.com
2. Sélectionnez votre site Apex Driver
3. Allez dans **Site settings** → **Environment variables**

### Étape 2 : Ajoutez les 2 variables

Cliquez sur **Add a variable** et ajoutez :

#### Variable 1
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://ehlpgctnlugghegyzeqc.supabase.co
```

#### Variable 2
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [VOTRE_ANON_KEY_ICI]
```

Pour obtenir votre anon key :
1. Allez sur https://supabase.com/dashboard/project/ehlpgctnlugghegyzeqc
2. **Settings** → **API**
3. Copiez la valeur de **anon/public** key

### Étape 3 : Re-déployez

1. Sauvegardez les variables
2. Dans Netlify, allez dans **Deploys**
3. Cliquez sur **Trigger deploy** → **Deploy site**

✅ Le build devrait maintenant fonctionner !

---

## 📁 Fichier netlify.toml créé

Un fichier `netlify.toml` a été créé avec la configuration optimale pour Next.js.

---

## 🔍 Vérification

Après avoir configuré les variables :

1. Le build démarre
2. Next.js compile avec succès
3. Les pages sont générées
4. Le site est déployé
5. ✅ Votre application est en ligne !

---

## 🌐 Alternative : Vercel (recommandé)

Next.js fonctionne mieux sur **Vercel** (créé par les mêmes développeurs).

### Déployer sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

Suivez les instructions, Vercel détectera automatiquement Next.js.

**Avantages Vercel** :
- ✅ Optimisé pour Next.js
- ✅ Configuration automatique
- ✅ Variables d'env dans l'interface
- ✅ Preview deployments automatiques
- ✅ Meilleure performance

---

## 📝 Checklist Netlify

- [ ] Variables d'environnement ajoutées
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `netlify.toml` présent dans le repo
- [ ] Re-déploiement déclenché
- [ ] Build réussi
- [ ] Site accessible

---

## 🆘 Si le problème persiste

### Option 1 : Vérifiez les variables

Dans Netlify, **Deploys** → **Deploy settings** → Vérifiez que les 2 variables sont bien présentes.

### Option 2 : Vérifiez les logs

Dans **Deploys** → Cliquez sur le dernier deploy → **Deploy log**

Cherchez les erreurs liées à Supabase.

### Option 3 : Build local

Testez que le build fonctionne localement :

```bash
npm run build
```

Si ça fonctionne, le problème vient bien des variables d'env sur Netlify.

---

## 🎯 Résumé

**Cause du problème** : Variables d'environnement Supabase manquantes sur Netlify

**Solution** : 
1. Ajoutez `NEXT_PUBLIC_SUPABASE_URL` dans Netlify
2. Ajoutez `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans Netlify
3. Re-déployez

**Temps estimé** : 2 minutes

---

**Après configuration, votre app sera en ligne ! 🚀**
