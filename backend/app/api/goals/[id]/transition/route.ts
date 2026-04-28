import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/src/db';
import { goals } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and } from 'drizzle-orm';

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['queued', 'active', 'abandoned'],
  queued: ['active', 'abandoned', 'archived'],
  active: ['paused', 'completed', 'abandoned'],
  paused: ['active', 'abandoned', 'archived'],
  completed: ['archived'],
  abandoned: ['archived'],
};

const TransitionSchema = z.object({
  to: z.enum(['queued', 'draft', 'active', 'paused', 'completed', 'abandoned', 'archived']),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAuth(async (req, { userId }) => {
    const body = await req.json().catch(() => null);
    const parsed = TransitionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const { to } = parsed.data;

    const [goal] = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .limit(1);

    if (!goal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const allowed = VALID_TRANSITIONS[goal.state] ?? [];
    if (!allowed.includes(to)) {
      return NextResponse.json(
        { error: `Cannot transition from '${goal.state}' to '${to}'` },
        { status: 422 },
      );
    }

    const updates: Record<string, unknown> = { state: to, updatedAt: new Date() };
    if (to === 'active' && !goal.activatedAt) updates.activatedAt = new Date();
    if (to === 'completed') updates.completedAt = new Date();

    const [updated] = await db
      .update(goals)
      .set(updates)
      .where(eq(goals.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  })(req);
}
