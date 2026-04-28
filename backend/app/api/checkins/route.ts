import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/src/db';
import { checkins, steps, paths, goals } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and } from 'drizzle-orm';

const CreateCheckinSchema = z.object({
  stepId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  status: z.enum(['done', 'skipped', 'missed']),
  difficulty: z.number().int().min(1).max(5).optional(),
  mood: z.number().int().min(1).max(5).optional(),
  logText: z.string().max(1000).optional(),
});

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateCheckinSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { stepId, date, status, difficulty, mood, logText } = parsed.data;

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

  // Idempotent upsert by (step_id, date); existing records are immutable (no update)
  const existing = await db
    .select()
    .from(checkins)
    .where(and(eq(checkins.stepId, stepId), eq(checkins.date, date)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ data: existing[0] }, { status: 200 });
  }

  const [created] = await db
    .insert(checkins)
    .values({ stepId, date, status, difficulty, mood, logText })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
});

export const GET = withAuth(async (req, { userId }) => {
  const { searchParams } = new URL(req.url);
  const stepId = searchParams.get('stepId');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  // Build a subquery to only return checkins belonging to this user
  const conditions = [eq(goals.userId, userId)];
  if (stepId) conditions.push(eq(steps.id, stepId));

  const rows = await db
    .select({ checkin: checkins })
    .from(checkins)
    .innerJoin(steps, eq(steps.id, checkins.stepId))
    .innerJoin(paths, eq(paths.id, steps.pathId))
    .innerJoin(goals, and(eq(goals.id, paths.goalId), eq(goals.userId, userId)))
    .where(and(...conditions));

  let result = rows.map((r) => r.checkin);

  if (dateFrom) result = result.filter((c) => c.date >= dateFrom);
  if (dateTo) result = result.filter((c) => c.date <= dateTo);

  return NextResponse.json({ data: result });
});
