
import { Layout, Page, Text } from "@shopify/polaris"
import { TitleBar } from "@shopify/app-bridge-react"
import { useLoaderData } from "@remix-run/react"
import { loader } from "../utils/fetch.products"
import "../styles/komparo.css"


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
  );
}
