import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const contact = await prisma.contactPerson.create({
    data: {
      anrede: data.anrede || null,
      vorname: data.vorname || null,
      nachname: data.nachname,
      email: data.email || null,
      telefon: data.telefon || null,
      rolle: data.rolle || null,
      firma: data.firma || null,
      isHauptansprechpartner: data.isHauptansprechpartner === 'true',
      customerId: data.customerId,
    },
  })
  return NextResponse.json(contact)
}