import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to PostgreSQL successfully!");
    } catch (error) {
        console.error("❌ Connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

