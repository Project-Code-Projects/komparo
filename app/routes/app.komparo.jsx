import { Layout, Text, InlineStack, Button } from "@shopify/polaris"
import { useLoaderData } from "@remix-run/react"
import { loader } from "../services/fetch.products.js"
import "../styles/komparo.css"
import { useEffect, useState } from "react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Rating } from "../components/rating";
import { AlibabaLogo, AmazonLogo } from '../components/logo.jsx';
import { fetchScrappedProducts } from '../services/fetch.scrapped.products';
import { Toaster } from "../components/toaster.jsx";
export { loader };

export default function KomparoPage() {
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardItems, setCardItems] = useState([]);
  const data = useLoaderData();
  const products = data?.products || [];
  const [fetchedData, setFetchedData] = useState([]);
  const [scrappedProducts, setScrappedProducts] = useState([]);
//   const [alibabaProducts, setAlibabaProducts] = useState([]);
//   const [amazonProducts, setAmazonProducts] = useState([]);
  const [newPrice, setNewPrice] = useState("");
  const [toasterMessage, setToasterMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  async function updatePrice() {
    if (!newPrice) return alert("Please enter a price.");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/updatePrice", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: scannedData.id,
          newPrice: parseFloat(newPrice),
        }),
      });
      const result = await response.json();
      if (result.success) {
        setToasterMessage("Price updated successfully!")
        setScannedData((prevData) => ({
          ...prevData,
          price: parseFloat(newPrice), 
        }));
        setNewPrice(""); 
        document.querySelector("input[name='price']").value = ""; 
      } else {
        throw new Error(result.error || "Failed to update price.");
      }
    } catch (error) {
      console.error("Error updating price:", error);
      alert("Failed to update price.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCardItems(products.slice((0 * 9), (0 * 9) + 9))
  }, [])
  const arr = [];
  for (let i = 1; i <= Math.ceil(products.length / 9); i++) {
    arr.push(i);
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        // const fetchData = await fetchScrappedProducts(scannedData.title);
        const fetchData = await fetch('/scrapedData.json')
          .then(res => res.json())
          .then(data => data);
        const unifiedArr = [];
        fetchData.alibaba.forEach(x => {
          x.platform = 'alibaba'; unifiedArr.push(x);
        });
        fetchData.amazon.forEach(x => {
          x.platform = 'amazon'; unifiedArr.push(x);
        });
        // console.log(unifiedArr);
        setFetchedData(unifiedArr);
        setScrappedProducts(unifiedArr);
        setTimeout(() => {
          const elementsSelected = document.getElementsByClassName('scrapped-title');
          const heightsArr = [];
          for (var x of elementsSelected) { heightsArr.push(x.clientHeight); }
          // console.log(heightsArr); console.log(Math.max.apply(null, heightsArr));
          const calculatedHeight = Math.max.apply(null, heightsArr);
          for (var x of elementsSelected) { x.style.height = calculatedHeight + 'px'; }
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (scannedData?.title) {
      getProducts();
    }
  }, [scannedData?.title]);
  
  
  function paginationHandler(x) {
    setCardItems(products.slice((x * 9), (x * 9) + 9));
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      paginationHandler(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < arr.length - 1) {
      paginationHandler(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

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
                            <img src={scannedData?.imageUrl} className="image-scan" alt={scannedData?.title || 'Product image'} />
                            <article className="card-body">
                              <h3 className="scan-title">
                                {scannedData?.title}
                              </h3>
                              <h4 className="price" style={{ fontSize: '22px' }}>
                                ${scannedData?.price && Number(scannedData.price).toFixed(2)}
                              </h4>
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
                              
                            {/* Slider Logic */}

                            <div className="image-slider-container">
                              <p>
                                <button type="button" onClick={() => {
                                  setScrappedProducts(fetchedData.filter(x => x.platform == 'alibaba'));
                                }}>Alibaba</button>
                                <button type="button" onClick={() => {
                                  setScrappedProducts(fetchedData.filter(x => x.platform == 'amazon'));
                                }}>Amazon</button>
                                <button type="button" onClick={() => {
                                  setScrappedProducts(fetchedData);
                                }}>All</button>
                              </p>
                              {loading && (
                                <Slider {...settingsNew}>
                                  {scrappedProducts.map((product, index) => (
                                    <article key={product.platform == 'alibaba' ? `alibaba-${index}` : `amazon-${index}`} className="scrapped-data-card">
                                      <img
                                        src={product.image || "https://via.placeholder.com/150"}
                                        className="scrapped-img"
                                        alt={product.title}
                                      />
                                      <h4 className="scrapped-title">{product.title}</h4>
                                      {product.rating && (
                                        <div className="scrapped-rating">
                                          <InlineStack gap="100" align="start">
                                            <Rating rating={parseFloat(product.rating)} />
                                          </InlineStack>
                                        </div>
                                      )}
                                      {product.platform == 'alibaba' ? <AlibabaLogo /> : <AmazonLogo />}
                                      
                                      <h5 className="scrapped-price">{product.price}</h5>
                                    </article>
                                  ))}
                                </Slider>
                              )}
                          </div>
                            <hr style={{ width: '95%', margin: '20px auto' }} />
                            <form
                              style={{ textAlign: "right", padding: "30px" }}
                              onSubmit={(e) => {
                                e.preventDefault();
                                console.log(e.target.price.value);
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "18px",
                                  marginBottom: "25px",
                                  textAlign: "left",
                                }}
                              >
                                <span
                                  className="btn"
                                  style={{ fontWeight: "bold" }}
                                >
                                  Current Price &nbsp; &nbsp;$
                                </span>
                                <span className="form-default">
                                {scannedData?.price && Number(scannedData.price).toFixed(2)}
                                </span>
                              </p>
                              <p
                                style={{
                                  fontSize: "18px",
                                  marginLeft: "25px",
                                  textAlign: "left",
                                }}
                              >
                                <span
                                  className="btn"
                                  style={{ fontWeight: "bold" }}
                                >
                                  New Price &nbsp; &nbsp;$
                                </span>{" "}
                                <input
                                  className="form-input-default"
                                  style={{
                                    fontWeight: "600",
                                    width: "98px",
                                    marginLeft: "8px",
                                    border: "none",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    fontSize: "18px",
                                  }}
                                  onChange={(e) => setNewPrice(e.target.value)}
                                  name="price"
                                  type="number"
                                  step="0.01"
                                />
                              </p>
                              <button
                                style={{
                                  color: "white",
                                  backgroundColor: "#54BAB9",
                                  border: "none",
                                  padding: "8px 20px",
                                  borderRadius: "22px",
                                  fontSize: "18px",
                                  cursor: "pointer",
                                }}
                                type="submit"
                                className="btn"
                                onClick={updatePrice}
                              >
                                Update
                              </button>
                            </form>
                          </section>
                          <p style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Button variant="primary"
                              onClick={() => {
                                setShowModal(false);
                                setScannedData(null);
                              }}>
                              Close
                            </Button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pagination-container">
                    <button 
                      className="pagination-arrow" 
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}
                    >
                      <img className="" src="/Polygon 36.png" alt="Previous page" />
                    </button>
                    {arr.map(x =>
                      <button 
                        key={x} 
                        className={`pagination-button ${currentPage === x - 1 ? 'active' : ''}`}
                        onClick={() => {
                          paginationHandler(x - 1);
                          setCurrentPage(x - 1);
                        }}
                      >
                        {x}
                      </button>
                    )}
                    <button 
                      className="pagination-arrow"
                      onClick={handleNextPage}
                      disabled={currentPage === arr.length - 1}
                      style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}
                    >
                      <img className="" src="/Polygon 37.png" alt="Next page" />
                    </button>
                  </div>
                </>
              ) : (
                <Text as="p">No products found.</Text>
              )}
            </div>
          </Layout.Section>
        </Layout>
        {toasterMessage && <Toaster toasterMessage={toasterMessage} setToasterMessage={setToasterMessage} />}
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
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
