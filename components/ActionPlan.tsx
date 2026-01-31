'use client'

import { useState, useCallback } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Check, Plus, Trash2, X, Calendar, MessageSquare } from 'lucide-react'
import confetti from 'canvas-confetti'
import { InfoModal } from './InfoModal'
import type { Database } from '@/lib/database.types'

type Task = Database['public']['Tables']['apexdriver_tasks']['Row']

interface ActionPlanProps {
  studentId: string
  isCoach?: boolean
  studentName?: string
}

const priorityConfig = {
  1: { label: 'Urgent', color: 'text-red-400' },
  2: { label: 'Important', color: 'text-amber-400' },
  3: { label: 'Normal', color: 'text-emerald-400' },
}

const progressOptions = [0, 25, 50, 75, 100]

export function ActionPlan({ studentId, isCoach = false, studentName }: ActionPlanProps) {
  const { tasks, loading, updateProgress, updateTask, addTask, deleteTask } = useTasks(studentId)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDueDate, setFormDueDate] = useState('')
  const [formPriority, setFormPriority] = useState<1 | 2 | 3>(2)

  const fireConfetti = useCallback(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 9999 })
  }, [])

  const handleProgressChange = async (taskId: string, progress: number) => {
    await updateProgress(taskId, progress)
    if (progress === 100) fireConfetti()
    // Update selectedTask if open
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, progress })
    }
  }

  const openTask = (task: Task) => {
    setSelectedTask(task)
    setFormTitle(task.title)
    setFormDescription(task.description || '')
    setFormDueDate(task.due_date || '')
    setFormPriority(task.priority)
  }

  const handleSaveTask = async () => {
    if (!selectedTask || !formTitle.trim()) return
    await updateTask(selectedTask.id, {
      title: formTitle,
      description: formDescription || null,
      due_date: formDueDate || null,
      priority: formPriority
    })
    setSelectedTask(null)
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return
    await addTask(formTitle, formPriority, formDueDate, formDescription)
    setIsAdding(false)
    setFormTitle('')
    setFormDescription('')
    setFormDueDate('')
    setFormPriority(2)
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return
    await deleteTask(selectedTask.id)
    setSelectedTask(null)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(dateStr)
    taskDate.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: 'En retard', color: 'text-red-400' }
    if (diffDays === 0) return { text: "Aujourd'hui", color: 'text-amber-400' }
    if (diffDays === 1) return { text: 'Demain', color: 'text-teal-400' }
    return { text: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), color: 'text-neutral-400' }
  }

  const completedCount = tasks.filter((t) => t.progress === 100).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (loading) {
    return <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800"><p className="text-neutral-500 text-center">Chargement...</p></div>
  }

  return (
    <>
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-100">Plan d'Action</h2>
              <InfoModal title="Plan d'Action"><p className="text-neutral-300">Clique sur une tâche pour voir les détails et modifier.</p></InfoModal>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-neutral-100">{completedCount}</span>
              <span className="text-neutral-500">/{totalCount}</span>
            </div>
          </div>
          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Cards list */}
        <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">Aucune tâche</p>
          ) : (
            tasks.map((task) => {
              const dueDateInfo = formatDate(task.due_date)
              return (
                <div
                  key={task.id}
                  onClick={() => openTask(task)}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-neutral-800/30 border-neutral-700/50 hover:border-violet-500/50 cursor-pointer transition-colors"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleProgressChange(task.id, task.progress === 100 ? 0 : 100) }}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      task.progress === 100 ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600 hover:border-violet-500'
                    }`}
                  >
                    {task.progress === 100 && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.progress === 100 ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-xs ${priorityConfig[task.priority as 1|2|3].color}`}>
                        {priorityConfig[task.priority as 1|2|3].label}
                      </span>
                      {dueDateInfo && (
                        <>
                          <span className="text-neutral-600">•</span>
                          <span className={`text-xs flex items-center gap-1 ${dueDateInfo.color}`}>
                            <Calendar className="w-3 h-3" />{dueDateInfo.text}
                          </span>
                        </>
                      )}
                      {task.description && (
                        <>
                          <span className="text-neutral-600">•</span>
                          <MessageSquare className="w-3 h-3 text-neutral-500" />
                        </>
                      )}
                      {task.progress > 0 && task.progress < 100 && (
                        <>
                          <span className="text-neutral-600">•</span>
                          <span className="text-xs text-violet-400">{task.progress}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Add */}
        <div className="p-4 border-t border-neutral-800">
          {!isAdding ? (
            <button onClick={() => setIsAdding(true)} className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />Ajouter
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="space-y-3">
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Titre..." className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:outline-none" autoFocus />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-violet-600 text-white rounded-lg">Ajouter</button>
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-neutral-800 text-neutral-300 rounded-lg">Annuler</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal détail */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedTask(null)} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-100">Détail</h3>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 hover:bg-neutral-800 rounded-lg"><X className="w-5 h-5 text-neutral-400" /></button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Qui</label>
                <p className="text-neutral-200">{studentName || 'Élève'}</p>
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Quoi</label>
                <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Commentaires</label>
                <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Notes..." className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:outline-none resize-none" rows={3} />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Quand</label>
                <input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Priorité</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((p) => (
                    <button key={p} type="button" onClick={() => setFormPriority(p as 1|2|3)} className={`flex-1 py-2 rounded-lg text-sm ${formPriority === p ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {priorityConfig[p as 1|2|3].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Avancement</label>
                <div className="flex gap-2">
                  {progressOptions.map((p) => (
                    <button key={p} onClick={() => handleProgressChange(selectedTask.id, p)} className={`flex-1 py-2 rounded-lg text-sm ${selectedTask.progress === p ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-neutral-800 flex gap-2">
              <button onClick={handleSaveTask} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium">Enregistrer</button>
              {isCoach && (
                <button onClick={handleDeleteTask} className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-5 h-5" /></button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
