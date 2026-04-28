import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { pathTemplates } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [template] = await db
    .select()
    .from(pathTemplates)
    .where(eq(pathTemplates.id, id))
    .limit(1);

  if (!template) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: template });
}
