const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync("password123", 10);

  await prisma.user.create({
    data: {
      email: "testuser@example.com",
      password: hashedPassword,
      name: "Test User",
    },
  });

  console.log("User created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
