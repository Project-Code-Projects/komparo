import { Layout, Page, Text } from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { useLoaderData } from "@remix-run/react"
import { loader } from "../utils/fetch.products"
import "../styles/komparo.css"

export { loader }

export default function KomparoPage() {
  const data = useLoaderData()
  const products = data?.products || []

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <div className="container">
            <TitleBar title="Your Products" />
            {products.length > 0 ? (
              <>
                <div className="grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="pagination-container">
                  <button className="pagination-arrow">←</button>
                  <button className="pagination-button" style={{ backgroundColor: "#FBFBFB" }}>1</button>
                  <button className="pagination-button">2</button>
                  <button className="pagination-button">3</button>
                  <button className="pagination-arrow">→</button>
                </div>
              </>
            ) : (
              <Text as="p">No products found.</Text>
            )}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

function ProductCard({ product }) {
  return (
    <div className="card">
      <div className="image-container">
        <img src={product.imageUrl || "/placeholder.svg"} alt={product.title} className="image" />
      </div>
      <div className="product-info">
        <Text as="h2" className="title">
          {product.title}
        </Text>
        <Text as="p" className="price">
          ${product.price}
        </Text>
        <button className="scan-button">scan</button>
      </div>
    </div>
  )
}
