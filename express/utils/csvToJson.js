import fs from 'fs';
import Papa from 'papaparse';

// export async function convertCsvToJson(csvFilePath, jsonFilePath) {
//     try {
//         const csvData = await fs.promises.readFile(csvFilePath, 'utf-8');
//         console.log('CSV file read successfully.');

//         Papa.parse(csvData, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const formattedData = result.data.map(row => {
//                     return {
//                         title: row['title'] || '',
//                         price: row['price'] || '',
//                         company: row['company'] || '',
//                         moq: row['moq'] || '',
//                         rating: row['rating'] || '',
//                         image: row['image'] || '',
//                         link: row['link'] || '',
//                     };
//                 });

//                 console.log('Formatted JSON data:', formattedData);

//                 fs.promises.writeFile(jsonFilePath, JSON.stringify(formattedData, null, 2), 'utf-8')
//                     .then(() => {
//                         console.log(`JSON file successfully created: ${jsonFilePath}`);
//                     })
//                     .catch((writeError) => {
//                         console.error('Error writing JSON file:', writeError);
//                     });
//             },
//             error: (error) => {
//                 console.error('Error while parsing CSV:', error.message);
//             }
//         });
//     } catch (error) {
//         console.error('Error reading CSV file:', error);
//     }
// }

// Example usage:
// convertCsvToJson('./csv/man\'s_t-shirt_Alibaba_2025-02-05T07-50-24-981Z_data.csv', 'json/results.json');

export async function convertCsvToJson(csvFilePath) {
    try {
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
                        rating: row['rating'] || '',
                        image: row['image'] || '',
                        link: row['link'] || '',
                    }));

                    console.log('Formatted JSON data:', formattedData);
                    resolve(formattedData); // ✅ Return formatted JSON data
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
