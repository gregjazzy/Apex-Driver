'use client'

import { useState, useCallback } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react'
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
  1: { label: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  2: { label: 'Important', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  3: { label: 'Normal', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
}

const progressOptions = [0, 25, 50, 75, 100]

function ActionPlanInfo() {
  return (
    <>
      <p>
        <strong className="text-neutral-100">Le Plan d'Action</strong> organise les tâches selon la méthode QUI-QUOI-QUAND-AVANCEMENT.
      </p>
    </>
  )
}

export function ActionPlan({ studentId, isCoach = false, studentName }: ActionPlanProps) {
  const { tasks, loading, updateProgress, updateTask, addTask, deleteTask } = useTasks(studentId)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
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
  }

  const startEdit = (task: Task) => {
    setEditingTask(task)
    setFormTitle(task.title)
    setFormDescription(task.description || '')
    setFormDueDate(task.due_date || '')
    setFormPriority(task.priority)
  }

  const handleSaveEdit = async () => {
    if (!editingTask || !formTitle.trim()) return
    await updateTask(editingTask.id, {
      title: formTitle,
      description: formDescription || null,
      due_date: formDueDate || null,
      priority: formPriority
    })
    setEditingTask(null)
    resetForm()
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return
    await addTask(formTitle, formPriority, formDueDate, formDescription)
    setIsAdding(false)
    resetForm()
  }

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormDueDate('')
    setFormPriority(2)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return { text: 'Pas de date', color: 'text-neutral-500' }
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(dateStr)
    taskDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: date.toLocaleDateString('fr-FR'), color: 'text-red-400 font-semibold' }
    if (diffDays === 0) return { text: "Aujourd'hui", color: 'text-amber-400 font-semibold' }
    if (diffDays === 1) return { text: 'Demain', color: 'text-teal-400' }
    
    return { text: date.toLocaleDateString('fr-FR'), color: 'text-neutral-300' }
  }

  const completedCount = tasks.filter((t) => t.progress === 100).length
  const totalCount = tasks.length

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-neutral-100">Plan d'Action</h2>
            <InfoModal title="Plan d'Action">
              <ActionPlanInfo />
            </InfoModal>
          </div>
          <div className="text-sm text-neutral-400">
            {completedCount}/{totalCount} complétées
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-800/50 border-b border-neutral-800">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-neutral-400 uppercase">QUI</th>
              <th className="text-left p-3 text-xs font-semibold text-neutral-400 uppercase">QUOI</th>
              <th className="text-left p-3 text-xs font-semibold text-neutral-400 uppercase">QUAND</th>
              <th className="text-left p-3 text-xs font-semibold text-neutral-400 uppercase w-48">AVANCEMENT</th>
              <th className="text-right p-3 text-xs font-semibold text-neutral-400 uppercase w-24">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  Aucune tâche - Clique sur "Ajouter" pour commencer
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const isEditing = editingTask?.id === task.id
                const dueDateInfo = formatDate(task.due_date)
                
                if (isEditing) {
                  return (
                    <tr key={task.id} className="border-b border-neutral-800 bg-neutral-800">
                      <td className="p-3">
                        <div className="text-sm text-neutral-300 font-medium">{studentName || 'Élève'}</div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-sm text-neutral-200 focus:border-violet-500 focus:outline-none mb-1"
                          placeholder="Titre..."
                        />
                        <textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-xs text-neutral-300 focus:border-violet-500 focus:outline-none resize-none"
                          rows={2}
                          placeholder="Description..."
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={formDueDate}
                          onChange={(e) => setFormDueDate(e.target.value)}
                          className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-sm text-neutral-200 focus:border-violet-500 focus:outline-none"
                        />
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setFormPriority(p as 1|2|3)}
                              className={`px-2 py-0.5 rounded text-xs ${formPriority === p ? 'bg-violet-600 text-white' : 'bg-neutral-700 text-neutral-400'}`}
                            >
                              {priorityConfig[p as 1|2|3].label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-neutral-300">{task.progress}%</div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 justify-end">
                          <button onClick={handleSaveEdit} className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded text-xs">
                            OK
                          </button>
                          <button onClick={() => { setEditingTask(null); resetForm() }} className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded text-xs">
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }
                
                return (
                  <tr key={task.id} className="border-b border-neutral-800 hover:bg-neutral-800/30 group">
                    {/* QUI */}
                    <td className="p-3">
                      <div className="text-sm text-neutral-300 font-medium">{studentName || 'Élève'}</div>
                    </td>
                    
                    {/* QUOI */}
                    <td className="p-3">
                      <div className={`text-sm font-medium ${task.progress === 100 ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-xs text-neutral-500 mt-1">{task.description}</div>
                      )}
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs border ${priorityConfig[task.priority as 1|2|3].color}`}>
                        {priorityConfig[task.priority as 1|2|3].label}
                      </span>
                    </td>
                    
                    {/* QUAND */}
                    <td className="p-3">
                      <div className={`text-sm flex items-center gap-1 ${dueDateInfo.color}`}>
                        <Calendar className="w-3 h-3" />
                        {dueDateInfo.text}
                      </div>
                    </td>
                    
                    {/* AVANCEMENT */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex gap-0.5">
                          {progressOptions.map((p) => (
                            <button
                              key={p}
                              onClick={() => handleProgressChange(task.id, p)}
                              className={`flex-1 h-2 rounded-sm transition-all ${
                                task.progress >= p ? 'bg-violet-500' : 'bg-neutral-700 hover:bg-neutral-600'
                              }`}
                              title={`${p}%`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-neutral-300 w-10 text-right">{task.progress}%</span>
                      </div>
                    </td>
                    
                    {/* ACTIONS */}
                    <td className="p-3">
                      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(task)}
                          className="p-1.5 hover:bg-violet-500/10 rounded transition-all"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4 text-violet-400" />
                        </button>
                        {isCoach && (
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add form */}
      <div className="p-4 border-t border-neutral-800">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une tâche
          </button>
        ) : (
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Quoi ? (titre)"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:outline-none"
                autoFocus
              />
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Description..."
                className="w-full px-3 py-2 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 placeholder-neutral-500 focus:border-violet-500 focus:outline-none resize-none"
                rows={2}
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1">Quand ?</label>
              <input
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1">Priorité</label>
              <div className="flex gap-1">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormPriority(p as 1|2|3)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium ${
                      formPriority === p ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {priorityConfig[p as 1|2|3].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button type="submit" className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm">
                Ajouter
              </button>
              <button type="button" onClick={() => { setIsAdding(false); resetForm() }} className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm">
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
