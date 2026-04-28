import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { pathTemplates } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import type { LifeDomain } from '@better-you/shared';

const LIFE_DOMAINS = [
  'BODY', 'MIND', 'SOCIAL', 'WORK', 'MONEY', 'SERVICE', 'SPIRITUALITY',
] as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (domain && !(LIFE_DOMAINS as readonly string[]).includes(domain)) {
    return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
  }

  const result = domain
    ? await db.select().from(pathTemplates).where(eq(pathTemplates.domain, domain as LifeDomain))
    : await db.select().from(pathTemplates);

  return NextResponse.json({ data: result });
}
