'use client'

import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

interface InfoModalProps {
  title: string
  children: React.ReactNode
}

export function InfoModal({ title, children }: InfoModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Bouton aide */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors shadow-lg"
        title="En savoir plus"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Aide</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-4 overflow-y-auto max-h-[60vh] text-neutral-300 text-sm leading-relaxed space-y-4">
              {children}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-800">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
