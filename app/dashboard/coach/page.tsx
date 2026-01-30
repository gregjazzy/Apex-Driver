'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Database } from '@/lib/database.types'
import { ActionPlan } from '@/components/ActionPlan'
import { LogOut, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Profile = Database['public']['Tables']['apexdriver_profiles']['Row']

interface StudentStats {
  totalTasks: number
  completedTasks: number
  totalPomodoroMinutes: number
  completedSessions: number
}

export default function CoachDashboard() {
  const [students, setStudents] = useState<Profile[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null)
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null)
  const [coachName, setCoachName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted) return
      if (!user) { router.replace('/auth/login'); return }

      const { data: profile } = await supabase
        .from('apexdriver_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!mounted) return
      if (profile && profile.role === 'student') { router.replace('/dashboard/student'); return }

      setCoachName(profile?.full_name || 'Coach')

      const { data: studentsData } = await supabase
        .from('apexdriver_profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (!mounted) return
      if (studentsData) setStudents(studentsData)
      setLoading(false)
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (selectedStudent) fetchStudentStats(selectedStudent.id)
  }, [selectedStudent])

  const fetchStudentStats = async (studentId: string) => {
    const { data: tasks } = await supabase
      .from('apexdriver_tasks')
      .select('*')
      .eq('student_id', studentId)

    const { data: sessions } = await supabase
      .from('apexdriver_pomodoro_sessions')
      .select('*')
      .eq('student_id', studentId)

    const totalTasks = tasks?.length || 0
    const completedTasks = tasks?.filter((t) => t.status).length || 0
    const completedSessions = sessions?.filter((s) => s.status === 'completed').length || 0
    const totalPomodoroMinutes = sessions?.filter((s) => s.status === 'completed').reduce((acc, s) => acc + s.duration, 0) || 0

    setStudentStats({ totalTasks, completedTasks, totalPomodoroMinutes, completedSessions })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400">Chargement...</p>
      </div>
    )
  }

  // Vue détaillée d'un élève
  if (selectedStudent) {
    const completionRate = studentStats && studentStats.totalTasks > 0
      ? Math.round((studentStats.completedTasks / studentStats.totalTasks) * 100)
      : 0

    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-neutral-800 sticky top-0 z-50 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <div>
                <h1 className="text-xl font-semibold text-neutral-100">{selectedStudent.full_name}</h1>
                <p className="text-sm text-neutral-500">Élève</p>
              </div>
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

        {/* Stats */}
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-violet-400">{studentStats?.completedTasks || 0}</div>
              <div className="text-sm text-neutral-500 mt-1">Tâches complétées</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-neutral-300">{studentStats?.totalTasks || 0}</div>
              <div className="text-sm text-neutral-500 mt-1">Tâches totales</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-teal-400">{studentStats?.totalPomodoroMinutes || 0}</div>
              <div className="text-sm text-neutral-500 mt-1">Minutes focus</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{completionRate}%</div>
              <div className="text-sm text-neutral-500 mt-1">Complétion</div>
            </div>
          </div>

          <ActionPlan studentId={selectedStudent.id} isCoach={true} studentName={selectedStudent.full_name} />
        </main>
      </div>
    )
  }

  // Vue liste des élèves
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-neutral-800 sticky top-0 z-50 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">Dashboard Coach</h1>
            <p className="text-sm text-neutral-500">Bienvenue {coachName}</p>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-100">Mes Élèves ({students.length})</h2>
          </div>

          <div className="p-4">
            {students.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">Aucun élève pour le moment</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="group p-5 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-all text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold shrink-0">
                        {getInitials(student.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-neutral-100 truncate group-hover:text-violet-400 transition-colors">
                          {student.full_name}
                        </h3>
                        <span className="text-xs text-neutral-500">Élève</span>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-400">Voir le dashboard →</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
          <h3 className="text-base font-semibold text-neutral-100 mb-2">💡 Conseil</h3>
          <p className="text-sm text-neutral-400">
            Clique sur un élève pour voir son dashboard, gérer ses tâches et suivre sa progression en temps réel.
          </p>
        </div>
      </main>
    </div>
  )
}
