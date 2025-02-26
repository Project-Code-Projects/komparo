import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.patch("/", async (req, res) => {
  try {
    console.log("---------------------------------------------------------------");
    console.log("Updating Shopify price...");
    console.log("---------------------------------------------------------------");

    const { productId, newPrice, newCompareAtPrice } = req.body;
    if (!productId || !newPrice || !newCompareAtPrice) {
      return res.status(400).json({ success: false, error: "Missing product ID or price" });
    }

    const id = productId.split("/").pop();
    console.log("Product ID:", id);

    // Step 1: Fetch product details to get variant IDs
    const productResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2025-01/products/${id}.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (!productResponse.ok) {
      const errorResponse = await productResponse.json();
      console.error("Failed to fetch product:", errorResponse);
      return res.status(500).json({ success: false, error: errorResponse.errors });
    }

    const productData = await productResponse.json();
    const variants = productData?.product?.variants || [];

    if (variants.length === 0) {
      return res.status(400).json({ success: false, error: "No variants found for this product" });
    }

    console.log(`Found ${variants.length} variants. Updating each variant...`);

    // Step 2: Update each variant
    for (const variant of variants) {
      const variantId = variant.id;

      const updateResponse = await fetch(
        `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2025-01/variants/${variantId}.json`,
        {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variant: {
              id: variantId,
              price: Number(newPrice).toFixed(2),
              compare_at_price: Number(newCompareAtPrice).toFixed(2),
            },
          }),
        }
      );

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        console.error(`Failed to update variant ${variantId}:`, updateResult);
        return res.status(500).json({ success: false, error: updateResult.errors });
      }

      console.log(`Updated variant ${variantId}: $${newPrice} (Compare-at: $${newCompareAtPrice})`);
    }

    res.json({ success: true, message: "Price updated successfully for all variants!" });
  } catch (error) {
    console.error("Error updating Shopify price:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
