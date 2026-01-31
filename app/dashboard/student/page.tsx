'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ActionPlan } from '@/components/ActionPlan'
import { PomodoroTimer } from '@/components/PomodoroTimer'
import { PomodoroStats } from '@/components/PomodoroStats'
import { LogOut } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function StudentDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted) return
      if (!user) { router.replace('/auth/login'); return }

      const { data: profile } = await supabase
        .from('apexdriver_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!mounted) return
      if (profile && profile.role === 'coach') { router.replace('/dashboard/coach'); return }

      setUserName(profile?.full_name || user.email?.split('@')[0] || 'Élève')
      setUserId(user.id)
      setLoading(false)
    }

    fetchUser()
    return () => { mounted = false }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400">Chargement...</p>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 rounded-2xl max-w-md">
          <h2 className="text-xl font-semibold text-neutral-200 mb-4">Profil introuvable</h2>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header simple */}
      <header className="border-b border-neutral-800 sticky top-0 z-50 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">{userName}</h1>
            <p className="text-sm text-neutral-500">Apex Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionPlan studentId={userId} isCoach={false} />
          <PomodoroTimer studentId={userId} />
        </div>
        
        {/* Stats Pomodoro */}
        <PomodoroStats studentId={userId} />
      </main>
    </div>
  )
}
