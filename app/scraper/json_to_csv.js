import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'json2csv';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function convertJsonToCsv(searchTerm, jsonFilePath) {
    try {
        // Read the JSON file
        const jsonData = JSON.parse(await fs.readFile(jsonFilePath, 'utf8'));

        // Convert JSON to CSV
        const csvData = parse(jsonData);

        // Create a CSV directory if it doesn't exist
        const csvDir = path.join(__dirname, 'csv');
        await fs.mkdir(csvDir, { recursive: true });

        // Create a CSV filename with the search term
        const csvFileName = `${searchTerm.replace(/\s+/g, '_')}_data.csv`;
        const csvFilePath = path.join(csvDir, csvFileName);

        // Write CSV data to file
        await fs.writeFile(csvFilePath, csvData, 'utf8');

        console.log(`CSV file created: ${csvFilePath}`);
    } catch (error) {
        console.error('Error converting JSON to CSV:', error);
    }
}

