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
  1: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  2: { label: 'Important', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  3: { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
}

const progressOptions = [0, 25, 50, 75, 100]

function ActionPlanInfo() {
  return (
    <p><strong className="text-neutral-100">Plan d'Action</strong> : Clique sur une tâche pour voir les détails et modifier.</p>
  )
}

export function ActionPlan({ studentId, isCoach = false, studentName }: ActionPlanProps) {
  const { tasks, loading, updateProgress, updateTask, addTask, deleteTask } = useTasks(studentId)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  // Form state
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
    resetForm()
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return
    await deleteTask(selectedTask.id)
    setSelectedTask(null)
  }

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormDueDate('')
    setFormPriority(2)
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
  const overallProgress = totalCount > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / totalCount) : 0

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
        <p className="text-neutral-500 text-center">Chargement...</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-100">Plan d'Action</h2>
              <InfoModal title="Plan d'Action"><ActionPlanInfo /></InfoModal>
            </div>
            <span className="text-sm text-neutral-400">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="text-xs text-neutral-500 mt-1">{overallProgress}% complété</p>
        </div>

        {/* Liste simple */}
        <div className="divide-y divide-neutral-800 max-h-96 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="p-8 text-center text-neutral-500">Aucune tâche</p>
          ) : (
            tasks.map((task) => {
              const dueDateInfo = formatDate(task.due_date)
              return (
                <div
                  key={task.id}
                  onClick={() => openTask(task)}
                  className="p-4 hover:bg-neutral-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleProgressChange(task.id, task.progress === 100 ? 0 : 100) }}
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                        task.progress === 100 ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600 hover:border-violet-500'
                      }`}
                    >
                      {task.progress === 100 && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.progress === 100 ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${priorityConfig[task.priority as 1|2|3].bg} ${priorityConfig[task.priority as 1|2|3].color}`}>
                          {priorityConfig[task.priority as 1|2|3].label}
                        </span>
                        {dueDateInfo && (
                          <span className={`text-xs flex items-center gap-1 ${dueDateInfo.color}`}>
                            <Calendar className="w-3 h-3" />{dueDateInfo.text}
                          </span>
                        )}
                        {task.description && (
                          <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />Notes
                          </span>
                        )}
                      </div>
                      {/* Progress mini */}
                      {task.progress > 0 && task.progress < 100 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500" style={{ width: `${task.progress}%` }} />
                          </div>
                          <span className="text-xs text-neutral-500">{task.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Add button */}
        <div className="p-4 border-t border-neutral-800">
          {!isAdding ? (
            <button onClick={() => setIsAdding(true)} className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />Ajouter
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="space-y-3">
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Titre de la tâche..." className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:outline-none" autoFocus />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-violet-600 text-white rounded-lg">Ajouter</button>
                <button type="button" onClick={() => { setIsAdding(false); resetForm() }} className="flex-1 py-2 bg-neutral-800 text-neutral-300 rounded-lg">Annuler</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal détail */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedTask(null)} />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-100">Détail de la tâche</h3>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Qui */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase mb-1 block">Qui</label>
                <p className="text-neutral-200">{studentName || 'Élève'}</p>
              </div>
              
              {/* Quoi */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase mb-1 block">Quoi</label>
                <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:border-violet-500 focus:outline-none" />
              </div>
              
              {/* Description / Commentaires */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase mb-1 block">Description / Commentaires</label>
                <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Ajouter des notes, des détails..." className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:outline-none resize-none" rows={4} />
              </div>
              
              {/* Quand */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase mb-1 block">Quand (date limite)</label>
                <input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:border-violet-500 focus:outline-none" />
              </div>
              
              {/* Priorité */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase mb-1 block">Priorité</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((p) => (
                    <button key={p} type="button" onClick={() => setFormPriority(p as 1|2|3)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${formPriority === p ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {priorityConfig[p as 1|2|3].label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Avancement */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase mb-1 block">Avancement</label>
                <div className="flex gap-2">
                  {progressOptions.map((p) => (
                    <button key={p} onClick={() => handleProgressChange(selectedTask.id, p)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedTask.progress === p ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-neutral-800 flex gap-2">
              <button onClick={handleSaveTask} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium">Enregistrer</button>
              {isCoach && (
                <button onClick={handleDeleteTask} className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
