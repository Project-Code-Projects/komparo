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
            where: { comparatorQueryId: comparator.id }
        });
        // console.log(result);
        const arr = [];
        const alibabaArr = [];
        const alibabaArrNew = [];
        const amazonArr = [];
        const amazonArrNew = [];

        result.forEach(x => {
            if (x.source == 'alibaba') {
                alibabaArr.push(x); // {title: x.title, dataDate: new Date(x.createdAt)}
            } else if (x.source == 'amazon') {
                amazonArr.push(x);
            }
        });
        // console.log(alibabaArr); console.log(amazonArr);
        // alibabaArr[0].quantity = 0;
        // alibabaArrNew.push(alibabaArr[0]);

        // amazonArr[0].quantity = 0;
        // amazonArrNew.push(amazonArr[0]);

        alibabaArr.forEach(x => {
            let found = false;
        
            for (const y of alibabaArrNew) {
                if (x.title === y.title) {
                    y.quantity += 1;
                    found = true;
                    break; // Stop checking once found
                }
            }
        
            if (!found) {
                x.quantity = 1;
                alibabaArrNew.push(x);
            }
        });

        amazonArr.forEach(x => {
            let found = false;
        
            for (const y of amazonArrNew) {
                if (x.title === y.title) {
                    y.quantity += 1;
                    found = true;
                    break; // Stop checking once found
                }
            }
        
            if (!found) {
                x.quantity = 1;
                amazonArrNew.push(x);
            }
        });

        // console.log(amazonArrNew);
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
        res.status(200).json({alibaba: alibabaArrNew, amazon: amazonArrNew});
        // res.status(200).json(res);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

