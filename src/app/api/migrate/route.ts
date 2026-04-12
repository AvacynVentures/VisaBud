import { NextRequest, NextResponse } from 'next/server';

const MIGRATE_SECRET = 'visabud-migrate-xK9mP3nQ-2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.secret !== MIGRATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find any database-related env vars
    const dbRelated: Record<string, string> = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (key.match(/DATABASE|POSTGRES|DB_|PG_|SUPABASE|DIRECT_URL/i) && value) {
        // Mask passwords in connection strings
        if (value.includes('@')) {
          dbRelated[key] = value.replace(/:([^@]+)@/, ':***@');
        } else if (key.includes('KEY') || key.includes('SECRET')) {
          dbRelated[key] = value.substring(0, 30) + '...';
        } else {
          dbRelated[key] = value;
        }
      }
    }

    return NextResponse.json({ 
      envVars: dbRelated,
      allEnvKeys: Object.keys(process.env).filter(k => !k.startsWith('npm_')).sort()
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active' });
}
