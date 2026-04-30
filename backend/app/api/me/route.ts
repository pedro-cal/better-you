import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq } from 'drizzle-orm';
import { PatchPreferencesSchema } from '@better-you/shared';

export const GET = withAuth(async (_req, { userId }) => {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      preferredLocale: users.preferredLocale,
      participationPhase: users.participationPhase,
      pointsBalance: users.pointsBalance,
      focusWallEnabled: users.focusWallEnabled,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: user });
});

export const PATCH = withAuth(async (req: NextRequest, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = PatchPreferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { preferredLocale, focusWallEnabled } = parsed.data;
  const updateValues: Record<string, unknown> = { updatedAt: new Date() };

  if (preferredLocale !== undefined) updateValues.preferredLocale = preferredLocale;
  if (focusWallEnabled !== undefined) updateValues.focusWallEnabled = focusWallEnabled;

  const [updated] = await db
    .update(users)
    .set(updateValues)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      preferredLocale: users.preferredLocale,
      focusWallEnabled: users.focusWallEnabled,
    });

  return NextResponse.json({ data: updated });
});
