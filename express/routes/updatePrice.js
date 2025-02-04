import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.patch("/", async (req, res) => {
  try {
    const { productId, newPrice } = req.body;
    if (!productId || !newPrice) {
      return res
        .status(400)
        .json({ success: false, error: "Missing product ID or price" });
    }
    const id = productId.split("/").pop();

    // Shopify API URL
    const shopifyURL = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2025-01/products/${id}.json`;
    console.log("Product id: ", id);
    // Request Body
    const body = JSON.stringify({
      product: {
        id: id,
        variants: [{ price: newPrice }],
      },
    });
    console.log("Price: ", newPrice);
    // Shopify API Call
    const response = await fetch(shopifyURL, {
      method: "PATCH",
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      body,
    });
    //console.log("Response: ", response);
    const result = await response.json();
    if (!response.ok) {
      console.error("Shopify API Error:", result);
      return res.status(500).json({ success: false, error: result.errors });
    }

    res.json({ success: true, message: "Price updated successfully!" });
  } catch (error) {
    console.error("Error updating Shopify price:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
