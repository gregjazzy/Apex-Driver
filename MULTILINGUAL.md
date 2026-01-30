# 🌍 Système Multi-langue - Apex Driver

## ✅ Système de traduction implémenté

L'application supporte maintenant **Français** 🇫🇷 et **Anglais** 🇬🇧 !

---

## 📁 Fichiers créés

### 1. `lib/translations.ts`
Contient toutes les traductions (FR + EN) :
- Messages d'interface
- Labels de formulaires
- Messages d'erreur
- Textes des dashboards
- Et bien plus...

### 2. `lib/language-context.tsx`
Context React pour gérer la langue :
- Sauvegarde dans localStorage
- Hook `useLanguage()` pour accéder aux traductions
- Fonction `t()` pour traduire

### 3. `components/LanguageSwitcher.tsx`
Bouton pour changer de langue (🇫🇷 FR / 🇬🇧 EN)

---

## 🎯 Comment utiliser

### Dans un composant Client

```tsx
'use client'

import { useLanguage } from '@/lib/language-context'

export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('appDescription')}</p>
      
      {/* Traductions imbriquées */}
      <span>{t('features.actionPlan.title')}</span>
      
      {/* Changer de langue */}
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  )
}
```

### Ajouter le Language Switcher

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

<LanguageSwitcher />
```

---

## 📝 Pages mises à jour

### ✅ Déjà traduites
- ✅ `app/layout.tsx` - Layout avec LanguageProvider
- ✅ `app/page.tsx` - Page d'accueil avec switcher de langue

### 🔄 À traduire (exemples fournis ci-dessous)
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`
- `app/dashboard/coach/page.tsx`
- `app/dashboard/student/page.tsx`
- `components/ActionPlan.tsx`
- `components/PomodoroTimer.tsx`

---

## 📚 Exemple : Page de Login traduite

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage() // 👈 Hook de traduction

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      {/* Switcher de langue en haut à droite */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-2">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="text-6xl mb-4">🎓</div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('appTitle')}
          </CardTitle>
          <p className="text-gray-600 mt-2">{t('login')}</p>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
                placeholder="ton.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {loading ? t('loggingIn') : t('login')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
              {t('noAccount')}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🔧 Comment ajouter une nouvelle traduction

### 1. Ajoutez la clé dans `lib/translations.ts`

```typescript
export const translations = {
  fr: {
    // ... existant ...
    myNewKey: "Mon nouveau texte en français",
    nested: {
      key: "Texte imbriqué"
    }
  },
  en: {
    // ... existant ...
    myNewKey: "My new text in English",
    nested: {
      key: "Nested text"
    }
  }
}
```

### 2. Utilisez-la dans vos composants

```tsx
const { t } = useLanguage()

<p>{t('myNewKey')}</p>
<p>{t('nested.key')}</p>
```

---

## 🎨 Fonctionnalités du Language Switcher

- ✅ Bouton 🇫🇷 FR / 🇬🇧 EN stylisé
- ✅ Sauvegarde dans localStorage
- ✅ Persiste entre les sessions
- ✅ Design "Super Friendly" cohérent
- ✅ Animations smooth

---

## 📊 Traductions disponibles

### Navigation & Auth
- login, signup, logout
- email, password, fullName
- loggingIn, creatingAccount

### Rôles
- coach, student, iAm

### Landing Page
- appTitle, appSubtitle, appDescription
- getStarted, alreadyAccount, noAccount

### Features
- features.actionPlan.title/description
- features.pomodoro.title/description
- features.tracking.title/description

### Dashboard
- dashboard, hello, readyToWork
- coachDashboard, studentDashboard
- welcomeBack, myStudents, backToStudents

### Action Plan
- actionPlan, tasks, tasksCompleted
- addTask, taskTitle, add, cancel
- noTasks, startAddingTasks

### Priorités
- priority.urgent, priority.important, priority.normal

### Pomodoro
- pomodoro, pomodoroTimer
- concentration, shortBreak, longBreak
- start, pause, reset, abandon
- stayFocused, enjoyBreak
- sessionsCompleted, totalMinutes

### Stats
- stats.completedTasks, stats.totalTasks
- stats.pomodoroMinutes, stats.completionRate

### Messages
- messages.loading, messages.success
- messages.everyVictory, messages.keepGoing
- messages.clickStudent, messages.noStudents
- messages.studentsWillAppear, messages.viewDashboard
- messages.tip

### Erreurs
- errors.invalidCredentials, errors.userExists
- errors.weakPassword, errors.required

---

## 🚀 Déploiement

Lors du déploiement :
1. ✅ Le système est déjà actif
2. ✅ La langue par défaut est le français
3. ✅ L'utilisateur peut changer à tout moment
4. ✅ Le choix est sauvegardé dans localStorage

---

## 💡 Pour finir la traduction

Pour traduire les pages restantes, suivez le modèle ci-dessus :

1. Ajoutez `import { useLanguage } from '@/lib/language-context'`
2. Ajoutez `const { t } = useLanguage()`
3. Remplacez les textes par `{t('cle')}`
4. Ajoutez `<LanguageSwitcher />` dans le header

**Tous les textes sont déjà dans `lib/translations.ts` !**

---

## 📱 Exemple Dashboard

```tsx
'use client'

import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function Dashboard() {
  const { t } = useLanguage()
  
  return (
    <div>
      {/* Header avec switcher */}
      <header>
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        <h1>{t('hello')} John!</h1>
        <p>{t('readyToWork')}</p>
      </header>
      
      {/* Contenu */}
      <main>
        <h2>{t('actionPlan')}</h2>
        <p>{t('tasksCompleted')}: 5/10</p>
      </main>
    </div>
  )
}
```

---

**Le système est prêt ! L'application peut maintenant fonctionner en français ET en anglais ! 🇫🇷🇬🇧**
