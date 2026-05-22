import { NextResponse, type NextRequest } from 'next/server'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth'

export const config = {
  matcher: ['/admin/:path*'],
}

export async function middleware(req: NextRequest) {
  // Allow login page through
  if (req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const session = await verifyAdminToken(token)
  if (!session) {
    const res = NextResponse.redirect(new URL('/admin/login', req.url))
    res.cookies.delete(ADMIN_COOKIE_NAME)
    return res
  }

  return NextResponse.next()
}
