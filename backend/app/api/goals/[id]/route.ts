import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { goals } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and } from 'drizzle-orm';
import { PatchGoalSchema } from '@better-you/shared';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAuth(async (_, { userId }) => {
    const [goal] = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .limit(1);

    if (!goal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: goal });
  })(req);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAuth(async (req, { userId }) => {
    const body = await req.json().catch(() => null);
    const parsed = PatchGoalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: goals.id })
      .from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.title !== undefined) updates.title = parsed.data.title;
    if (parsed.data.intent !== undefined) updates.intent = parsed.data.intent;
    if (parsed.data.completionCriteria !== undefined)
      updates.completionCriteria = parsed.data.completionCriteria;

    const [updated] = await db
      .update(goals)
      .set(updates)
      .where(eq(goals.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  })(req);
}
