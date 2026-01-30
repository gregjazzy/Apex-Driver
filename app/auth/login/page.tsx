'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

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
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-2">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="text-6xl mb-4">🎓</div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Apex Coaching
          </CardTitle>
          <p className="text-gray-600 mt-2">Connecte-toi pour commencer</p>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
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
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Pas encore de compte ? Inscris-toi
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
