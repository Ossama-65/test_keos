import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'prospect_auth';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  // Simple session - just store user ID
  // In production, use a proper JWT or session token
  cookieStore.set(AUTH_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

// Simple user verification
// In production, this would check against a database
export async function verifyUser(password: string): Promise<boolean> {
  const correctPassword = process.env.AUTH_PASSWORD || 'admin123';
  return password === correctPassword;
}

