import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/src/db';
import { goals, paths, steps, pathTemplates, availability } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq, and } from 'drizzle-orm';
import type { LifeDomain } from '@better-you/shared';

const FromTemplateSchema = z.object({
  templateId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  intent: z.string().max(500).optional(),
  completionCriteria: z.string().max(500).optional(),
  journeyId: z.string().uuid().optional(),
});

type TemplateStep = {
  title: string;
  cadence?: string;
  estimatedMinutes?: number;
  type?: string;
};

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = FromTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { templateId, title, intent, completionCriteria, journeyId } = parsed.data;

  const [template] = await db
    .select()
    .from(pathTemplates)
    .where(eq(pathTemplates.id, templateId))
    .limit(1);

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  // Capacity/overload check (same logic as POST /api/goals)
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

  // Create goal + path + steps in a single transaction
  const result = await db.transaction(async (tx) => {
    const [goal] = await tx
      .insert(goals)
      .values({
        userId,
        domain: template.domain as LifeDomain,
        title: title ?? template.title,
        intent,
        completionCriteria,
        journeyId,
      })
      .returning();

    const [path] = await tx
      .insert(paths)
      .values({ goalId: goal.id, templateId })
      .returning();

    const templateSteps = (template.stepsJson as TemplateStep[]) ?? [];

    const createdSteps = templateSteps.length > 0
      ? await tx
          .insert(steps)
          .values(
            templateSteps.map((s, i) => ({
              pathId: path.id,
              title: s.title,
              type: (s.type ?? 'recurring') as string,
              source: 'template' as const,
              cadence: s.cadence,
              estimatedMinutes: s.estimatedMinutes,
              order: i,
            })),
          )
          .returning()
      : [];

    return { goal, path, steps: createdSteps };
  });

  return NextResponse.json(
    { data: { ...result, overload: { utilization, recommendedState } } },
    { status: 201 },
  );
});
