import { PrismaClient } from '@prisma/client';
import { title } from 'process';
// import { downloadCsv } from '../utils/cloudinaryUtils.js';

const prisma = new PrismaClient();

export const getScrappedProducts = async (req, res) => {
    try {
        console.log("---------------------------------------------------------------");
        console.log("Getting scrapped products...");
        console.log("---------------------------------------------------------------");

        let { query } = req.query;

        // console.log('Query :', query);

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        // !important: Trim extra whitespace and newlines
        query = query.trim();

        const comparator = await prisma.comparator.findUnique({
            where: { query }
        });
        // console.log(comparator);
        if (comparator.status === "pending") {
            return res.status(202).json({
                message: "Data is still being processed. Please check back in a few hours..."
            });
        }

        const result = await prisma.scrapeData.findMany({
            where: { comparatorQuery: query }
        });

        const arr = [];
        

        result.forEach(x => {
            if (x.source == 'alibaba') {
                arr.push({title: x.title, dataDate: new Date(x.createdAt)});
            }
        });

        // console.log(result);
        // const { amazon: amazon_url, alibaba: alibaba_url } = comparator;

        // console.log("Amazon URL:", amazon_url || "No Amazon URL available");
        // console.log("Alibaba URL:", alibaba_url || "No Alibaba URL available");

        // let amazonProducts;
        // let alibabaProducts;

        // if (alibaba_url) {
        //     console.log("Downloading from Alibaba URL:", alibaba_url);
        //     // alibabaProducts = (await downloadCsv(alibaba_url)).slice(0, 3);
        //     alibabaProducts = (await downloadCsv(alibaba_url));
        // }
        // if (amazon_url) {
        //     console.log("Downloading from Amazon URL:", amazon_url);
        //     // amazonProducts = (await downloadCsv(amazon_url)).slice(0, 3);
        //     amazonProducts = (await downloadCsv(amazon_url));
        // }

        console.log("[END]")
        // res.status(200).json(result);
        res.status(200).json(arr);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

