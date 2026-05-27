import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const isLoggedIn = !!token
  const isLoginPage = req.nextUrl.pathname === '/login'

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/customers', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}