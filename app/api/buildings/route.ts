import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const building = await prisma.building.create({
    data: {
      name: data.name,
      objektNummer: data.objektNummer || null,
      kategorie: data.kategorie || null,
      strasse: data.strasse || null,
      ort: data.ort || null,
      bereich: data.bereich || null,
      verantwortlicher: data.verantwortlicher || null,
      customerId: data.customerId,
    },
  })
  return NextResponse.json(building)
}