'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Database } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ActionPlan } from '@/components/ActionPlan'
import { LogOut, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

type Profile = Database['public']['Tables']['apexdriver_profiles']['Row']
type Task = Database['public']['Tables']['apexdriver_tasks']['Row']
type PomodoroSession = Database['public']['Tables']['apexdriver_pomodoro_sessions']['Row']

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
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (initialized) return
    
    const fetchData = async () => {
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
        if (profile.role === 'student') {
          router.push('/dashboard/student')
          return
        }
        setCoachName(profile.full_name)
      }

      // Charger tous les élèves
      const { data: studentsData } = await supabase
        .from('apexdriver_profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (studentsData) {
        setStudents(studentsData)
      }

      setLoading(false)
      setInitialized(true)
    }

    fetchData()
  }, [initialized])

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentStats(selectedStudent.id)
    }
  }, [selectedStudent])

  const fetchStudentStats = async (studentId: string) => {
    // Récupérer les tâches
    const { data: tasks } = await supabase
      .from('apexdriver_tasks')
      .select('*')
      .eq('student_id', studentId)

    // Récupérer les sessions Pomodoro
    const { data: sessions } = await supabase
      .from('apexdriver_pomodoro_sessions')
      .select('*')
      .eq('student_id', studentId)

    const totalTasks = tasks?.length || 0
    const completedTasks = tasks?.filter((t) => t.status).length || 0
    const completedSessions = sessions?.filter((s) => s.status === 'completed').length || 0
    const totalPomodoroMinutes =
      sessions?.filter((s) => s.status === 'completed').reduce((acc, s) => acc + s.duration, 0) ||
      0

    setStudentStats({
      totalTasks,
      completedTasks,
      totalPomodoroMinutes,
      completedSessions,
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600 animate-pulse">Chargement...</div>
      </div>
    )
  }

  // Vue détaillée d'un élève
  if (selectedStudent) {
    const completionRate =
      studentStats && studentStats.totalTasks > 0
        ? Math.round((studentStats.completedTasks / studentStats.totalTasks) * 100)
        : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
        {/* Header - Mobile Optimized */}
        <header className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <Button
                  onClick={() => setSelectedStudent(null)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg sm:rounded-xl border-2 shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Retour</span>
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
                    {selectedStudent.full_name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Dashboard élève</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="rounded-lg sm:rounded-xl border-2 shrink-0"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Stats de l'élève - Mobile Grid */}
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <Card className="rounded-xl sm:rounded-2xl shadow-lg border-2">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600">
                  {studentStats?.completedTasks || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Complétées</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl sm:rounded-2xl shadow-lg border-2">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">
                  {studentStats?.totalTasks || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Totales</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl sm:rounded-2xl shadow-lg border-2">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-600">
                  {studentStats?.totalPomodoroMinutes || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Minutes</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl sm:rounded-2xl shadow-lg border-2">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600">{completionRate}%</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Complétion</div>
              </CardContent>
            </Card>
          </div>

          {/* Plan d'Action de l'élève */}
          <ActionPlan
            studentId={selectedStudent.id}
            isCoach={true}
            studentName={selectedStudent.full_name}
          />
        </main>
      </div>
    )
  }

  // Vue liste des élèves
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                Dashboard Coach
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Bienvenue {coachName}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="rounded-lg sm:rounded-xl border-2 shrink-0"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <Card className="rounded-2xl sm:rounded-3xl shadow-lg border-2">
          <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-900">
              Mes Élèves ({students.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 sm:p-4 lg:p-6">
            {students.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-gray-400">
                <p className="text-base sm:text-lg">Aucun élève</p>
                <p className="text-xs sm:text-sm mt-2">
                  Les élèves apparaîtront après inscription
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="group p-4 sm:p-5 lg:p-6 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg active:scale-[0.98] transition-all text-left"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <Avatar className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-400 to-purple-500 shrink-0">
                        <AvatarFallback className="text-white text-base sm:text-lg font-bold">
                          {getInitials(student.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                          {student.full_name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-1 bg-emerald-50 text-emerald-600 border-emerald-200 text-xs"
                        >
                          Élève
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <span>Voir dashboard →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Infos - Mobile adapté */}
        <div className="p-4 sm:p-6 lg:p-8 bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">
            Conseil
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Clique sur un élève pour gérer ses tâches en temps réel. Tout est synchronisé instantanément !
          </p>
        </div>
      </main>
    </div>
  )
}
