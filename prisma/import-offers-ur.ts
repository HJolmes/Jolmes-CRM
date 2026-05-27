import { PrismaClient } from '@prisma/client'
import xlsx from 'xlsx'

const prisma = new PrismaClient()

function parseStatus(val: string) {
  const v = String(val || '').toLowerCase()
  if (v.includes('beauftragt') || v.includes('ja')) return 'BEAUFTRAGT'
  if (v.includes('abgelehnt') || v.includes('nein')) return 'ABGELEHNT'
  if (v.includes('entscheidung')) return 'ENTSCHEIDUNG_OFFEN'
  return 'OFFEN'
}

function extractKdNr(val: string): { gr?: string, hw?: string } {
  const gr = val.match(/KG:\s*(\d+)/)?.[1]
  const hw = val.match(/KH:\s*(\d+)/)?.[1]
  return { gr, hw }
}

function parseDate(val: any): Date | null {
  if (!val) return null
  if (val instanceof Date) return val
  // Excel Seriennummer → echtes Datum
  if (typeof val === 'number') {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + val * 86400000)
    return date
  }
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx ts-node --esm prisma/import-offers-ur.ts <path>')
    process.exit(1)
  }

  console.log(`📂 Lese Datei: ${filePath}`)
  const workbook = xlsx.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' }) as any[]
  console.log(`📊 ${rows.length} Zeilen gefunden`)

  let imported = 0
  let skipped = 0

  for (const row of rows) {
    const kundeRaw = String(row['Kunde-Komplett'] || '').trim()
    if (!kundeRaw) { skipped++; continue }

    const { gr, hw } = extractKdNr(kundeRaw)

    // Kunde finden
    let customer = null
    if (gr) {
      customer = await prisma.customer.findFirst({ where: { kdNrGebaeudereinigung: gr } })
    }
    if (!customer && hw) {
      customer = await prisma.customer.findFirst({ where: { kdNrHandwerk: hw } })
    }
    if (!customer) { skipped++; continue }

    try {
      await prisma.offer.create({
        data: {
          customerId: customer.id,
          sparte: 'GEBAEUDEREINIGUNG',
          beschreibung: String(row['Angebot Status'] || '').trim() || null,
          auftragsSumme: parseFloat(String(row['Auf/ Summe, netto'] || '0')) || null,
          status: parseStatus(String(row['Auftragserteilung'] || '')),
          angebotsDatum: parseDate(row['Angebotsdatum']),
          auftragsDatum: parseDate(row['Auftragsdatum']),
          verantwortlicher: String(row['verantwortlicher'] || '').trim() || null,
          bearbeiter: String(row['Bearbeiter/in'] || '').trim() || null,
          notes: String(row['Information/ Bearbeitungsstand'] || '').trim() || null,
        },
      })
      imported++
      if (imported % 100 === 0) console.log(`✅ ${imported} importiert...`)
    } catch (e) {
      console.error(`❌ Fehler:`, e)
      skipped++
    }
  }

  console.log(`\n🎉 Import fertig: ${imported} importiert, ${skipped} übersprungen`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())