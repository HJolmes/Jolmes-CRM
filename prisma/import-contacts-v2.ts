import { PrismaClient } from '@prisma/client'
import xlsx from 'xlsx'

const prisma = new PrismaClient()

function parseAnrede(name: string): 'HERR' | 'FRAU' | null {
  if (name.startsWith('Frau')) return 'FRAU'
  if (name.startsWith('Herr')) return 'HERR'
  return null
}

function cleanName(val: string): string {
  // "Frau Birgit Meyer-Dulheuer;#3" → "Frau Birgit Meyer-Dulheuer"
  return String(val || '').split(';')[0].trim()
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx ts-node --esm prisma/import-contacts-v2.ts <path>')
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
    const kdNr = String(row['Title'] || '').trim()
    const hauptAVN = cleanName(String(row['Hauptansprechpartner'] || ''))
    const hauptEmail = cleanName(String(row['Hauptansprechpartner: E-Mail'] || ''))
    const hauptTelefon = cleanName(String(row['Hauptansprechpartner: Telefon'] || ''))

    if (!kdNr || !hauptAVN) { skipped++; continue }

    // Kunde finden
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { kdNrGebaeudereinigung: kdNr },
          { kdNrHandwerk: kdNr },
          { kdNrEnergie: kdNr },
        ]
      }
    })

    if (!customer) { skipped++; continue }

    // Anrede und Namen parsen
    const anrede = parseAnrede(hauptAVN)
    // "Frau Birgit Meyer-Dulheuer" → vorname: "Birgit", nachname: "Meyer-Dulheuer"
    const parts = hauptAVN.replace(/^(Herr|Frau)\s+/, '').split(' ')
    const nachname = parts.pop() || hauptAVN
    const vorname = parts.join(' ') || null

    // Prüfe ob Ansprechpartner schon existiert
    const exists = await prisma.contactPerson.findFirst({
      where: {
        customerId: customer.id,
        nachname,
      }
    })

    if (exists) { skipped++; continue }

    try {
      await prisma.contactPerson.create({
        data: {
          anrede,
          vorname,
          nachname,
          email: hauptEmail || null,
          telefon: hauptTelefon || null,
          isHauptansprechpartner: true,
          customerId: customer.id,
        },
      })
      imported++
      if (imported % 100 === 0) console.log(`✅ ${imported} importiert...`)
    } catch (e) {
      console.error(`❌ Fehler bei "${hauptAVN}":`, e)
      skipped++
    }
  }

  console.log(`\n🎉 Import fertig: ${imported} importiert, ${skipped} übersprungen`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())