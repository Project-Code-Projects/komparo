import { uploadCsv } from "../utils/old/cloudinaryUtils.js";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getDownloadUrl = async (req, res) => {
    try {
        console.log("---------------------------------------------------------------");
        console.log("Generating CSV download link...");
        console.log("---------------------------------------------------------------");

        let { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        query = query.trim();

        const comparator = await prisma.comparator.findUnique({
            where: { query }
        });

        if (!comparator) {
            return res.status(404).json({ error: "Query not found in the database." });
        }

        if (comparator.status === "pending" || comparator.status === "processing") {
            return res.status(202).json({
                message: "Data is still being processed. Please check back in a few hours..."
            });
        }

        const result = await prisma.scrapeData.findMany({
            where: { comparatorQueryId: comparator.id }
        });

        if (result.length === 0) {
            return res.status(404).json({ error: "No data available for this query." });
        }

        const csvData = Papa.unparse(result);

        const tempDir = path.join(__dirname, "../temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, `${query}.csv`);

        fs.writeFileSync(tempFilePath, csvData, "utf8");

        const fileUrl = await uploadCsv(tempFilePath, "alibaba");

        fs.unlinkSync(tempFilePath);

        console.log("CSV Download URL:", fileUrl);

        console.log("[END]");
        return res.status(200).json({ downloadUrl: fileUrl });
    } catch (error) {
        console.error("Error in getDownloadUrl:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
