'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'

type PomodoroSession = Database['public']['Tables']['pomodoro_sessions']['Row']

export function usePomodoroSessions(studentId: string | null) {
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!studentId) {
      setLoading(false)
      return
    }

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des sessions:', error)
      } else {
        setSessions(data || [])
      }
      setLoading(false)
    }

    fetchSessions()

    // Setup realtime subscription
    const channel = supabase
      .channel(`pomodoro_sessions:student_id=eq.${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pomodoro_sessions',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSessions((current) => [payload.new as PomodoroSession, ...current])
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [studentId])

  const createSession = async (
    duration: number,
    status: 'completed' | 'abandoned'
  ) => {
    if (!studentId) return

    const { error } = await supabase
      .from('pomodoro_sessions')
      .insert({
        student_id: studentId,
        duration,
        status,
      })

    if (error) {
      console.error("Erreur lors de la création de la session:", error)
    }
  }

  const getTotalCompletedTime = () => {
    return sessions
      .filter((s) => s.status === 'completed')
      .reduce((acc, s) => acc + s.duration, 0)
  }

  const getCompletedSessionsCount = () => {
    return sessions.filter((s) => s.status === 'completed').length
  }

  return {
    sessions,
    loading,
    createSession,
    getTotalCompletedTime,
    getCompletedSessionsCount,
  }
}
