import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { goals, availability, paths, pathTemplates } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and } from 'drizzle-orm';
import { CreateGoalSchema } from '@better-you/shared';
import type { LifeDomain } from '@better-you/shared';

export const GET = withAuth(async (req, { userId }) => {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state');
  const domain = searchParams.get('domain');
  const journeyId = searchParams.get('journeyId');

  const conditions = [eq(goals.userId, userId)];
  if (state) conditions.push(eq(goals.state, state));
  if (domain) conditions.push(eq(goals.domain, domain as LifeDomain));
  if (journeyId) conditions.push(eq(goals.journeyId, journeyId));

  const result = await db
    .select()
    .from(goals)
    .where(and(...conditions));

  return NextResponse.json({ data: result });
});

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateGoalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { domain, title, intent, completionCriteria, journeyId } = parsed.data;

  // Capacity/overload check
  const [avail] = await db
    .select()
    .from(availability)
    .where(eq(availability.userId, userId))
    .limit(1);

  const capacity = avail
    ? avail.mon + avail.tue + avail.wed + avail.thu + avail.fri + avail.sat + avail.sun
    : 0;

  const activeGoalPaths = await db
    .select({ minutesPerWeekEstimate: pathTemplates.minutesPerWeekEstimate })
    .from(goals)
    .innerJoin(paths, eq(paths.goalId, goals.id))
    .innerJoin(pathTemplates, eq(pathTemplates.id, paths.templateId!))
    .where(and(eq(goals.userId, userId), eq(goals.state, 'active')));

  const activeLoad = activeGoalPaths.reduce((s, g) => s + g.minutesPerWeekEstimate, 0);
  const utilization = capacity > 0 ? activeLoad / capacity : 0;
  const recommendedState = utilization > 0.9 ? 'queued' : 'active';

  const [goal] = await db
    .insert(goals)
    .values({ userId, domain: domain as LifeDomain, title, intent, completionCriteria, journeyId })
    .returning();

  return NextResponse.json(
    { data: { goal, overload: { utilization, recommendedState } } },
    { status: 201 },
  );
});
