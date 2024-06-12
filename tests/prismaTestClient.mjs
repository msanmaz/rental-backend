import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://moodDb_owner:Gv08kSUIQdOu@ep-sweet-darkness-a5csgxq7.us-east-2.aws.neon.tech/rentalTest?sslmode=require", // Ensure this is pointing to your test database
    },
  },
});

module.exports = prisma;