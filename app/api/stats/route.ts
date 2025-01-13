import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.room.aggregate({
    _sum: {
        fileNumber: true
    }
  })
  return NextResponse.json({ res: count });
}