import { PrismaClient } from '@prisma/client';
import { downloadCsv } from '../utils/cloudinaryUtils.js';

const prisma = new PrismaClient();

export const getScrapedProducts = async (req, res) => {
    try {
        let { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        // !important: Trim extra whitespace and newlines
        query = query.trim();

        const comparator = await prisma.comparator.findUnique({
            where: { query }
        });

        if (!comparator) {
            return res.status(404).json({ error: "No matching products found", query });
        }

        if (comparator.status === "pending") {
            return res.status(202).json({
                message: "Data is still being processed. Please check back in a few hours..."
            });
        }

        const { amazon: amazon_url, alibaba: alibaba_url } = comparator;

        console.log("Amazon URL:", amazon_url || "No Amazon URL available");
        console.log("Alibaba URL:", alibaba_url || "No Alibaba URL available");

        console.log("Downloading from Alibaba URL:", alibaba_url);
        const alibabaProducts = (await downloadCsv(alibaba_url)).slice(0, 3);

        console.log("Downloading from Amazon URL:", amazon_url);
        const amazonProducts = (await downloadCsv(amazon_url)).slice(0, 3);

        res.status(200).json({
            alibaba_url,
            alibaba: alibabaProducts,
            amazon_url,
            amazon: amazonProducts,
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

