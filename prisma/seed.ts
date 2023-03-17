import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const goals = await prisma.goals.createMany({
    data: [
      { name: "Active listening" },
      { name: "Appropriate behavior" },
      { name: "Communication" },
      { name: "Emotional expression" },
      { name: "Emotional regulation" },
      { name: "Following directions" },
      { name: "Leadership skills" },
      { name: "Making choices" },
      { name: "Social skills" },
      { name: "Turn taking" },
    ]
  })
  const schools = await prisma.schools.createMany({
    data: [
      { name: "School1" },
      { name: "School2" },
      { name: "School3" },
      { name: "School4" },
    ]
  })
  const students = await prisma.students.createMany({
    data: [
      { first_name: "Test1", last_name: "Student", school_id: 1 },
      { first_name: "Test2", last_name: "Student", school_id: 1 },
    ]
  })
  console.log({ goals, schools, students })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })