import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Chemins publics
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isPublicPage = request.nextUrl.pathname === '/'

  // Si pas de session et essaie d'accéder à une page protégée
  if (!session && !isAuthPage && !isPublicPage) {
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si session existe et essaie d'accéder aux pages auth
  if (session && isAuthPage) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
