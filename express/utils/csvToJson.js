import fs from 'fs';
import Papa from 'papaparse';

export async function convertCsvToJson(csvFilePath) {
    try {
        console.log("---------------------------------------------------------------");
        console.log("Converting CSV to JSON...");
        console.log("---------------------------------------------------------------");

        const csvData = await fs.promises.readFile(csvFilePath, 'utf-8');
        console.log('CSV file read successfully.');

        return new Promise((resolve, reject) => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const formattedData = result.data.map(row => ({
                        title: row['title'] || '',
                        price: row['price'] || '',
                        company: row['company'] || '',
                        moq: row['moq'] || '',
                        nop: row['nop'] || '',
                        rating: row['rating'] || '',
                        image: row['image'] || '',
                        link: row['link'] || '',
                    }));

                    console.log('Formatted JSON data:', formattedData);
                    console.log("[END]");

                    resolve(formattedData);
                },
                error: (error) => {
                    console.error('Error while parsing CSV:', error.message);
                    reject(error);
                }
            });
        });

    } catch (error) {
        console.error('Error reading CSV file:', error);
        throw error;
    }
}
