'use client'

import { useState, useCallback } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Check, Plus, Trash2, Calendar, FileText } from 'lucide-react'
import confetti from 'canvas-confetti'
import { InfoModal } from './InfoModal'

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

function ActionPlanInfo() {
  return (
    <>
      <p>
        <strong className="text-neutral-100">Le Plan d'Action</strong> est ton outil pour organiser et suivre tes tâches. C'est bien plus qu'une simple to-do list !
      </p>
      
      <div className="bg-neutral-800 rounded-lg p-3">
        <p className="font-medium text-neutral-100 mb-2">Les 3 niveaux de priorité</p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-red-400 font-bold">Urgent</span>
            <span className="text-neutral-400">- À faire aujourd'hui, deadline proche</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">Important</span>
            <span className="text-neutral-400">- À faire cette semaine, tâche clé</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">Normal</span>
            <span className="text-neutral-400">- À faire quand possible</span>
          </li>
        </ul>
      </div>

      <div>
        <p className="font-medium text-neutral-100 mb-2">Pourquoi utiliser un plan d'action ?</p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Libère ton esprit</strong> : plus besoin de tout retenir, c'est écrit</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Visualise ta progression</strong> : chaque tâche cochée = une victoire</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Priorise intelligemment</strong> : fais d'abord ce qui compte vraiment</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Partage avec ton coach</strong> : il voit tes progrès en temps réel</span>
          </li>
        </ul>
      </div>

      <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
        <p className="text-violet-300 text-sm">
          <strong>Astuce :</strong> Découpe les grosses tâches en petites étapes. "Réviser les maths" devient "Faire les exercices p.42", "Relire le cours chapitre 3", etc. C'est plus motivant !
        </p>
      </div>
    </>
  )
}

export function ActionPlan({ studentId, isCoach = false, studentName }: ActionPlanProps) {
  const { tasks, loading, toggleTask, addTask, deleteTask } = useTasks(studentId)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
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
    await addTask(newTaskTitle, newTaskPriority, newTaskDueDate, newTaskDescription)
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskDueDate('')
    setNewTaskPriority(2)
    setIsAdding(false)
  }

  const completedCount = tasks.filter((t) => t.status).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(dateStr)
    taskDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: 'En retard', color: 'text-red-400' }
    if (diffDays === 0) return { text: 'Aujourd\'hui', color: 'text-amber-400' }
    if (diffDays === 1) return { text: 'Demain', color: 'text-teal-400' }
    if (diffDays <= 7) return { text: `Dans ${diffDays}j`, color: 'text-teal-400' }
    
    return { text: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), color: 'text-neutral-400' }
  }

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
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-neutral-100">Plan d'Action</h2>
            <InfoModal title="Le Plan d'Action">
              <ActionPlanInfo />
            </InfoModal>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-neutral-100">{completedCount}</span>
            <span className="text-neutral-500">/{totalCount}</span>
            {studentName && <p className="text-xs text-neutral-500">{studentName}</p>}
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
          tasks.map((task) => {
            const dueDateInfo = formatDate(task.due_date)
            return (
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
                  <p className={`text-sm font-medium ${task.status ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                    {task.title}
                  </p>
                  
                  {task.description && (
                    <p className="text-xs text-neutral-500 mt-1 flex items-start gap-1">
                      <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{task.description}</span>
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs ${priorityConfig[task.priority as 1|2|3].color}`}>
                      {priorityConfig[task.priority as 1|2|3].label}
                    </span>
                    
                    {dueDateInfo && (
                      <>
                        <span className="text-neutral-600">•</span>
                        <span className={`text-xs flex items-center gap-1 ${dueDateInfo.color}`}>
                          <Calendar className="w-3 h-3" />
                          {dueDateInfo.text}
                        </span>
                      </>
                    )}
                  </div>
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
            )
          })
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
            
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description (optionnelle)..."
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:outline-none resize-none"
              rows={2}
            />
            
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:border-violet-500 focus:outline-none"
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
                onClick={() => { 
                  setIsAdding(false); 
                  setNewTaskTitle(''); 
                  setNewTaskDescription(''); 
                  setNewTaskDueDate(''); 
                }}
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
