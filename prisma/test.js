import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const body = await prisma.queryTracker.create({
            data: {
                query: "white shirt men",
                status: "scraped",
                csvLink: "https://example.com/file.csv"
            },
        });
        console.log("✅ Query added:", body);

        const queries = await prisma.queryTracker.findMany();
        console.log("📌 All Queries:", queries);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
