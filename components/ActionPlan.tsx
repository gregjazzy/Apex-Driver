'use client'

import { useState, useCallback } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Plus, Trash2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ActionPlanProps {
  studentId: string
  isCoach?: boolean
  studentName?: string
}

const priorityColors = {
  1: 'bg-red-500/10 text-red-600 border-red-200',
  2: 'bg-amber-500/10 text-amber-600 border-amber-200',
  3: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
}

const priorityLabels = {
  1: 'Urgent',
  2: 'Important',
  3: 'Normal',
}

export function ActionPlan({ studentId, isCoach = false, studentName }: ActionPlanProps) {
  const { tasks, loading, toggleTask, addTask, deleteTask } = useTasks(studentId)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<1 | 2 | 3>(2)
  const [isAdding, setIsAdding] = useState(false)

  const fireConfetti = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [])

  const handleToggle = async (taskId: string, currentStatus: boolean) => {
    await toggleTask(taskId, currentStatus)
    if (!currentStatus) {
      // La tâche vient d'être complétée
      fireConfetti()
    }
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
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (loading) {
    return (
      <Card className="rounded-3xl shadow-lg border-2">
        <CardContent className="p-12 text-center">
          <div className="animate-pulse text-lg">Chargement...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-3xl shadow-lg border-2 overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-indigo-900">
              📋 Plan d'Action
            </CardTitle>
            {studentName && (
              <p className="text-sm text-indigo-600 mt-1">{studentName}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-indigo-700">
              {completedCount}/{totalCount}
            </div>
            <div className="text-sm text-indigo-600">tâches complétées</div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-4 h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-3">
        {/* Liste des tâches */}
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Aucune tâche pour le moment</p>
            <p className="text-sm mt-2">Commence par en ajouter une ! 🚀</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`
                group relative p-5 rounded-2xl border-2 transition-all duration-300
                ${
                  task.status
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(task.id, task.status)}
                  className={`
                    flex-shrink-0 w-7 h-7 rounded-full border-3 transition-all duration-300
                    ${
                      task.status
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-600'
                        : 'border-gray-300 hover:border-indigo-500'
                    }
                    flex items-center justify-center
                  `}
                >
                  {task.status && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
                </button>

                {/* Contenu de la tâche */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`
                      text-lg font-medium transition-all
                      ${
                        task.status
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }
                    `}
                  >
                    {task.title}
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${priorityColors[task.priority as 1 | 2 | 3]}`}
                  >
                    {priorityLabels[task.priority as 1 | 2 | 3]}
                  </Badge>
                </div>

                {/* Bouton supprimer (coach uniquement) */}
                {isCoach && (
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Formulaire d'ajout (coach uniquement) */}
        {isCoach && (
          <div className="pt-4">
            {!isAdding ? (
              <Button
                onClick={() => setIsAdding(true)}
                className="w-full rounded-2xl h-14 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter une tâche
              </Button>
            ) : (
              <form onSubmit={handleAddTask} className="space-y-3 p-5 bg-indigo-50/50 rounded-2xl">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Titre de la tâche..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-lg"
                  autoFocus
                />
                
                <div className="flex gap-2">
                  {[1, 2, 3].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setNewTaskPriority(priority as 1 | 2 | 3)}
                      className={`
                        flex-1 py-2 rounded-xl text-sm font-medium transition-all
                        ${
                          newTaskPriority === priority
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-indigo-300'
                        }
                      `}
                    >
                      {priorityLabels[priority as 1 | 2 | 3]}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                  >
                    Ajouter
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false)
                      setNewTaskTitle('')
                      setNewTaskPriority(2)
                    }}
                    className="flex-1 rounded-xl"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
