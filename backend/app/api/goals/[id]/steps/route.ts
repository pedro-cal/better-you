import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/src/db';
import { goals, paths, steps } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and, asc } from 'drizzle-orm';

const CreateStepSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(['recurring', 'one_time']).default('recurring'),
  cadence: z.string().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  allowedWeekdays: z.array(z.string()).optional(),
  order: z.number().int().min(0).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: goalId } = await params;
  return withAuth(async (_, { userId }) => {
    const [goal] = await db
      .select({ id: goals.id })
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
      .limit(1);

    if (!goal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const [path] = await db
      .select({ id: paths.id })
      .from(paths)
      .where(eq(paths.goalId, goalId))
      .limit(1);

    if (!path) {
      return NextResponse.json({ data: [] });
    }

    const result = await db
      .select()
      .from(steps)
      .where(eq(steps.pathId, path.id))
      .orderBy(asc(steps.order));

    return NextResponse.json({ data: result });
  })(req);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: goalId } = await params;
  return withAuth(async (req, { userId }) => {
    const body = await req.json().catch(() => null);
    const parsed = CreateStepSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const [goal] = await db
      .select({ id: goals.id })
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
      .limit(1);

    if (!goal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Get or create path for this goal
    let [path] = await db
      .select({ id: paths.id })
      .from(paths)
      .where(eq(paths.goalId, goalId))
      .limit(1);

    if (!path) {
      [path] = await db
        .insert(paths)
        .values({ goalId })
        .returning({ id: paths.id });
    }

    const { title, type, cadence, estimatedMinutes, allowedWeekdays, order } = parsed.data;

    const [step] = await db
      .insert(steps)
      .values({
        pathId: path.id,
        title,
        type,
        source: 'user',
        cadence,
        estimatedMinutes,
        allowedWeekdays,
        order: order ?? 0,
      })
      .returning();

    return NextResponse.json({ data: step }, { status: 201 });
  })(req);
}
