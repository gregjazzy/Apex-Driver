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
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
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
    }

    fetchData()
  }, [])

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
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setSelectedStudent(null)}
                  variant="outline"
                  className="rounded-xl border-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {selectedStudent.full_name}
                  </h1>
                  <p className="text-gray-600 mt-1">Dashboard élève</p>
                </div>
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

        {/* Stats de l'élève */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="rounded-2xl shadow-lg border-2">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-indigo-600">
                  {studentStats?.completedTasks || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Tâches complétées</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-2">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {studentStats?.totalTasks || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Tâches totales</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-2">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-teal-600">
                  {studentStats?.totalPomodoroMinutes || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Minutes Pomodoro</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-2">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-amber-600">{completionRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Taux de complétion</div>
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                👨‍🏫 Dashboard Coach
              </h1>
              <p className="text-gray-600 mt-1">Bienvenue {coachName}</p>
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
        <Card className="rounded-3xl shadow-lg border-2">
          <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardTitle className="text-2xl font-bold text-indigo-900">
              📚 Mes Élèves ({students.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">Aucun élève pour le moment</p>
                <p className="text-sm mt-2">
                  Les nouveaux élèves apparaîtront ici après leur inscription
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500">
                        <AvatarFallback className="text-white text-lg font-bold">
                          {getInitials(student.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                          {student.full_name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-1 bg-emerald-50 text-emerald-600 border-emerald-200"
                        >
                          Élève
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Voir le dashboard →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Infos */}
        <div className="mt-8 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            💡 Conseil
          </h3>
          <p className="text-gray-600">
            Clique sur un élève pour accéder à son dashboard personnel et gérer ses tâches en temps réel.
            Toutes les modifications que tu fais sont synchronisées instantanément !
          </p>
        </div>
      </main>
    </div>
  )
}
