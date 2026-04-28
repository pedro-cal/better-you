import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/src/db';
import { adjustments, steps, paths, goals } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and } from 'drizzle-orm';

const CreateAdjustmentSchema = z.object({
  stepId: z.string().uuid(),
  type: z.enum(['cadence_change', 'reschedule', 'minutes_change', 'other']),
  reason: z.string().max(500).optional(),
  before: z.record(z.string(), z.unknown()).optional(),
  after: z.record(z.string(), z.unknown()),
});

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateAdjustmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { stepId, type, reason, before, after } = parsed.data;

  // Verify ownership: step → path → goal → user
  const [owned] = await db
    .select({ stepId: steps.id })
    .from(steps)
    .innerJoin(paths, eq(paths.id, steps.pathId))
    .innerJoin(goals, and(eq(goals.id, paths.goalId), eq(goals.userId, userId)))
    .where(eq(steps.id, stepId))
    .limit(1);

  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const [created] = await db
    .insert(adjustments)
    .values({ stepId, type, reason, before: before ?? null, after })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
});
