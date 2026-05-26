import { PrismaClient } from '@prisma/client'
import xlsx from 'xlsx'

const prisma = new PrismaClient()

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx ts-node --esm prisma/update-interessentennummer.ts <path>')
    process.exit(1)
  }

  const workbook = xlsx.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' }) as any[]

  let updated = 0
  let skipped = 0

  for (const row of rows) {
    const name = String(row['Title'] || '').trim()
    const interessentennummer = String(row['Interessentennummer'] || '').trim() || null

    if (!name || !interessentennummer) { skipped++; continue }

    const customer = await prisma.customer.findFirst({
      where: { name }
    })

    if (!customer) { skipped++; continue }

    await prisma.customer.update({
      where: { id: customer.id },
      data: { interessentennummer }
    })
    updated++
    console.log(`✅ ${name}: ${interessentennummer}`)
  }

  console.log(`\n🎉 Fertig: ${updated} aktualisiert, ${skipped} übersprungen`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())