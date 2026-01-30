'use client'

import { useState, useEffect, useRef } from 'react'
import { usePomodoroSessions } from '@/hooks/usePomodoroSessions'
import { Play, Pause, RotateCcw, X } from 'lucide-react'
import { InfoModal } from './InfoModal'

interface PomodoroTimerProps {
  studentId: string
}

const DURATIONS = { work: 25 * 60, short: 5 * 60, long: 15 * 60 }

function PomodoroInfo() {
  return (
    <>
      <p>
        <strong className="text-neutral-100">La technique Pomodoro</strong> est une méthode de gestion du temps développée par Francesco Cirillo à la fin des années 1980.
      </p>
      
      <div className="bg-neutral-800 rounded-lg p-3">
        <p className="font-medium text-neutral-100 mb-2">Comment ça marche ?</p>
        <ol className="list-decimal list-inside space-y-1 text-neutral-400">
          <li>Choisis une tâche à accomplir</li>
          <li>Travaille pendant <span className="text-violet-400">25 minutes</span> sans interruption</li>
          <li>Prends une pause de <span className="text-teal-400">5 minutes</span></li>
          <li>Après 4 cycles, prends une pause longue de <span className="text-amber-400">15-30 minutes</span></li>
        </ol>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="font-medium text-blue-300 mb-2">📊 Les bases scientifiques</p>
        <ul className="space-y-2 text-neutral-400 text-sm">
          <li>
            <strong className="text-neutral-200">Attention soutenue limitée :</strong> Ton cerveau ne peut maintenir une concentration maximale que 20-30 minutes avant que l'efficacité diminue.
          </li>
          <li>
            <strong className="text-neutral-200">Consolidation mémorielle :</strong> Les pauses permettent à ton hippocampe de transférer les infos de la mémoire de travail vers la mémoire à long terme.
          </li>
          <li>
            <strong className="text-neutral-200">Repos du cortex préfrontal :</strong> Cette zone du cerveau, responsable de la concentration et des décisions, se fatigue vite. Les pauses la "rechargent".
          </li>
          <li>
            <strong className="text-neutral-200">Effet Zeigarnik :</strong> Notre cerveau retient mieux les tâches inachevées. Après une pause, tu reviens avec plus de motivation !
          </li>
        </ul>
      </div>

      <div>
        <p className="font-medium text-neutral-100 mb-2">Pourquoi c'est efficace ?</p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Combat la procrastination</strong> : 25 minutes paraît gérable, même pour les tâches difficiles</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Améliore la concentration</strong> : ton cerveau sait qu'une pause arrive, donc il reste focalisé</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Réduit la fatigue mentale</strong> : les pauses régulières évitent l'épuisement</span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-400">•</span>
            <span><strong className="text-neutral-200">Mesure ta productivité</strong> : tu vois concrètement combien de sessions tu as faites</span>
          </li>
        </ul>
      </div>

      <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
        <p className="text-violet-300 text-sm">
          <strong>Astuce :</strong> Pendant un Pomodoro, si une distraction arrive (idée, notification...), note-la rapidement et reviens à ta tâche. Tu t'en occuperas pendant la pause !
        </p>
      </div>
    </>
  )
}

export function PomodoroTimer({ studentId }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work')
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const { createSession, getTotalCompletedTime, getCompletedSessionsCount } = usePomodoroSessions(studentId)
  const totalMinutes = getTotalCompletedTime()
  const sessionsCount = getCompletedSessionsCount()

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { handleTimerComplete(); return 0 }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, timeLeft])

  const handleTimerComplete = async () => {
    setIsRunning(false)
    if (mode === 'work') {
      await createSession(25, 'completed')
      setPomodorosCompleted((prev) => prev + 1)
      const nextMode = (pomodorosCompleted + 1) % 4 === 0 ? 'long' : 'short'
      setMode(nextMode)
      setTimeLeft(DURATIONS[nextMode])
    } else {
      setMode('work')
      setTimeLeft(DURATIONS.work)
    }
  }

  const handleStart = () => { setIsRunning(true); if (!startTimeRef.current) startTimeRef.current = Date.now() }
  const handlePause = () => setIsRunning(false)
  const handleReset = () => { setIsRunning(false); startTimeRef.current = null; setTimeLeft(DURATIONS[mode]) }
  
  const handleAbandon = async () => {
    if (mode === 'work' && startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 60000)
      if (elapsed > 0) await createSession(elapsed, 'abandoned')
    }
    setIsRunning(false); setMode('work'); setTimeLeft(DURATIONS.work); startTimeRef.current = null
  }

  const handleModeChange = (newMode: 'work' | 'short' | 'long') => {
    setIsRunning(false); setMode(newMode); startTimeRef.current = null; setTimeLeft(DURATIONS[newMode])
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const modeColors = {
    work: '#8b5cf6',
    short: '#14b8a6',
    long: '#f59e0b',
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="w-8" /> {/* Spacer */}
          <h2 className="text-lg font-semibold text-neutral-100">
            {mode === 'work' ? 'Concentration' : mode === 'short' ? 'Pause Courte' : 'Grande Pause'}
          </h2>
          <InfoModal title="La technique Pomodoro">
            <PomodoroInfo />
          </InfoModal>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-neutral-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-violet-400">{sessionsCount}</div>
            <div className="text-xs text-neutral-500">Sessions</div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-teal-400">{totalMinutes}</div>
            <div className="text-xs text-neutral-500">Minutes</div>
          </div>
        </div>

        {/* Timer */}
        <div className="relative flex items-center justify-center mb-6">
          <svg className="transform -rotate-90 w-48 h-48" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} stroke="#262626" strokeWidth="8" fill="none" />
            <circle
              cx="100" cy="100" r={radius}
              stroke={modeColors[mode]}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-neutral-100 tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              {mode === 'work' ? 'Focus' : 'Pause'}
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-4">
          {(['work', 'short', 'long'] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-violet-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {m === 'work' ? '25m' : m === 'short' ? '5m' : '15m'}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              Démarrer
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {(isRunning || timeLeft < DURATIONS[mode]) && (
            <button
              onClick={handleAbandon}
              className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Pomodoro dots */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < pomodorosCompleted % 4 ? 'bg-violet-500' : 'bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
