import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './auth';

type AuthedHandler = (
  req: NextRequest,
  ctx: { userId: string; params?: Record<string, string> },
) => Promise<NextResponse>;

export function withAuth(handler: AuthedHandler) {
  return async (req: NextRequest, ctx?: { params?: Record<string, string> }) => {
    const header = req.headers.get('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const payload = verifyJwt(token);
      return await handler(req, { userId: payload.sub, params: ctx?.params });
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
