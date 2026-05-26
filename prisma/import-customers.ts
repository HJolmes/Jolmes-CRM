import { PrismaClient } from '@prisma/client'
import xlsx from 'xlsx'

const prisma = new PrismaClient()

function parseStatus(val: string): 'AKTIV' | 'INAKTIV' | null {
  const v = String(val || '').trim().toLowerCase()
  if (!v) return null
  if (v.includes('inaktiv')) return 'INAKTIV'
  if (v.includes('aktiv')) return 'AKTIV'
  return null
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx ts-node --esm prisma/import-customers.ts <path>')
    process.exit(1)
  }

  console.log(`📂 Lese Datei: ${filePath}`)
  const workbook = xlsx.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' }) as any[]

  console.log(`📊 ${rows.length} Zeilen gefunden`)

  let imported = 0
  let skipped = 0

  // Teste erst mit 5 Zeilen - danach entfernen!
  for (const row of rows) {
    const name = String(row['Title'] || '').trim()
    if (!name) { skipped++; continue }

    try {
      await prisma.customer.create({
        data: {
          name,
          kdNrGebaeudereinigung: String(row['KdNr-Gebäudereinigung'] || '').trim() || null,
          kdNrHandwerk:          String(row['KdNr-Handwerk'] || '').trim() || null,
          kdNrEnergie:           String(row['KdNr-Personal/Energie'] || '').trim() || null,
          strasse:               String(row['Straße'] || '').trim() || null,
          plz:                   String(row['PLZ'] || '').trim() || null,
          ort:                   String(row['Ort'] || '').trim() || null,
          telefon:               String(row['Telefon'] || '').trim() || null,
          fax:                   String(row['Fax'] || '').trim() || null,
          email:                 String(row['Email'] || '').trim() || null,
          branche:               String(row['Branche'] || '').trim() || null,
          web:                   String(row['web'] || '').trim() || null,
          entscheider:           String(row['Entscheider'] || '').trim() || null,
          notes:                 String(row['Hauptansprechpartner'] || '').trim() || null,
          status: parseStatus(String(row['Status'] || '')) as any ?? undefined,
        },
      })
      imported++
      console.log(`✅ ${imported}: ${name}`)
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