// import { Layout, Page, Text } from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";
// import { useLoaderData } from "@remix-run/react";
// import { loader } from "../utils/fetch.products";
// import "../styles/komparo.css";
// import { useState } from "react";

// export { loader };

// export default function KomparoPage() {
//   const [showScanner, setShowScanner] = useState(false);
//   const [scannedData, setScannedData] = useState(null);
//   const data = useLoaderData();
//   const products = data?.products || [];
//   // console.log(scannedData);
//   // console.log(products);
//   return (
//     <div className="back-ground">
//       <Layout>
//         <Layout.Section>
//           <h3 className="heading">Your Products</h3>
//           <div className="container">
//             {products.length > 0 ? (
//               <>
//                 <div className={showScanner ? "none" : "grid"}>
//                   {products.map((product) => (
//                     <ProductCard
//                       key={product.id}
//                       product={product}
//                       setShowScanner={setShowScanner}
//                       setScannedData={setScannedData}
//                     />
//                   ))}
//                 </div>

//                 <div className={showScanner ? "block" : "none"}>
//                   <section className="sc-1">
//                     <img src={scannedData?.imageUrl} className="image-scan" />
//                     <article className="card-body">
//                       <h3
//                         className="title"
//                         style={{ fontSize: "26px", marginBottom: "12px" }}
//                       >
//                         {scannedData?.title}
//                       </h3>
//                       <h4 className="price">{scannedData?.price}</h4>
//                       <p
//                         style={{
//                           padding: "25px",
//                           backgroundColor: "white",
//                           borderRadius: "20px",
//                           marginTop: "20px",
//                         }}
//                       >
//                         {scannedData?.description}
//                       </p>
//                     </article>
//                   </section>
//                 </div>

//                 <div className="pagination-container">
//                   <button className="pagination-arrow">←</button>
//                   <button
//                     className="pagination-button"
//                     style={{ backgroundColor: "#FBFBFB" }}
//                   >
//                     1
//                   </button>
//                   <button className="pagination-button">2</button>
//                   <button className="pagination-button">3</button>
//                   <button className="pagination-arrow">→</button>
//                 </div>
//               </>
//             ) : (
//               <Text as="p">No products found.</Text>
//             )}
//           </div>
//         </Layout.Section>
//       </Layout>
//     </div>
//   );
// }

// function ProductCard({ product, setShowScanner, setScannedData }) {
//   function scanHandler(data) {
//     setShowScanner(true);
//     setScannedData(data);
//     console.log(data);
//   }
//   return (
//     <div className="card">
//       <img
//         src={product.imageUrl || "/placeholder.svg"}
//         alt={product.title}
//         className="image"
//       />
//       <div>
//         <h5 className="title">{product.title}</h5>
//         <p className="price">${product.price}</p>
//         <p className="btn-container">
//           <button className="scan-button" onClick={() => scanHandler(product)}>
//             scan
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import { Layout, Page, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { loader } from "../utils/fetch.products";
import "../styles/komparo.css";

export { loader };

export default function KomparoPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const data = useLoaderData();
  const products = data?.products || [];

  async function updatePrice() {
    if (!scannedData || !newPrice) return;
    console.log("updatePrice: ", scannedData);
    setLoading(true);

    try {
      const response = await fetch("/api/updateProductPrice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: scannedData.id,
          newPrice,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Price updated successfully!");
        setScannedData({ ...scannedData, price: newPrice });
      } else {
        alert("Failed to update price.");
      }
    } catch (error) {
      console.error("Error updating price:", error);
    }

    setLoading(false);
  }

  return (
    <div className="back-ground">
      <Layout>
        <Layout.Section>
          <h3 className="heading">Your Products</h3>
          <div className="container">
            {products.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className={showScanner ? "none" : "grid"}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      setShowScanner={setShowScanner}
                      setScannedData={setScannedData}
                      setNewPrice={setNewPrice}
                    />
                  ))}
                </div>

                {/* Scanned Product Details */}
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
                      <h4 className="price">
                        Current Price: ${scannedData?.price}
                      </h4>

                      {/* Price Update Input Field & Button */}
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="price-input"
                        placeholder="Enter new price"
                      />
                      <button
                        className="update-button"
                        onClick={updatePrice}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Price"}
                      </button>

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
                </div>

                {/* Pagination */}
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

function ProductCard({ product, setShowScanner, setScannedData, setNewPrice }) {
  function scanHandler(data) {
    setShowScanner(true);
    setScannedData(data);
    setNewPrice(data.price); // Set the initial price in input field
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
            Scan
          </button>
        </p>
      </div>
    </div>
  );
}
