import { PrismaClient } from '@prisma/client';
import { downloadCsv } from '../utils/cloudinaryUtils.js';

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

        const { amazon: amazon_url, alibaba: alibaba_url } = comparator;

        console.log("Amazon URL:", amazon_url || "No Amazon URL available");
        console.log("Alibaba URL:", alibaba_url || "No Alibaba URL available");

        let amazonProducts;
        let alibabaProducts;

        if (alibaba_url) {
            console.log("Downloading from Alibaba URL:", alibaba_url);
            // alibabaProducts = (await downloadCsv(alibaba_url)).slice(0, 3);
            alibabaProducts = (await downloadCsv(alibaba_url));
        }
        if (amazon_url) {
            console.log("Downloading from Amazon URL:", amazon_url);
            // amazonProducts = (await downloadCsv(amazon_url)).slice(0, 3);
            amazonProducts = (await downloadCsv(amazon_url));
        }

        console.log("[END]")
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

