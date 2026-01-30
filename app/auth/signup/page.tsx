'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'coach' | 'student'>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Convertir l'identifiant en email pour Supabase Auth
    const email = `${username.toLowerCase()}@apexdriver.app`

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
          role: role,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-3 sm:p-4 relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <Card className="w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 relative z-10">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Bienvenue chez Apex Dashboard !
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Ton compte a été créé avec succès. Redirection...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 relative z-10">
        <CardHeader className="text-center pb-6 sm:pb-8 pt-8 sm:pt-10 px-4 sm:px-8">
          <CardTitle className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent">
            Créer un compte
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-500 mt-2">Rejoins Apex Dashboard</p>
        </CardHeader>

        <CardContent className="px-4 sm:px-8 pb-8 sm:pb-10">
          <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-5">
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
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Je suis un(e)
              </label>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`
                    flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium transition-all active:scale-95
                    ${
                      role === 'student'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  🎓 Élève
                </button>
                <button
                  type="button"
                  onClick={() => setRole('coach')}
                  className={`
                    flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium transition-all active:scale-95
                    ${
                      role === 'coach'
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  👨‍🏫 Coach
                </button>
              </div>
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
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <a href="/auth/login" className="text-sm sm:text-base text-indigo-600 hover:text-indigo-700 font-medium">
              Se connecter
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
