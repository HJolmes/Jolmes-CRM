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
function parseFloat2(val: any): number | null {
  const n = parseFloat(String(val || ''))
  return isNaN(n) ? null : n
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx ts-node --esm prisma/import-offers-hw.ts <path>')
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

    const gr = kundeRaw.match(/KG:\s*(\d+)/)?.[1]
    const hw = kundeRaw.match(/KH:\s*(\d+)/)?.[1]
    const int = kundeRaw.match(/I:\s*(\d+)/)?.[1]

    let customer = null
    if (gr) {
      customer = await prisma.customer.findFirst({ where: { kdNrGebaeudereinigung: gr } })
    }
    if (!customer && hw) {
      customer = await prisma.customer.findFirst({ where: { kdNrHandwerk: hw } })
    }
    if (!customer && int) {
      customer = await prisma.customer.findFirst({ where: { interessentennummer: int } })
    }
    if (!customer) { skipped++; continue }

    try {
      await prisma.offer.create({
        data: {
          customerId: customer.id,
          sparte: 'HANDWERK',
          beschreibung: String(row['Titel'] || '').trim() || null,
          angebotsNummer: String(row['Ang/ Beleg-Nr.'] || '').trim() || null,
          angebotsSumme: parseFloat2(row['Ang/ Summe, netto']),
          angebotsDatum: parseDate(row['Angebotsdatum']),
          status: parseStatus(String(row['Status Angebot'] || '')),
          auftragsDatum: parseDate(row['Auftragsdatum']),
          auftragsSumme: parseFloat2(row['Auf/ Summe, netto']),
          verantwortlicher: String(row['Verantwortlicher'] || '').trim() || null,
          gewerk: String(row['Gewerk'] || '').trim() || null,
          bauphaseBeginn: parseDate(row['Bauphase: Beginn']),
          bauphaseEnde: parseDate(row['Bauphase: Ende']),
          rechnungNummer: String(row['Rechnung: Beleg-Nr.'] || '').trim() || null,
          rechnungSumme: parseFloat2(row['Rechnung: Summe']),
          rechnungDatum: parseDate(row['Rechnung: Datum']),
          rgBezahlt: String(row['Rechnung: Bemerkung'] || '').toLowerCase().includes('bezahlt'),
          notes: String(row['Rechnung: Bemerkung'] || '').trim() || null,
        },
      })
      imported++
      if (imported % 50 === 0) console.log(`✅ ${imported} importiert...`)
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