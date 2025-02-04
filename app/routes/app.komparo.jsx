import { Layout, Page, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../utils/fetch.products";
import "../styles/komparo.css";
import { useState } from "react";

export { loader };

export default function KomparoPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const data = useLoaderData();
  const products = data?.products || [];
  // console.log(scannedData);
  // console.log(products);
  return (
    <div className="back-ground">
      <Layout>
        <Layout.Section>
          <h3 className="heading">Your Products</h3>
          <div className="container">
            {products.length > 0 ? (
              <>
                <div className={showScanner ? "none" : "grid"}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      setShowScanner={setShowScanner}
                      setScannedData={setScannedData}
                    />
                  ))}
                </div>

                <div className={showScanner ? "block" : "none"}>
                  <section className="sc-1">
                    <img src={scannedData?.imageUrl} className="image-scan" />
                    <article className="card-body">
                      <h3
                        className="title"
                        style={{ fontSize: "26px", marginBottom: "12px" }}
                      >
                        {scannedData?.title}
                      </h3>
                      <h4 className="price">${scannedData?.price}</h4>
                      <p
                        style={{
                          padding: "25px",
                          backgroundColor: "white",
                          borderRadius: "20px",
                          marginTop: "20px",
                        }}
                      >
                        {scannedData?.description}
                      </p>
                    </article>
                  </section>
                  <section className="sc-2">
                    <div style={{ display: "flex" }}>
                      <article className="scrapped-data-card">
                        <img
                          src={scannedData?.imageUrl}
                          className="scrapped-img"
                        />
                        <h6 className="scrapped-title">Temu</h6>
                        <p className="scrapped-desc">
                          {scannedData?.description}
                        </p>
                        <h5 className="scrapped-price">
                          ${scannedData?.price}
                        </h5>
                      </article>
                      <article className="scrapped-data-card">
                        <img
                          src={scannedData?.imageUrl}
                          className="scrapped-img"
                        />
                        <h6 className="scrapped-title">Amazon</h6>
                        <p className="scrapped-desc">
                          {scannedData?.description}
                        </p>
                        <h5 className="scrapped-price">
                          ${scannedData?.price}
                        </h5>
                      </article>
                      <article className="scrapped-data-card">
                        <img
                          src={scannedData?.imageUrl}
                          className="scrapped-img"
                        />
                        <h6 className="scrapped-title">Alibaba</h6>
                        <p className="scrapped-desc">
                          {scannedData?.description}
                        </p>
                        <h5 className="scrapped-price">
                          ${scannedData?.price}
                        </h5>
                      </article>
                    </div>
                    <hr style={{ width: "95%", margin: "20px auto" }} />
                    <form
                      style={{
                        fontFamily: '"Times New Roman", Times, serif',
                        textAlign: "right",
                        padding: "30px",
                      }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        console.log(e.target.price.value);
                      }}
                    >
                      <p
                        style={{
                          fontSize: "18px",
                          marginBottom: "20px",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          Current Price &nbsp; &nbsp;$
                        </span>
                        <span
                          style={{
                            fontWeight: "600",
                            marginLeft: "8px",
                            backgroundColor: "lightgray",
                            padding: "10px",
                            paddingRight: "40px",
                            borderRadius: "10px",
                          }}
                        >
                          {scannedData?.price}
                        </span>
                      </p>
                      <p
                        style={{
                          fontSize: "18px",
                          marginLeft: "27px",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          New Price &nbsp; &nbsp;$
                        </span>{" "}
                        <input
                          style={{
                            width: "95px",
                            marginLeft: "8px",
                            backgroundColor: "lightgray",
                            border: "none",
                            padding: "10px",
                            borderRadius: "10px",
                          }}
                          name="price"
                          type="number"
                          className=""
                        />
                      </p>
                      <button
                        style={{
                          fontFamily: '"Times New Roman", Times, serif',
                          color: "white",
                          backgroundColor: "MediumAquaMarine",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: "22px",
                          fontSize: "18px",
                        }}
                        type="submit"
                        className=""
                      >
                        Update
                      </button>
                    </form>
                  </section>
                </div>

                <div className="pagination-container">
                  <button className="pagination-arrow">←</button>
                  <button
                    className="pagination-button"
                    style={{ backgroundColor: "#FBFBFB" }}
                  >
                    1
                  </button>
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
    </div>
  );
}

function ProductCard({ product, setShowScanner, setScannedData }) {
  function scanHandler(data) {
    setShowScanner(true);
    setScannedData(data);
    // console.log(data);
  }
  return (
    <div className="card">
      <img
        src={product.imageUrl || "/placeholder.svg"}
        alt={product.title}
        className="image"
      />
      <div>
        <h5 className="title">{product.title}</h5>
        <p className="price">${product.price}</p>
        <p className="btn-container">
          <button className="scan-button" onClick={() => scanHandler(product)}>
            scan
          </button>
        </p>
      </div>
    </div>
  );
}
