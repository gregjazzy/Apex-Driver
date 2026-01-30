'use client'

import { useState, useEffect, useRef } from 'react'
import { usePomodoroSessions } from '@/hooks/usePomodoroSessions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, X } from 'lucide-react'

interface PomodoroTimerProps {
  studentId: string
}

const POMODORO_DURATION = 25 * 60 // 25 minutes en secondes
const SHORT_BREAK = 5 * 60 // 5 minutes
const LONG_BREAK = 15 * 60 // 15 minutes

export function PomodoroTimer({ studentId }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work')
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const { createSession, getTotalCompletedTime, getCompletedSessionsCount } =
    usePomodoroSessions(studentId)

  const totalMinutes = getTotalCompletedTime()
  const sessionsCount = getCompletedSessionsCount()

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = async () => {
    setIsRunning(false)

    if (mode === 'work') {
      // Enregistrer la session Pomodoro complétée
      await createSession(25, 'completed')
      setPomodorosCompleted((prev) => prev + 1)

      // Jouer un son (optionnel)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Pomodoro terminé ! 🎉', {
            body: 'Prends une pause bien méritée !',
          })
        }
      }

      // Passer automatiquement à la pause
      if ((pomodorosCompleted + 1) % 4 === 0) {
        setMode('long')
        setTimeLeft(LONG_BREAK)
      } else {
        setMode('short')
        setTimeLeft(SHORT_BREAK)
      }
    } else {
      // Fin de pause, retour au travail
      setMode('work')
      setTimeLeft(POMODORO_DURATION)
    }
  }

  const handleStart = () => {
    setIsRunning(true)
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    startTimeRef.current = null
    if (mode === 'work') {
      setTimeLeft(POMODORO_DURATION)
    } else if (mode === 'short') {
      setTimeLeft(SHORT_BREAK)
    } else {
      setTimeLeft(LONG_BREAK)
    }
  }

  const handleAbandon = async () => {
    if (mode === 'work' && startTimeRef.current) {
      const elapsedMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000)
      if (elapsedMinutes > 0) {
        await createSession(elapsedMinutes, 'abandoned')
      }
    }
    setIsRunning(false)
    setMode('work')
    setTimeLeft(POMODORO_DURATION)
    startTimeRef.current = null
  }

  const handleModeChange = (newMode: 'work' | 'short' | 'long') => {
    setIsRunning(false)
    setMode(newMode)
    startTimeRef.current = null

    if (newMode === 'work') {
      setTimeLeft(POMODORO_DURATION)
    } else if (newMode === 'short') {
      setTimeLeft(SHORT_BREAK)
    } else {
      setTimeLeft(LONG_BREAK)
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const totalDuration =
    mode === 'work' ? POMODORO_DURATION : mode === 'short' ? SHORT_BREAK : LONG_BREAK
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100

  // Calcul pour le cercle SVG
  const radius = 140
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const modeConfig = {
    work: {
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      label: 'Concentration',
      strokeColor: '#6366f1',
    },
    short: {
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-teal-50',
      label: 'Pause Courte',
      strokeColor: '#14b8a6',
    },
    long: {
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      label: 'Grande Pause',
      strokeColor: '#f59e0b',
    },
  }

  const currentConfig = modeConfig[mode]

  return (
    <Card className="rounded-2xl sm:rounded-3xl shadow-lg border-2 overflow-hidden">
      <CardHeader className={`${currentConfig.bgColor} pb-4 sm:pb-6`}>
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center">
          {currentConfig.label}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 lg:p-8">
        {/* Statistiques - Mobile adapté */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-700">{sessionsCount}</div>
            <div className="text-xs sm:text-sm text-indigo-600 mt-1">Sessions</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl">
            <div className="text-2xl sm:text-3xl font-bold text-teal-700">{totalMinutes}</div>
            <div className="text-xs sm:text-sm text-teal-600 mt-1">Minutes</div>
          </div>
        </div>

        {/* Timer circulaire - Responsive */}
        <div className="relative flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
          <svg className="transform -rotate-90 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80" viewBox="0 0 320 320">
            {/* Cercle de fond */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="20"
              fill="none"
            />
            {/* Cercle de progression */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke={currentConfig.strokeColor}
              strokeWidth="20"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Temps affiché au centre - Mobile adapté */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-800 tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm lg:text-lg text-gray-500 mt-1 sm:mt-2 text-center">
              {mode === 'work' ? 'Concentré !' : 'Profite !'}
            </div>
          </div>
        </div>

        {/* Sélecteur de mode - Mobile optimisé */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => handleModeChange('work')}
            className={`
              flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all
              ${
                mode === 'work'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <span className="hidden sm:inline">Pomodoro</span>
            <span className="sm:hidden">25m</span>
          </button>
          <button
            onClick={() => handleModeChange('short')}
            className={`
              flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all
              ${
                mode === 'short'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <span className="hidden sm:inline">Pause 5m</span>
            <span className="sm:hidden">5m</span>
          </button>
          <button
            onClick={() => handleModeChange('long')}
            className={`
              flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all
              ${
                mode === 'long'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <span className="hidden sm:inline">Pause 15m</span>
            <span className="sm:hidden">15m</span>
          </button>
        </div>

        {/* Contrôles - Mobile touch-friendly */}
        <div className="flex gap-2 sm:gap-3">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className={`flex-1 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r ${currentConfig.color} hover:opacity-90 active:scale-95 transition-transform`}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 sm:mr-2" />
              <span className="hidden sm:inline">Démarrer</span>
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              className="flex-1 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg font-semibold bg-gray-700 hover:bg-gray-800 active:scale-95 transition-transform"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 sm:mr-2" />
              <span className="hidden sm:inline">Pause</span>
            </Button>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            className="h-12 sm:h-14 lg:h-16 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {(isRunning || timeLeft < totalDuration) && (
            <Button
              onClick={handleAbandon}
              variant="outline"
              className="h-12 sm:h-14 lg:h-16 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 active:scale-95 transition-transform"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
        </div>

        {/* Pomodoros aujourd'hui */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all
                ${
                  i < pomodorosCompleted % 4
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                    : 'bg-gray-200'
                }
              `}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
