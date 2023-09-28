/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require("@prisma/client");
const faker = require("@faker-js/faker/locale/id_ID");
const db = new PrismaClient();

async function main() {
  // ?Category
  const categories = [
    "Computer Science",
    "Fitness",
    "Music",
    "Photography",
    "Accounting",
    "Engineering",
    "Filming",
  ];
  for (let i = 0; i < categories.length; i++) {
    await db.category.create({
      data: {
        name: categories[i],
      },
    });
  }
}

main()
  .then(() => console.log("SUCCESS SEEDED"))
  .catch((e) => console.error("ERROR SEEDED, detail : ", e))
  .finally(async () => {
    await db.$disconnect();
    process.exit();
  });
