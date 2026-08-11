import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] ?? '' })
const prisma = new PrismaClient({ adapter })

const seedStudents = [
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '+1 555-0101', class: 'Grade 9A', status: 'ACTIVE' },
  { name: 'Benjamin Carter', email: 'benjamin.carter@example.com', phone: '+1 555-0102', class: 'Grade 9A', status: 'ACTIVE' },
  { name: 'Chloe Nguyen', email: 'chloe.nguyen@example.com', phone: '+1 555-0103', class: 'Grade 9B', status: 'INACTIVE' },
  { name: 'Daniel Reyes', email: 'daniel.reyes@example.com', phone: '+1 555-0104', class: 'Grade 9B', status: 'ACTIVE' },
  { name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+1 555-0105', class: 'Grade 10A', status: 'ACTIVE' },
  { name: 'Fatima Ahmed', email: 'fatima.ahmed@example.com', phone: '+1 555-0106', class: 'Grade 10A', status: 'ACTIVE' },
  { name: 'George Miller', email: 'george.miller@example.com', phone: '+1 555-0107', class: 'Grade 10B', status: 'INACTIVE' },
  { name: 'Hannah Lee', email: 'hannah.lee@example.com', phone: '+1 555-0108', class: 'Grade 10B', status: 'ACTIVE' },
  { name: 'Ibrahim Khan', email: 'ibrahim.khan@example.com', phone: '+1 555-0109', class: 'Grade 11A', status: 'ACTIVE' },
  { name: 'Julia Roberts', email: 'julia.roberts@example.com', phone: '+1 555-0110', class: 'Grade 11A', status: 'INACTIVE' },
  { name: 'Kevin Patel', email: 'kevin.patel@example.com', phone: '+1 555-0111', class: 'Grade 12A', status: 'ACTIVE' },
  { name: 'Laura Martinez', email: 'laura.martinez@example.com', phone: '+1 555-0112', class: 'Grade 12B', status: 'ACTIVE' },
] as const

async function main() {
  for (const student of seedStudents) {
    await prisma.student.upsert({
      where: { email: student.email },
      update: {},
      create: {
        name: student.name,
        email: student.email,
        phone: student.phone,
        class: student.class,
        status: student.status,
      },
    })
  }
}

main()
  .then(() => {
    console.log(`Seeded ${seedStudents.length} students.`)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })