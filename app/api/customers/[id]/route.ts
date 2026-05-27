import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const customer = await prisma.customer.findUnique({ where: { id } })
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(customer)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const data = await req.json()
  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name: data.name,
      strasse: data.strasse || null,
      plz: data.plz || null,
      ort: data.ort || null,
      telefon: data.telefon || null,
      email: data.email || null,
      fax: data.fax || null,
      branche: data.branche || null,
      status: data.status || null,
      kdNrGebaeudereinigung: data.kdNrGebaeudereinigung || null,
kdNrHandwerk: data.kdNrHandwerk || null,
kdNrEnergie: data.kdNrEnergie || null,
interessentennummer: data.interessentennummer || null,
web: data.web || null,
entscheider: data.entscheider || null,
    },
  })
  return NextResponse.json(customer)
}