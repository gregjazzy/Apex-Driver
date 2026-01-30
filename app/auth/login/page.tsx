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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Identifiant ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border-2">
        <CardHeader className="text-center pb-6 sm:pb-8 pt-8 sm:pt-10 px-4 sm:px-8">
          <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Apex Dashboard
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Connecte-toi pour démarrer</p>
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

          <div className="mt-5 sm:mt-6 text-center">
            <a href="/auth/signup" className="text-sm sm:text-base text-indigo-600 hover:text-indigo-700 font-medium">
              Pas encore de compte ? Inscris-toi
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
