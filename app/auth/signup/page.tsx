'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-3xl shadow-2xl border-2">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenue !
            </h2>
            <p className="text-gray-600">
              Ton compte a été créé avec succès. Redirection...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-2">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="text-6xl mb-4">🚀</div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Créer un compte
          </CardTitle>
          <p className="text-gray-600 mt-2">Rejoins Apex Coaching</p>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
                placeholder="Ton nom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
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
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Je suis un(e)
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`
                    flex-1 py-3 rounded-xl text-lg font-medium transition-all
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
                    flex-1 py-3 rounded-xl text-lg font-medium transition-all
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
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Déjà un compte ? Connecte-toi
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
