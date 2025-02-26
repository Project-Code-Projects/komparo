import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getScrappedProducts = async (req, res) => {
    try {
        console.log("---------------------------------------------------------------");
        console.log("Getting scrapped products...");
        console.log("---------------------------------------------------------------");

        let { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        // !important: Trim extra whitespace and newlines
        query = query.trim();

        const comparator = await prisma.comparator.findUnique({
            where: { query }
        });

        if (comparator.status === "pending" || comparator.status === "processing") {
            return res.status(202).json({
                message: "Data is still being processed. Please check back in a few hours..."
            });
        }

        const result = await prisma.scrapeData.findMany({
            where: { comparatorQueryId: comparator.id }
        });

        console.log("[END]")
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

