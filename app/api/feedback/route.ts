import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(feedback)
}

export async function POST(req: NextRequest) {
  const { text, type } = await req.json()
  await prisma.feedback.create({ data: { text, type } })
  return NextResponse.json({ ok: true })
}