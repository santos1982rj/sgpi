import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Skip middleware for auth pages and static files
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/auth/') || pathname.startsWith('/_next/') || pathname.startsWith('/api/')) {
    return
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|chave-oci\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
