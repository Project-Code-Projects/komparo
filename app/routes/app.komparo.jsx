import { Layout, Text } from "@shopify/polaris"
import { useLoaderData } from "@remix-run/react"
import { loader } from "../utils/fetch.products"
import "../styles/komparo.css"
import { useState } from "react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export { loader }

export default function KomparoPage() {
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const data = useLoaderData()
  const products = data?.products || []
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };
  setTimeout(() => {
    setLoading(true);
  }, 500);
  // console.log(scannedData?.description?.length);
  // console.log(loading);

  // const modal = document.getElementById("myModal");
  // const closeButton = document.getElementById("closeBtn");
  // // Function to close modal
  // function closeModal() {
  //   modal.classList.add("hidden");
  // }
  // // Click on close button
  // closeButton.addEventListener("click", closeModal);
  // // Click outside the modal content
  // modal.addEventListener("click", function (event) {
  //   if (event.target === modal) {
  //     closeModal();
  //   }
  // });
  // // Example: Open the modal (you can trigger this with a button)
  // function openModal() {
  //   modal.classList.remove("hidden");
  // }
  return (
    <main style={{ padding: '60px', paddingTop: '80px', backgroundColor: '#3D3D3D' }}>
      <div className="back-ground">
        <Layout>
          <Layout.Section>
            <h3 className="heading">Your Products</h3>
            <div className="container">

              {products.length > 0 ? (
                <>
                  <div className="grid">
                    {products.map((product) => (
                      <ProductCard key={product.id}
                        product={product}
                        setScannedData={setScannedData} setShowModal={setShowModal}
                      />
                    ))}
                  </div>

                  <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-content">
                      <div className="modal-body">
                        <div>
                          <section className="sc-1">
                            <img src={scannedData?.imageUrl} className="image-scan" />
                            <article className="card-body">
                              <h3 className="scan-title">{scannedData?.title}</h3>
                              <h4 className="price" style={{ fontSize: '22px' }}>${scannedData?.price}</h4>
                              <p className="scan-desc" style={{ padding: '25px', backgroundColor: 'white', borderRadius: '20px', marginTop: '20px' }}>
                                {scannedData?.description && scannedData.description.length != 0 ? scannedData.description : 'No description provided!'}
                              </p>
                            </article>
                          </section>
                          <section className="sc-2">
                            <div className="slider-container">
                              {
                                loading && 
                                <Slider {...settings}>
                                                              <article className="scrapped-data-card">
                                                                <img src={scannedData?.imageUrl} className="scrapped-img" />
                                                                <h6 className="scrapped-title">Temu</h6>
                                                                <p className="scrapped-desc">{scannedData?.description}</p>
                                                                <h5 className="scrapped-price">${scannedData?.price}</h5>
                                                              </article>
                                                              <article className="scrapped-data-card">
                                                                <img src={scannedData?.imageUrl} className="scrapped-img" />
                                                                <h6 className="scrapped-title">Amazon</h6>
                                                                <p className="scrapped-desc">{scannedData?.description}</p>
                                                                <h5 className="scrapped-price">${scannedData?.price}</h5>
                                                              </article>
                                                              <article className="scrapped-data-card">
                                                                <img src={scannedData?.imageUrl} className="scrapped-img" />
                                                                <h6 className="scrapped-title">Alibaba</h6>
                                                                <p className="scrapped-desc">{scannedData?.description}</p>
                                                                <h5 className="scrapped-price">${scannedData?.price}</h5>
                                                              </article>
                                                              <article className="scrapped-data-card">
                                                                <img src={scannedData?.imageUrl} className="scrapped-img" />
                                                                <h6 className="scrapped-title">Temu</h6>
                                                                <p className="scrapped-desc">{scannedData?.description}</p>
                                                                <h5 className="scrapped-price">${scannedData?.price}</h5>
                                                              </article>
                                                              <article className="scrapped-data-card">
                                                                <img src={scannedData?.imageUrl} className="scrapped-img" />
                                                                <h6 className="scrapped-title">Amazon</h6>
                                                                <p className="scrapped-desc">{scannedData?.description}</p>
                                                                <h5 className="scrapped-price">${scannedData?.price}</h5>
                                                              </article>
                                                              <article className="scrapped-data-card">
                                                                <img src={scannedData?.imageUrl} className="scrapped-img" />
                                                                <h6 className="scrapped-title">Alibaba</h6>
                                                                <p className="scrapped-desc">{scannedData?.description}</p>
                                                                <h5 className="scrapped-price">${scannedData?.price}</h5>
                                                              </article>
                                </Slider>
                              }
                            </div>
                            <hr style={{ width: '95%', margin: '20px auto' }} />
                            <form style={{ textAlign: 'right', padding: '30px' }} onSubmit={(e) => {
                              e.preventDefault();
                              console.log(e.target.price.value);
                            }}>
                              <p style={{ fontSize: '18px', marginBottom: '25px', textAlign: 'left' }}><span className="btn" style={{ fontWeight: 'bold' }}>Current Price &nbsp; &nbsp;$</span><span className="form-input-default" style={{ fontWeight: '600', marginLeft: '8px', padding: '10px', paddingRight: '40px', borderRadius: '10px' }}>{scannedData?.price}</span></p>
                              <p style={{ fontSize: '18px', marginLeft: '25px', textAlign: 'left' }}><span className="btn" style={{ fontWeight: 'bold' }}>New Price &nbsp; &nbsp;$</span> <input className="form-input-default" style={{ fontWeight: '600', width: '98px', marginLeft: '8px', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '18px' }} name="price" type="number" /></p>
                              <button style={{ color: "white", backgroundColor: '#54BAB9', border: 'none', padding: '8px 20px', borderRadius: '22px', fontSize: '18px', cursor: 'pointer' }} type="submit" className="btn">Update</button>
                            </form>
                          </section>
                          <p style={{textAlign: 'center', marginTop: '30px'}}>
                          <button type="button" className="" onClick={() => {
                          setShowModal(false); setScannedData(null);
                        }}>Close</button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pagination-container">
                    <button className="pagination-arrow" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}><img className="" src="/Polygon 36.png" /></button>
                    <button className="pagination-button">1</button>
                    <button className="pagination-button">2</button>
                    <button className="pagination-button">3</button>
                    <button className="pagination-arrow" style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}><img className="" src="/Polygon 37.png" /></button>
                  </div>
                </>
              ) : (
                <Text as="p">No products found.</Text>
              )}
            </div>
          </Layout.Section>
        </Layout>
      </div>
    </main>
  )
}

function ProductCard({ product, setShowModal, setScannedData }) {

  function scanHandler(data) {
    setScannedData(data);
    setShowModal(true);
    // console.log(data);
  }
  return (
    <div className="card" onClick={() => scanHandler(product)}>
      <img src={product.imageUrl || "/placeholder.svg"} alt={product.title} className="image" />
      <div>
        <h5 className="title">
          {product.title}
        </h5>
        <p className="price">
          ${product.price}
        </p>
      </div>
    </div>
  )
}
