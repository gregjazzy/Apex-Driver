'use client'

import { useState, useCallback } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Check, Plus, Trash2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ActionPlanProps {
  studentId: string
  isCoach?: boolean
  studentName?: string
  canAddTasks?: boolean
}

const priorityConfig = {
  1: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-500/10' },
  2: { label: 'Important', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  3: { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
}

export function ActionPlan({ studentId, isCoach = false, studentName }: ActionPlanProps) {
  const { tasks, loading, toggleTask, addTask, deleteTask } = useTasks(studentId)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<1 | 2 | 3>(2)
  const [isAdding, setIsAdding] = useState(false)

  const fireConfetti = useCallback(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 9999 })
  }, [])

  const handleToggle = async (taskId: string, currentStatus: boolean) => {
    await toggleTask(taskId, currentStatus)
    if (!currentStatus) fireConfetti()
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    await addTask(newTaskTitle, newTaskPriority)
    setNewTaskTitle('')
    setNewTaskPriority(2)
    setIsAdding(false)
  }

  const completedCount = tasks.filter((t) => t.status).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
        <p className="text-neutral-500 text-center">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">Plan d'Action</h2>
            {studentName && <p className="text-sm text-neutral-500">{studentName}</p>}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-neutral-100">{completedCount}</span>
            <span className="text-neutral-500">/{totalCount}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">Aucune tâche</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                task.status 
                  ? 'bg-neutral-800/50 border-neutral-800 opacity-50' 
                  : 'bg-neutral-800/30 border-neutral-700/50 hover:border-neutral-600'
              }`}
            >
              <button
                onClick={() => handleToggle(task.id, task.status)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  task.status 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-neutral-600 hover:border-violet-500'
                }`}
              >
                {task.status && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.status ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                  {task.title}
                </p>
                <span className={`text-xs ${priorityConfig[task.priority as 1|2|3].color}`}>
                  {priorityConfig[task.priority as 1|2|3].label}
                </span>
              </div>

              {isCoach && (
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add form */}
      <div className="p-4 border-t border-neutral-800">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une tâche
          </button>
        ) : (
          <form onSubmit={handleAddTask} className="space-y-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Titre de la tâche..."
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:outline-none"
              autoFocus
            />
            
            <div className="flex gap-2">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewTaskPriority(p as 1|2|3)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    newTaskPriority === p
                      ? 'bg-violet-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {priorityConfig[p as 1|2|3].label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setNewTaskTitle(''); }}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
