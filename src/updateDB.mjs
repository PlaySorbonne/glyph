let prismaClient = await import("@prisma/client");
let CsvParse = await import("csv-parse");

let prisma = new prismaClient.PrismaClient();

await prisma.code.deleteMany();
await prisma.quest.deleteMany();

console.log("Database reset");



