import { PrismaClient } from "@prisma/client";

//* next dev clears Node.js cache on run -> intialises new PrismaClient instance each time due to hot reloading
//* this instantiates a single instance PrismaClient and saves it on globalThis
//* then PrismaClient only instantiates if it's not on the globalThis object otherwise uses same instance again if already present

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type prismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: prismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
