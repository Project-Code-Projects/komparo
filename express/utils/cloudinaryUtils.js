// eslint-disable-next-line no-unused-vars
import { config } from "../config/cloudinaryConfig.js";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import axios from "axios";
import path from "path";
import fs from "fs";

import { convertCsvToJson } from "./csvToJson.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function uploadCsv(csvFilePath, retailer = "alibaba") {
  try {
    const uploadResult = await cloudinary.v2.uploader.upload(csvFilePath, {
      resource_type: "auto",
      folder: `csv_${retailer}`,
    });

    const fileUrl = uploadResult.secure_url;

    console.log("CSV file uploaded successfully:", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("Error uploading:", error);
  }
}

export async function downloadCsv(fileUrl) {
  try {
    const response = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    });

    const outputPath = path.join(__dirname, "../datasets/csv/downloaded_file.csv");
    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("CSV file downloaded successfully to:", outputPath);

    const formattedData = await convertCsvToJson(
      outputPath,
      "../datasets/json/display_results.json",
    );

    console.log("Converted CSV to JSON successfully:", formattedData);

    return formattedData;
  } catch (error) {
    console.error("Error downloading CSV:", fileUrl);
    return;
  }
}

// Example Usage
// uploadCsv("../datasets/csv/downloaded_file.csv");
// downloadCsv("https://res.cloudinary.com/dganhxhid/raw/upload/v1738969254/csv_alibaba/kbxwzvwc38wwxqz9wii8.csv");
