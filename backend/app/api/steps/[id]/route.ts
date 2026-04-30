import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { goals, paths, steps } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and } from 'drizzle-orm';
import { PatchStepSchema } from '@better-you/shared';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: stepId } = await params;
  return withAuth(async (req, { userId }) => {
    const body = await req.json().catch(() => null);
    const parsed = PatchStepSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

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

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    const d = parsed.data;
    if (d.title !== undefined) updates.title = d.title;
    if (d.state !== undefined) updates.state = d.state;
    if (d.cadence !== undefined) updates.cadence = d.cadence;
    if (d.estimatedMinutes !== undefined) updates.estimatedMinutes = d.estimatedMinutes;
    if (d.allowedWeekdays !== undefined) updates.allowedWeekdays = d.allowedWeekdays;
    if (d.order !== undefined) updates.order = d.order;

    const [updated] = await db
      .update(steps)
      .set(updates)
      .where(eq(steps.id, stepId))
      .returning();

    return NextResponse.json({ data: updated });
  })(req);
}
