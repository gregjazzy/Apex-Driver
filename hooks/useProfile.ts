'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'

type Profile = Database['public']['Tables']['apexdriver_profiles']['Row']

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from('apexdriver_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Erreur lors du chargement du profil:', error)
        } else {
          setProfile(data)
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  return { profile, loading, isCoach: profile?.role === 'coach' }
}
