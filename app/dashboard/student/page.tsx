'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ActionPlan } from '@/components/ActionPlan'
import { PomodoroTimer } from '@/components/PomodoroTimer'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default function StudentDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('apexdriver_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        if (profile.role === 'coach') {
          router.push('/dashboard/coach')
          return
        }
        setUserName(profile.full_name)
        setUserId(user.id)
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600 animate-pulse">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                👋 Salut {userName.split(' ')[0]} !
              </h1>
              <p className="text-gray-600 mt-1">Prêt à donner le meilleur de toi-même ?</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-xl border-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan d'Action */}
          <div>
            {userId && <ActionPlan studentId={userId} isCoach={false} />}
          </div>

          {/* Pomodoro Timer */}
          <div>
            {userId && <PomodoroTimer studentId={userId} />}
          </div>
        </div>

        {/* Message de motivation */}
        <div className="mt-8 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200 text-center">
          <p className="text-2xl font-semibold text-gray-800">
            💪 Chaque petite victoire compte !
          </p>
          <p className="text-gray-600 mt-2">
            Continue comme ça, tu progresses chaque jour
          </p>
        </div>
      </main>
    </div>
  )
}
