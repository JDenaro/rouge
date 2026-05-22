import { SignJWT, jwtVerify } from 'jose'

const ADMIN_COOKIE = 'rouge_admin_session'
const ALG = 'HS256'

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SECRET must be set (at least 16 chars)')
  }
  return new TextEncoder().encode(secret)
}

export type AdminSession = {
  email: string
  iat: number
  exp: number
}

export async function signAdminToken(email: string): Promise<string> {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey())
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: [ALG] })
    if (typeof payload.email !== 'string') return null
    return payload as unknown as AdminSession
  } catch {
    return null
  }
}

export function isAdminCredentials(email: string, password: string): boolean {
  const e = process.env.ADMIN_EMAIL
  const p = process.env.ADMIN_PASSWORD
  return !!e && !!p && email.trim().toLowerCase() === e.toLowerCase() && password === p
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE
