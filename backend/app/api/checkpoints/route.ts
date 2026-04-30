import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { checkpoints, goals } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq } from 'drizzle-orm';
import { CreateCheckpointSchema } from '@better-you/shared';

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateCheckpointSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { goalId, ...rest } = parsed.data;

  // Verify ownership
  const [owned] = await db
    .select({ id: goals.id, userId: goals.userId })
    .from(goals)
    .where(eq(goals.id, goalId))
    .limit(1);

  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (owned.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [created] = await db
    .insert(checkpoints)
    .values({ goalId, ...rest })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
});
