import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      kdNrGebaeudereinigung: data.kdNrGebaeudereinigung || null,
      kdNrHandwerk: data.kdNrHandwerk || null,
      kdNrEnergie: data.kdNrEnergie || null,
      interessentennummer: data.interessentennummer || null,
      strasse: data.strasse || null,
      plz: data.plz || null,
      ort: data.ort || null,
      telefon: data.telefon || null,
      fax: data.fax || null,
      email: data.email || null,
      web: data.web || null,
      branche: data.branche || null,
      status: data.status || null,
      entscheider: data.entscheider || null,
      notes: data.notes || null,
    },
  })
  return NextResponse.json(customer)
}