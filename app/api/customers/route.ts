import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      strasse: data.strasse || null,
      plz: data.plz || null,
      ort: data.ort || null,
      telefon: data.telefon || null,
      email: data.email || null,
      status: data.status || 'NEUKUNDE',
    },
  })
  return NextResponse.json(customer)
}