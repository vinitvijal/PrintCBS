import { olderFilesDelete } from '@/server/action';
import { NextResponse } from 'next/server';

export async function GET() {
  olderFilesDelete();
  console.log('Cron job ran!');
  return NextResponse.json({ ok: true });
}