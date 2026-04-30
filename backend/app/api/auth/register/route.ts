import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { signJwt } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { RegisterSchema } from '@better-you/shared';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { email, name, password } = parsed.data;

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);

  const result = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({ email, name, passwordHash })
      .returning({ id: users.id, email: users.email, name: users.name });

    return { token: signJwt(user.id), user };
  });

  return NextResponse.json({ data: result }, { status: 201 });
}
