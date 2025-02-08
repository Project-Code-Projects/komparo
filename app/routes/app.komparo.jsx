import { Layout, Text, InlineStack } from "@shopify/polaris"
import { useLoaderData } from "@remix-run/react"
import { loader } from "../utils/fetch.products"
import "../styles/komparo.css"
import { useEffect, useState } from "react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Rating } from "../components/rating";

export { loader }

export default function KomparoPage() {
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardItems, setCardItems] = useState([]);
  const data = useLoaderData();
  const products = data?.products || [];
  useEffect(() => {
    setCardItems(products.slice((0 * 9), (0 * 9) + 9))
  }, [])
  const arr = [];
  for (let i = 1; i <= Math.ceil(products.length / 9); i++) {
    arr.push(i);
  }
  function paginationHandler(x) {
    setCardItems(products.slice((x * 9), (x * 9) + 9));
  }
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };
  const settingsNew = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  setTimeout(() => {
    setLoading(true);
  }, 500);
  // console.log(scannedData?.description?.length);

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

              {cardItems.length > 0 ? (
                <>
                  <div className="grid">
                    {cardItems.map((product) => (
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
                            {/* <div className="slider-container">
                              {
                                loading && 
                                <Slider {...settings}>
                                </Slider>
                              }
                            </div> */}
                            <div className="image-slider-container">
                              {
                                loading &&
                                <Slider {...settingsNew}>
                                  <article className="scrapped-data-card">
                                    <img src={scannedData?.imageUrl} className="scrapped-img" />
                                    <h4 className="scraped-title">Title</h4>
                                    <InlineStack gap="100" align="start">
                            <Rating rating={5} />
                          </InlineStack>
                                    <h6 className="brand-logo">
                                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
                                        <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: 'normal'}}><g transform="scale(5.33333,5.33333)"><path d="M39.6,39c-4.2,3.1 -10.5,5 -15.6,5c-7.3,0 -13.8,-2.9 -18.8,-7.4c-0.4,-0.4 0,-0.8 0.4,-0.6c5.4,3.1 11.5,4.9 18.3,4.9c4.6,0 10.4,-1 15.1,-3c0.7,-0.2 1.3,0.6 0.6,1.1zM41.1,36.9c-0.5,-0.7 -3.5,-0.3 -4.8,-0.2c-0.4,0 -0.5,-0.3 -0.1,-0.6c2.3,-1.7 6.2,-1.2 6.6,-0.6c0.4,0.6 -0.1,4.5 -2.3,6.3c-0.3,0.3 -0.7,0.1 -0.5,-0.2c0.5,-1.2 1.6,-4 1.1,-4.7z" fill="#ffb300"></path><path d="M36.9,29.8c-1,-1.3 -2,-2.4 -2,-4.9v-8.3c0,-3.5 0,-6.6 -2.5,-9c-2,-1.9 -5.3,-2.6 -7.9,-2.6c-5.5,0 -10.3,2.2 -11.5,8.4c-0.1,0.7 0.4,1 0.8,1.1l5.1,0.6c0.5,0 0.8,-0.5 0.9,-1c0.4,-2.1 2.1,-3.1 4.1,-3.1c1.1,0 3.2,0.6 3.2,3v3c-3.2,0 -6.6,0 -9.4,1.2c-3.3,1.4 -5.6,4.3 -5.6,8.6c0,5.5 3.4,8.2 7.8,8.2c3.7,0 5.9,-0.9 8.8,-3.8c0.9,1.4 1.3,2.2 3,3.7c0.4,0.2 0.9,0.2 1.2,-0.1v0c1,-0.9 2.9,-2.6 4,-3.5c0.5,-0.4 0.4,-1 0,-1.5zM27,22.1v0c0,2 -0.1,6.9 -5,6.9c-3,0 -3,-3 -3,-3c0,-4.5 4.2,-5 8,-5z" fill="#3d3d3d"></path></g></g>
                                      </svg>

                                    </h6>
                                    <h5 className="scrapped-price">${scannedData?.price}</h5>
                                  </article>
                                  <article className="scrapped-data-card">
                                    <img src={scannedData?.imageUrl} className="scrapped-img" />
                                    <h4 className="scraped-title">Title</h4>
                                    <InlineStack gap="100" align="start">
                            <Rating rating={5} />
                          </InlineStack>
                                    <h6 className="brand-logo">
                                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                        <path fill="#ff8f00" d="M39,39.1H9c-1.7,0-3-1.3-3-3V9c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v27.1C42,37.7,40.7,39.1,39,39.1z"></path><path fill="#dd2c00" d="M39,42H9c-1.7,0-3-1.3-3-3V14c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v25C42,40.7,40.7,42,39,42z"></path><path fill="#b71c1c" d="M15 15A2 2 0 1 0 15 19 2 2 0 1 0 15 15zM33 15A2 2 0 1 0 33 19 2 2 0 1 0 33 15z"></path><path fill="#fff" d="M24,27c-5.5,0-10-4.5-10-10c0-0.6,0.4-1,1-1s1,0.4,1,1c0,4.4,3.6,8,8,8s8-3.6,8-8c0-0.6,0.4-1,1-1 s1,0.4,1,1C34,22.5,29.5,27,24,27z"></path>
                                      </svg>

                                    </h6>
                                    <h5 className="scrapped-price">${scannedData?.price}</h5>
                                  </article>
                                  <article className="scrapped-data-card">
                                    <img src={scannedData?.imageUrl} className="scrapped-img" />
                                    <h4 className="scraped-title">Title</h4>
                                    <InlineStack gap="100" align="start">
                            <Rating rating={5} />
                          </InlineStack>
                                    <h6 className="brand-logo">
                                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
                                        <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: 'normal'}}><g transform="scale(5.33333,5.33333)"><path d="M39.6,39c-4.2,3.1 -10.5,5 -15.6,5c-7.3,0 -13.8,-2.9 -18.8,-7.4c-0.4,-0.4 0,-0.8 0.4,-0.6c5.4,3.1 11.5,4.9 18.3,4.9c4.6,0 10.4,-1 15.1,-3c0.7,-0.2 1.3,0.6 0.6,1.1zM41.1,36.9c-0.5,-0.7 -3.5,-0.3 -4.8,-0.2c-0.4,0 -0.5,-0.3 -0.1,-0.6c2.3,-1.7 6.2,-1.2 6.6,-0.6c0.4,0.6 -0.1,4.5 -2.3,6.3c-0.3,0.3 -0.7,0.1 -0.5,-0.2c0.5,-1.2 1.6,-4 1.1,-4.7z" fill="#ffb300"></path><path d="M36.9,29.8c-1,-1.3 -2,-2.4 -2,-4.9v-8.3c0,-3.5 0,-6.6 -2.5,-9c-2,-1.9 -5.3,-2.6 -7.9,-2.6c-5.5,0 -10.3,2.2 -11.5,8.4c-0.1,0.7 0.4,1 0.8,1.1l5.1,0.6c0.5,0 0.8,-0.5 0.9,-1c0.4,-2.1 2.1,-3.1 4.1,-3.1c1.1,0 3.2,0.6 3.2,3v3c-3.2,0 -6.6,0 -9.4,1.2c-3.3,1.4 -5.6,4.3 -5.6,8.6c0,5.5 3.4,8.2 7.8,8.2c3.7,0 5.9,-0.9 8.8,-3.8c0.9,1.4 1.3,2.2 3,3.7c0.4,0.2 0.9,0.2 1.2,-0.1v0c1,-0.9 2.9,-2.6 4,-3.5c0.5,-0.4 0.4,-1 0,-1.5zM27,22.1v0c0,2 -0.1,6.9 -5,6.9c-3,0 -3,-3 -3,-3c0,-4.5 4.2,-5 8,-5z" fill="#3d3d3d"></path></g></g>
                                      </svg>

                                    </h6>
                                    <h5 className="scrapped-price">${scannedData?.price}</h5>
                                  </article>
                                  <article className="scrapped-data-card">
                                    <img src={scannedData?.imageUrl} className="scrapped-img" />
                                    <h4 className="scraped-title">Title</h4>
                                    <InlineStack gap="100" align="start">
                            <Rating rating={5} />
                          </InlineStack>
                                    <h6 className="brand-logo">
                                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                        <path fill="#ff8f00" d="M39,39.1H9c-1.7,0-3-1.3-3-3V9c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v27.1C42,37.7,40.7,39.1,39,39.1z"></path><path fill="#dd2c00" d="M39,42H9c-1.7,0-3-1.3-3-3V14c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v25C42,40.7,40.7,42,39,42z"></path><path fill="#b71c1c" d="M15 15A2 2 0 1 0 15 19 2 2 0 1 0 15 15zM33 15A2 2 0 1 0 33 19 2 2 0 1 0 33 15z"></path><path fill="#fff" d="M24,27c-5.5,0-10-4.5-10-10c0-0.6,0.4-1,1-1s1,0.4,1,1c0,4.4,3.6,8,8,8s8-3.6,8-8c0-0.6,0.4-1,1-1 s1,0.4,1,1C34,22.5,29.5,27,24,27z"></path>
                                      </svg>

                                    </h6>
                                    <h5 className="scrapped-price">${scannedData?.price}</h5>
                                  </article>
                                  <article className="scrapped-data-card">
                                    <img src={scannedData?.imageUrl} className="scrapped-img" />
                                    <h4 className="scraped-title">Title</h4>
                                    <InlineStack gap="100" align="start">
                            <Rating rating={5} />
                          </InlineStack>
                                    <h6 className="brand-logo">
                                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
                                        <g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: 'normal'}}><g transform="scale(5.33333,5.33333)"><path d="M39.6,39c-4.2,3.1 -10.5,5 -15.6,5c-7.3,0 -13.8,-2.9 -18.8,-7.4c-0.4,-0.4 0,-0.8 0.4,-0.6c5.4,3.1 11.5,4.9 18.3,4.9c4.6,0 10.4,-1 15.1,-3c0.7,-0.2 1.3,0.6 0.6,1.1zM41.1,36.9c-0.5,-0.7 -3.5,-0.3 -4.8,-0.2c-0.4,0 -0.5,-0.3 -0.1,-0.6c2.3,-1.7 6.2,-1.2 6.6,-0.6c0.4,0.6 -0.1,4.5 -2.3,6.3c-0.3,0.3 -0.7,0.1 -0.5,-0.2c0.5,-1.2 1.6,-4 1.1,-4.7z" fill="#ffb300"></path><path d="M36.9,29.8c-1,-1.3 -2,-2.4 -2,-4.9v-8.3c0,-3.5 0,-6.6 -2.5,-9c-2,-1.9 -5.3,-2.6 -7.9,-2.6c-5.5,0 -10.3,2.2 -11.5,8.4c-0.1,0.7 0.4,1 0.8,1.1l5.1,0.6c0.5,0 0.8,-0.5 0.9,-1c0.4,-2.1 2.1,-3.1 4.1,-3.1c1.1,0 3.2,0.6 3.2,3v3c-3.2,0 -6.6,0 -9.4,1.2c-3.3,1.4 -5.6,4.3 -5.6,8.6c0,5.5 3.4,8.2 7.8,8.2c3.7,0 5.9,-0.9 8.8,-3.8c0.9,1.4 1.3,2.2 3,3.7c0.4,0.2 0.9,0.2 1.2,-0.1v0c1,-0.9 2.9,-2.6 4,-3.5c0.5,-0.4 0.4,-1 0,-1.5zM27,22.1v0c0,2 -0.1,6.9 -5,6.9c-3,0 -3,-3 -3,-3c0,-4.5 4.2,-5 8,-5z" fill="#3d3d3d"></path></g></g>
                                      </svg>

                                    </h6>
                                    <h5 className="scrapped-price">${scannedData?.price}</h5>
                                  </article>
                                  <article className="scrapped-data-card">
                                    <img src={scannedData?.imageUrl} className="scrapped-img" />
                                    <h4 className="scraped-title">Title</h4>
                                    <InlineStack gap="100" align="start">
                            <Rating rating={5} />
                          </InlineStack>
                                    <h6 className="brand-logo">
                                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                        <path fill="#ff8f00" d="M39,39.1H9c-1.7,0-3-1.3-3-3V9c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v27.1C42,37.7,40.7,39.1,39,39.1z"></path><path fill="#dd2c00" d="M39,42H9c-1.7,0-3-1.3-3-3V14c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v25C42,40.7,40.7,42,39,42z"></path><path fill="#b71c1c" d="M15 15A2 2 0 1 0 15 19 2 2 0 1 0 15 15zM33 15A2 2 0 1 0 33 19 2 2 0 1 0 33 15z"></path><path fill="#fff" d="M24,27c-5.5,0-10-4.5-10-10c0-0.6,0.4-1,1-1s1,0.4,1,1c0,4.4,3.6,8,8,8s8-3.6,8-8c0-0.6,0.4-1,1-1 s1,0.4,1,1C34,22.5,29.5,27,24,27z"></path>
                                      </svg>

                                    </h6>
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
                              <p style={{ fontSize: '18px', marginLeft: '25px', textAlign: 'left' }}><span className="btn" style={{ fontWeight: 'bold' }}>New Price &nbsp; &nbsp;$</span> <input className="form-input-default" style={{ fontWeight: '600', width: '98px', marginLeft: '8px', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '18px' }} name="price" type="number" step="0.01"/></p>
                              <button style={{ color: "white", backgroundColor: '#54BAB9', border: 'none', padding: '8px 20px', borderRadius: '22px', fontSize: '18px', cursor: 'pointer' }} type="submit" className="btn">Update</button>
                            </form>
                          </section>
                          <p style={{ textAlign: 'center', marginTop: '30px' }}>
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
                    {arr.map(x => <button key={x} className="pagination-button" onClick={() => paginationHandler(x - 1)}>
                      {x}
                    </button>)}
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
