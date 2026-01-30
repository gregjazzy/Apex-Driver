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
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (initialized) return
    
    const fetchUser = async () => {
      try {
        console.log('🔍 Fetching user...')
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser()

        console.log('👤 User:', user)
        console.log('❌ Auth error:', authError)

        if (!user) {
          console.log('⚠️ No user found, redirecting to login')
          router.push('/auth/login')
          return
        }

        console.log('📊 Fetching profile for user:', user.id)
        const { data: profile, error: profileError } = await supabase
          .from('apexdriver_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        console.log('👤 Profile:', profile)
        console.log('❌ Profile error:', profileError)

        if (profile) {
          if (profile.role === 'coach') {
            console.log('🎓 User is coach, redirecting')
            router.push('/dashboard/coach')
            return
          }
          console.log('✅ Setting username:', profile.full_name)
          setUserName(profile.full_name)
          setUserId(user.id)
        } else {
          console.error('⚠️ No profile found for user!')
          setUserName(user.email?.split('@')[0] || 'Élève')
          setUserId(user.id)
        }
        setLoading(false)
        setInitialized(true)
      } catch (error) {
        console.error('💥 Error in fetchUser:', error)
        setLoading(false)
        setInitialized(true)
      }
    }

    fetchUser()
  }, [initialized])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-600 animate-pulse mb-4">Chargement...</div>
          <div className="text-sm text-gray-500">Vérification de ton profil</div>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil introuvable</h2>
          <p className="text-gray-600 mb-6">
            Impossible de charger ton profil. Assure-toi d'avoir bien créé ton compte.
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            Retour à la connexion
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                {userName.split(' ')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Prêt à donner le meilleur de toi-même ?</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="rounded-xl border-2 shrink-0"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Grid adaptatif */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Plan d'Action */}
          <div>
            {userId && <ActionPlan studentId={userId} isCoach={false} />}
          </div>

          {/* Pomodoro Timer */}
          <div>
            {userId && <PomodoroTimer studentId={userId} />}
          </div>
        </div>

        {/* Message de motivation - Mobile adapté */}
        <div className="p-4 sm:p-6 lg:p-8 bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200 text-center">
          <p className="text-base sm:text-xl lg:text-2xl font-semibold text-gray-800">
            Chaque petite victoire compte !
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Continue comme ça, tu progresses chaque jour
          </p>
        </div>
      </main>
    </div>
  )
}
