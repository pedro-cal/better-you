import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/src/db';
import { checkpoints, goals } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq } from 'drizzle-orm';

const CreateCheckpointSchema = z.object({
  goalId: z.string().uuid(),
  prompt1: z.string().max(500).optional(),
  prompt2: z.string().max(500).optional(),
  prompt3: z.string().max(500).optional(),
  response1: z.string().max(2000).optional(),
  response2: z.string().max(2000).optional(),
  response3: z.string().max(2000).optional(),
});

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
