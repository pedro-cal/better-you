import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { journeys } from '@/src/db/schema';
import { withAuth } from '@/lib/withAuth';
import { eq } from 'drizzle-orm';
import { CreateJourneySchema } from '@better-you/shared';
import type { LifeDomain } from '@better-you/shared';

export const GET = withAuth(async (req, { userId }) => {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state');

  const result = await db
    .select()
    .from(journeys)
    .where(eq(journeys.userId, userId));

  const filtered = state ? result.filter((j) => j.state === state) : result;

  return NextResponse.json({ data: filtered });
});

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateJourneySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { domain, title, description, narrative } = parsed.data;

  const [journey] = await db
    .insert(journeys)
    .values({ userId, domain: domain as LifeDomain, title, description, narrative })
    .returning();

  return NextResponse.json({ data: journey }, { status: 201 });
});
