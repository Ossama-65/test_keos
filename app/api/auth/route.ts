import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, createSession, deleteSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json();

    if (action === 'logout') {
      await deleteSession();
      return NextResponse.json({ success: true });
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    const isValid = await verifyUser(password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    await createSession('user');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

