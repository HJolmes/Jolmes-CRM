import { PrismaClient } from '@prisma/client'
import xlsx from 'xlsx'

const prisma = new PrismaClient()

function parseAnrede(val: string): 'HERR' | 'FRAU' | 'DIVERS' | null {
  const v = String(val || '').trim().toUpperCase()
  if (v === 'HERR') return 'HERR'
  if (v === 'FRAU') return 'FRAU'
  return null
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx ts-node --esm prisma/import-contacts.ts <path>')
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
    const nachname = String(row['Title'] || '').trim()
    if (!nachname) { skipped++; continue }

    const vorname = String(row['Vorname'] || '').trim() || null
    const anrede = parseAnrede(String(row['Anrede'] || ''))
    const email = String(row['E-Mail'] || '').trim() || null
    const telefon = String(row['Telefon'] || '').trim() || null
    const firma = String(row['Firma'] || '').trim() || null
    const rolle = String(row['Rolle/Funktion'] || '').trim() || null

    // Versuche Kunde zu finden über "zugehörige Kunden: Titel"
    const kundeRaw = String(row['zugehörige Kunden: Titel'] || '').trim()
    let customerId: string | null = null

    if (kundeRaw) {
      const customer = await prisma.customer.findFirst({
        where: { name: { contains: kundeRaw, mode: 'insensitive' } }
      })
      if (customer) customerId = customer.id
    }

    if (!customerId) {
      skipped++
      continue
    }

    try {
      await prisma.contactPerson.create({
        data: {
          anrede,
          vorname,
          nachname,
          email,
          telefon,
          firma,
          rolle,
          customerId,
        },
      })
      imported++
      if (imported % 50 === 0) console.log(`✅ ${imported} importiert...`)
    } catch (e) {
      console.error(`❌ Fehler bei "${nachname}":`, e)
      skipped++
    }
  }

  console.log(`\n🎉 Import fertig: ${imported} importiert, ${skipped} übersprungen`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())