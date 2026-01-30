'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Convertir l'identifiant en email pour Supabase Auth
    const email = `${username.toLowerCase()}@apexdriver.app`
    
    console.log('Tentative de connexion:', email, password)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Réponse Supabase:', data, error)

    if (error) {
      console.error('Erreur Supabase:', error.message)
      setError('Identifiant ou mot de passe incorrect')
      setLoading(false)
    } else {
      console.log('Connexion réussie!')
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-3 sm:p-4 relative">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 relative z-10">
        <CardHeader className="text-center pb-6 sm:pb-8 pt-8 sm:pt-10 px-4 sm:px-8">
          <CardTitle className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent">
            Apex Dashboard
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-500 mt-2">Connecte-toi pour démarrer</p>
        </CardHeader>

        <CardContent className="px-4 sm:px-8 pb-8 sm:pb-10">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identifiant
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-base sm:text-lg"
                placeholder="Sacha"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-base sm:text-lg"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-14 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] transition-transform"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
