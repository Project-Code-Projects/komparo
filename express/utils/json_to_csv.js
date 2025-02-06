// import { promises as fs } from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { parse } from 'json2csv';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export async function convertJsonToCsv(searchQuery, jsonFilePath, retailer) {
//     try {
//         const jsonData = JSON.parse(await fs.readFile(jsonFilePath, 'utf8'));
//         const fields = ['title', 'price', 'company', 'moq', 'rating', 'image', 'link'];
//         const csvData = parse(jsonData, { fields });
//         const csvDir = path.join(__dirname, 'csv');

//         await fs.mkdir(csvDir, { recursive: true });

//         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//         const csvFileName = `${searchQuery.replace(/\s+/g, '_')}_${retailer}_${timestamp}_data.csv`;
//         const csvFilePath = path.join(csvDir, csvFileName);

//         await fs.writeFile(csvFilePath, csvData, 'utf8');

//         console.log(`CSV file created: ${csvFilePath}`);
//     } catch (error) {
//         console.error('Error converting JSON to CSV:', error);
//     }
// }

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function convertJsonToCsv(searchQuery, jsonFilePath, retailer) {
    try {
        const jsonData = JSON.parse(await fs.readFile(jsonFilePath, 'utf8'));
        console.log('JSON data read successfully.');

        const csvData = Papa.unparse(jsonData);

        const csvDir = path.join(__dirname, 'csv');
        await fs.mkdir(csvDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const csvFileName = `${searchQuery.replace(/\s+/g, '_')}_${retailer}_${timestamp}_data.csv`;

        const finalCsvFilePath = path.join(csvDir, csvFileName);

        await fs.writeFile(finalCsvFilePath, csvData, 'utf8');
        console.log(`CSV file created: ${finalCsvFilePath}`);
    } catch (error) {
        console.error('Error converting JSON to CSV:', error);
    }
}

// Example usage:
// convertJsonToCsv('Little Red Riding Hood with the Red Shoes', 'json/results.json', 'Daraz');
