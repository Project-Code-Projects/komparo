import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'json2csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function convertJsonToCsv(searchQuery, jsonFilePath) {
    try {
        const jsonData = JSON.parse(await fs.readFile(jsonFilePath, 'utf8'));
        const fields = ['title', 'price', 'company', 'moq', 'rating', 'image', 'link'];
        const csvData = parse(jsonData, { fields });
        const csvDir = path.join(__dirname, 'csv');

        await fs.mkdir(csvDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const csvFileName = `${searchQuery.replace(/\s+/g, '_')}_${timestamp}_data.csv`;
        const csvFilePath = path.join(csvDir, csvFileName);

        await fs.writeFile(csvFilePath, csvData, 'utf8');

        console.log(`CSV file created: ${csvFilePath}`);
    } catch (error) {
        console.error('Error converting JSON to CSV:', error);
    }
}

