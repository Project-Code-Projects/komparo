import { Card, Layout, Page, Text, BlockStack, InlineStack } from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { Rating } from "../components/rating"
import "../styles/product.css"

const products = [
  {
    title: "Fashion Women Solid Color Casual Elegant Sleeveless Sexy Summer Slip",
    price: "$6.99",
    company: "Suzhou Mingzhou Import And Export Co., Ltd.",
    moq: "Min. order: 10 pieces",
    rating: "4.2",
    image: "https://s.alicdn.com/@sc04/kf/H1122ac66e2e548b19f6324aaa2947e95q.jpg_300x300.jpg",
    link: "https://www.alibaba.com/product-detail/Fashion-Women-Solid-Color-Casual-Elegant_1601283348054.html?selectedCarrierCode=SEMI_MANAGED_STANDARD@@STANDARD",
  },
  {
    title: "New Solid Color High Street Long Summer Dresses Sexy With Slit 2025 Summer",
    price: "$6.55",
    company: "Shenzhen Miya Apparel Co., Ltd.",
    moq: "Min. order: 5 pieces",
    rating: "4.4",
    image: "https://s.alicdn.com/@sc04/kf/H35eed7acd16b4d5d8b706c2241363d18D.jpg_300x300.jpg",
    link: "https://www.alibaba.com/product-detail/New-Solid-Color-High-Street-Long_1601322848080.html?selectedCarrierCode=SEMI_MANAGED_STANDARD@@STANDARD",
  },
  {
    title:
      "Women's Solid Color Fashion Wine Red Dress Slim Autumn and Winter Simple High Collar Versatile Short Skirt Wholesale",
    price: "$5.39",
    company: "Yiwu Kaizhuo Trading Co., Ltd.",
    moq: "Min. order: 2 pieces",
    rating: "4.1",
    image: "https://s.alicdn.com/@sc04/kf/H19d560b044e24093bc3fce745d9a11e6b.jpg_300x300.jpg",
    link: "https://www.alibaba.com/product-detail/Women-s-Solid-Color-Fashion-Wine_1601289655080.html",
  },
]

export default function ScraperProductDisplayPage() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <TitleBar title="Product Comparison" />
            <Card background="bg-surface-secondary">
              <div className="card-wrapper">
                <div className="product-grid">
                  {products.map((product, index) => (
                    <div key={index} className="product-box">
                      <div className="product-image-container">
                        <img src={product.image || "/placeholder.svg"} alt={product.title} className="product-image" />
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
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}


