'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Titre */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-7xl font-bold text-neutral-100 mb-4">
            Apex Dashboard
          </h1>
          <p className="text-xl sm:text-2xl text-neutral-400">
            Organise tes tâches et maximise ta productivité
          </p>
        </div>

        {/* Description */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mb-8">
          <p className="text-lg text-neutral-300 leading-relaxed">
            Un outil simple et efficace pour gérer ton travail : Plan d'Action pour tes tâches, 
            technique Pomodoro pour la concentration, et suivi en temps réel avec ton coach.
          </p>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/auth/login"
            className="w-full sm:w-64 py-4 px-8 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Se connecter
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 mb-2">Plan d'Action</h3>
            <p className="text-neutral-400 text-sm">
              Organise tes tâches par priorité et coche-les au fur et à mesure
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 mb-2">Pomodoro</h3>
            <p className="text-neutral-400 text-sm">
              25 minutes de concentration intense, 5 minutes de pause. Simple et efficace
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 mb-2">Suivi en temps réel</h3>
            <p className="text-neutral-400 text-sm">
              Ton coach voit ta progression instantanément et peut t'accompagner
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
