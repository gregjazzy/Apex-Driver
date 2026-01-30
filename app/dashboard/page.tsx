import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile, error } = await supabase
    .from('apexdriver_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile && !error) {
    if (profile.role === 'coach') {
      redirect('/dashboard/coach')
    } else {
      redirect('/dashboard/student')
    }
  }

  redirect('/auth/login')
}
