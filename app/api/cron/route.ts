import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Cron job ran!');
  return NextResponse.json({ ok: true });
}