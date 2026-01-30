'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function Home() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-4xl w-full text-center">
        {/* Logo et titre */}
        <div className="mb-12">
          <div className="text-8xl mb-6">🎓</div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            {t('appTitle')}
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Description */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-8 border-2 border-gray-200 shadow-xl">
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('appDescription')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/signup">
            <Button className="w-64 h-16 rounded-2xl text-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg">
              🚀 {t('getStarted')}
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button 
              variant="outline" 
              className="w-64 h-16 rounded-2xl text-xl font-semibold border-2 border-gray-300 hover:border-indigo-400 hover:bg-white/80"
            >
              {t('login')}
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-100">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2">{t('features.actionPlan.title')}</h3>
            <p className="text-gray-600">
              {t('features.actionPlan.description')}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100">
            <div className="text-4xl mb-3">⏱️</div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">{t('features.pomodoro.title')}</h3>
            <p className="text-gray-600">
              {t('features.pomodoro.description')}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-teal-100">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-teal-900 mb-2">{t('features.tracking.title')}</h3>
            <p className="text-gray-600">
              {t('features.tracking.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
