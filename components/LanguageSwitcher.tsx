'use client'

import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border-2 border-gray-200">
      <button
        onClick={() => setLanguage('fr')}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${
            language === 'fr'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${
            language === 'en'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        🇬🇧 EN
      </button>
    </div>
  )
}
