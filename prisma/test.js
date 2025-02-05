import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const body = await prisma.comparator.create({
            data: {
                query: "white shirt men",
                status: "scraped",
                amazon: "https://example.com/file.csv",
                alibaba: "https://example.com/file.csv",
            },
        });
        console.log("✅ Query added:", body);

        const queries = await prisma.comparator.findMany();
        console.log("📌 All Queries:", queries);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
