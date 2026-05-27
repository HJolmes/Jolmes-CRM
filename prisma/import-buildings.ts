import { PrismaClient } from '@prisma/client'
import xlsx from 'xlsx'

const prisma = new PrismaClient()

function parseSparte(val: string): string | null {
  const v = String(val || '').trim().toUpperCase()
  if (v.includes('GEBÄUDE') || v.includes('GEBAUDE')) return 'GEBAEUDEREINIGUNG'
  if (v.includes('HANDWERK')) return 'HANDWERK'
  if (v.includes('GLAS')) return 'GLAS_SONDER_GARTEN'
  if (v.includes('ENERGIE') || v.includes('PERSONAL')) return 'ENERGIE_PERSONAL'
  if (v.includes('ALLGEMEIN')) return 'ALLGEMEIN'
  return null
}

function parseAnsprechpartner(val: string): string | null {
  // Format: "Frau Birgit Meyer-Dulheuer;#3" → "Frau Birgit Meyer-Dulheuer"
  const v = String(val || '').trim()
  if (!v) return null
  return v.split(';')[0].trim()
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx ts-node --esm prisma/import-buildings.ts <path>')
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
    const name = String(row['Bezeichnung '] || row['Bezeichnung'] || '').trim()

    if (!kdNr || !name) { skipped++; continue }

    // Kunde über KdNr finden
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

    // Ort parsen (z.B. "45699 Herten" → plz: "45699", ort: "Herten")
    const ortRaw = String(row['Ort'] || '').trim()
    const ortParts = ortRaw.match(/^(\d{5})\s+(.+)$/)
    const plz = ortParts ? ortParts[1] : null
    const ort = ortParts ? ortParts[2] : ortRaw || null

    const hauptAnsprechpartner = parseAnsprechpartner(String(row['Hauptansprechpartner'] || ''))

    try {
      await prisma.building.create({
        data: {
          customerId: customer.id,
          name,
          objektNummer: String(row['Obj.'] || '').trim() || null,
          auftragsNummer: String(row['Auftrags-Nr'] || '').trim() || null,
          kategorie: String(row['Kategorie'] || '').trim() || null,
          strasse: String(row['Objekt / Straße'] || '').trim() || null,
          plz,
          ort,
          bereich: parseSparte(String(row['Bereich'] || '')) as any || null,
          verantwortlicher: String(row['Verantwortlicher'] || '').trim() || null,
          notes: hauptAnsprechpartner,
        },
      })
      imported++
      console.log(`✅ ${imported}: ${name} → Kunde: ${customer.name}`)
    } catch (e) {
      console.error(`❌ Fehler bei "${name}":`, e)
      skipped++
    }
  }

  console.log(`\n🎉 Import fertig: ${imported} importiert, ${skipped} übersprungen`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
  