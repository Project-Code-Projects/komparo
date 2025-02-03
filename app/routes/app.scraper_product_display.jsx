import { Card, Layout, Page, Text, BlockStack, InlineStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Rating } from "../components/rating";
import "../styles/product.css";
import { useState, useEffect } from "react";

export default function ScraperProductDisplayPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = async (searchQuery, maxPrice = 1000, maxPages = 1) => {
    console.log("HandleSearch function triggered");
    
    setLoading(true);
    console.log("loading... please wait");
    
    const response = await fetch('http://localhost:3001/api/scrape/alibaba', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchQuery,
        maxPrice,
        maxPages
      })
    });
    console.log(response);

    const productData = await response.json();

    if (!productData.success) {
      console.error("API call failed:", productData);
      setProducts([]); 
    } else {
      console.log(productData.results);
      setProducts(productData.results || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("Page rendered");
  }, []);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <TitleBar title="Product Comparison" />
            <Card>
              <div style={{ padding: "1rem" }}>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter product to search"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Maximum price"
                />
                <button onClick={() => {
                        console.log("Search button clicked");
                        handleSearch(searchInput, maxPrice);
                      }}>
                  Search
                </button>
              </div>
            </Card>
            <Card background="bg-surface-secondary">
              <div className="card-wrapper">
                {loading ? (
                  <Text as="p">Loading... please wait</Text>
                ) : (
                  <div className="product-grid">
                    {products.map((product, index) => (
                      <div key={index} className="product-box">
                        <div className="product-image-container">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            className="product-image"
                          />
                          <div className="retailer-label">Alibaba</div>
                        </div>
                        <div className="product-details">
                          <div className="product-header">
                            <Text as="p" variant="bodyMd" fontWeight="bold" className="product-title">
                              {product.title}
                            </Text>
                            <Text as="p" variant="headingLg" className="product-price">
                              {product.price}
                            </Text>
                          </div>
                          <Text as="p" variant="bodySm">
                            {product.company}
                          </Text>
                          <Text as="p" variant="bodySm">
                            {product.moq}
                          </Text>
                          <InlineStack gap="100" align="start">
                            <Rating rating={product.rating} />
                          </InlineStack>
                        </div>
                        <Text as="p" variant="bodySm">
                          <a 
                            href={product.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: "blue", textDecoration: "underline" }}
                          >
                            View Product
                          </a>
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
