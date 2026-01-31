'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'
import { RealtimeChannel } from '@supabase/supabase-js'

type Task = Database['public']['Tables']['apexdriver_tasks']['Row']

export function useTasks(studentId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!studentId) {
      setLoading(false)
      return
    }

    let channel: RealtimeChannel

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('apexdriver_tasks')
        .select('*')
        .eq('student_id', studentId)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des tâches:', error)
      } else {
        setTasks(data || [])
      }
      setLoading(false)
    }

    fetchTasks()

    // Setup realtime subscription
    channel = supabase
      .channel(`apexdriver_tasks:student_id=eq.${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'apexdriver_tasks',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((current) => [payload.new as Task, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setTasks((current) =>
              current.map((task) =>
                task.id === payload.new.id ? (payload.new as Task) : task
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks((current) =>
              current.filter((task) => task.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [studentId])

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const newProgress = !currentStatus ? 100 : 0
    const { error } = await supabase
      .from('apexdriver_tasks')
      .update({ 
        status: !currentStatus,
        progress: newProgress
      })
      .eq('id', taskId)

    if (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
    }
  }

  const updateProgress = async (taskId: string, progress: number) => {
    const status = progress === 100
    const { error } = await supabase
      .from('apexdriver_tasks')
      .update({ progress, status })
      .eq('id', taskId)

    if (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error)
    }
  }

  const updateTask = async (taskId: string, updates: {
    title?: string
    description?: string | null
    priority?: 1 | 2 | 3
    due_date?: string | null
  }) => {
    const { error } = await supabase
      .from('apexdriver_tasks')
      .update(updates)
      .eq('id', taskId)

    if (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
    }
  }

  const addTask = async (title: string, priority: 1 | 2 | 3, dueDate?: string, description?: string) => {
    if (!studentId) return

    const { error } = await supabase
      .from('apexdriver_tasks')
      .insert({
        student_id: studentId,
        title,
        priority,
        status: false,
        progress: 0,
        due_date: dueDate || null,
        description: description || null,
      })

    if (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('apexdriver_tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Erreur lors de la suppression de la tâche:', error)
    }
  }

  return { tasks, loading, toggleTask, updateProgress, updateTask, addTask, deleteTask }
}
