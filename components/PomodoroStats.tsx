'use client'

import { useEffect, useState } from 'react'
import { usePomodoroSessions } from '@/hooks/usePomodoroSessions'
import { BarChart3 } from 'lucide-react'

interface PomodoroStatsProps {
  studentId: string
}

interface DayStats {
  date: string
  sessions: number
  minutes: number
}

export function PomodoroStats({ studentId }: PomodoroStatsProps) {
  const { sessions, getTotalCompletedTime, getCompletedSessionsCount } = usePomodoroSessions(studentId)
  const [weekStats, setWeekStats] = useState<DayStats[]>([])

  useEffect(() => {
    if (sessions.length === 0) return

    // Obtenir les 7 derniers jours
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    // Grouper les sessions par jour
    const statsByDay: Record<string, DayStats> = {}
    
    last7Days.forEach(date => {
      statsByDay[date] = { date, sessions: 0, minutes: 0 }
    })

    sessions.forEach(session => {
      if (session.status === 'completed' && session.created_at) {
        const sessionDate = new Date(session.created_at).toISOString().split('T')[0]
        if (statsByDay[sessionDate]) {
          statsByDay[sessionDate].sessions += 1
          statsByDay[sessionDate].minutes += session.duration
        }
      }
    })

    setWeekStats(Object.values(statsByDay))
  }, [sessions])

  const maxSessions = Math.max(...weekStats.map(d => d.sessions), 1)
  const maxMinutes = Math.max(...weekStats.map(d => d.minutes), 1)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return days[date.getDay()]
  }

  const totalSessions = getCompletedSessionsCount()
  const totalMinutes = getTotalCompletedTime()

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-neutral-100">Statistiques Pomodoro</h2>
        </div>
      </div>

      <div className="p-6">
        {/* Stats globales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-neutral-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">{totalSessions}</div>
            <div className="text-sm text-neutral-500 mt-1">Sessions totales</div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-teal-400">{totalMinutes}</div>
            <div className="text-sm text-neutral-500 mt-1">Minutes totales</div>
          </div>
        </div>

        {/* Graphique 7 derniers jours */}
        <div>
          <h3 className="text-sm font-medium text-neutral-400 mb-4">7 derniers jours</h3>
          
          {/* Graphique sessions */}
          <div className="mb-6">
            <p className="text-xs text-neutral-500 mb-2">Nombre de sessions</p>
            <div className="flex items-end gap-2 h-32">
              {weekStats.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-neutral-800 rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                    <div 
                      className="absolute bottom-0 w-full bg-violet-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(day.sessions / maxSessions) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-neutral-500">{formatDate(day.date)}</div>
                  <div className="text-sm font-semibold text-neutral-300">{day.sessions}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphique minutes */}
          <div>
            <p className="text-xs text-neutral-500 mb-2">Minutes travaillées</p>
            <div className="flex items-end gap-2 h-32">
              {weekStats.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-neutral-800 rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                    <div 
                      className="absolute bottom-0 w-full bg-teal-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-neutral-500">{formatDate(day.date)}</div>
                  <div className="text-sm font-semibold text-neutral-300">{day.minutes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message si pas de données */}
        {totalSessions === 0 && (
          <div className="text-center py-8 text-neutral-500">
            <p>Aucune session Pomodoro pour le moment</p>
            <p className="text-sm mt-1">Commence une session pour voir tes stats !</p>
          </div>
        )}
      </div>
    </div>
  )
}
