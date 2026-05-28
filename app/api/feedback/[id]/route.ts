import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  const updated = await prisma.feedback.update({
    where: { id: params.id },
    data: { status }
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.feedback.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}