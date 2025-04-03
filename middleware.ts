import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // This will refresh the user's session if it's expired
  await supabase.auth.getSession()

  // Get the current URL and path
  const url = req.nextUrl.clone()
  const path = url.pathname

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle authentication redirects
  if (!session) {
    // If the user is not logged in and trying to access protected routes
    if (
      !path.startsWith('/auth') && 
      !path.startsWith('/api') && 
      !path.startsWith('/_next') &&
      !path.includes('.') // Skip static files
    ) {
      const redirectUrl = new URL('/auth', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // If the user is logged in and trying to access auth pages
    if (path.startsWith('/auth')) {
      const redirectUrl = new URL('/mail', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Handle success query param - to remove it after first load
    if (path === '/mail' && url.searchParams.has('success')) {
      // Clone the URL and remove the success parameter
      const cleanUrl = new URL('/mail', req.url)
      return NextResponse.redirect(cleanUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 