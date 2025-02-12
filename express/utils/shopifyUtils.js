import "dotenv/config.js";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const storeName = process.env.SHOPIFY_STORE_NAME;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

export async function getProductsFromShopify() {
    try {
        const response = await axios.get(`https://${storeName}.myshopify.com/admin/api/2025-01/products.json`, {
            headers: {
                "X-Shopify-Access-Token": accessToken,
            },
        });
        console.log("Fetched products:", response.data.products);
        return response.data.products;
    } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        return [];
    }
}

export async function initializeComparatorProducts() {
    try {
        console.log("---------------------------------------------------------------");
        console.log("Initializing comparator products...");
        console.log("---------------------------------------------------------------");
        const response = await axios.get(`https://${storeName}.myshopify.com/admin/api/2025-01/products.json`, {
            headers: {
                "X-Shopify-Access-Token": accessToken,
            },
        });

        const products = response.data.products;

        if (!products.length) {
            console.log("No products found.");
            return;
        }

        for (const product of products) {
            const productName = product.title;

            await prisma.comparator.upsert({
                where: { query: productName },
                update: { updatedAt: new Date() },
                create: {
                    query: productName,
                    status: "pending",
                },
            });

            console.log(`Inserted/Updated product: ${productName}`);
        }
        console.log("[END]")
    } catch (error) {
        console.error("Error in initializeComparatorProducts:", error.response?.data || error.message);
    } finally {
        await prisma.$disconnect();
    }
}


