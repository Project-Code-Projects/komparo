import { Layout, Text, InlineStack, Button, Divider, Select, TextField } from "@shopify/polaris"
import { useLoaderData } from "@remix-run/react"
import { loader } from "../services/fetch.products.js"
import "../styles/komparo.css"
import { useEffect, useState, useCallback } from "react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Rating } from "../components/rating";
import { AlibabaLogo, AmazonLogo } from '../components/logo.jsx';
import { fetchScrappedProducts } from '../services/fetch.scrapped.products';
import { fetchDownloadLink } from "../services/fetch.download.link.js"
import { Toaster } from "../components/toaster.jsx";
import BarChartGraph from "../components/BarChart.jsx"
import LineChartGraph from "../components/LineChart.jsx"
export { loader }
import {
  PageDownIcon
} from '@shopify/polaris-icons';
import ScatterChartGraph from "../components/ScatterChart.jsx"

export default function KomparoPage() {
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardItems, setCardItems] = useState([]);
  const data = useLoaderData();
  const products = data?.products || [];
  const [fetchedData, setFetchedData] = useState([]);
  const [scrappedProducts, setScrappedProducts] = useState([]);
  const [newPrice, setNewPrice] = useState("");
  const [newPriceCompare, setNewPriceCompare] = useState("");
  const [toasterMessage, setToasterMessage] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [medianPrice, setMedianPrice] = useState(0);
  const [modePrice, setModePrice] = useState([]);
  const [platform, setPlatform] = useState('all');
  const [platformDownload, setPlatformDownload] = useState('alibaba');
  const [price, setPrice] = useState('default');
  const [priceResetData, setPriceResetData] = useState([]);
  const [priceDefaultData, setPriceDefaultData] = useState([]);
  const [noPriceMatched, setNoPriceMatched] = useState(false);
  const [noProductsFromAlibaba, setNoProductsFromAlibaba] = useState(false);
  const [noProductsFromAmazon, setNoProductsFromAmazon] = useState(false);
  const [barChartGraphData, setBarChartGraphData] = useState([]);
  const [amazonURL, setAmazonURL] = useState('');
  const [alibabaURL, setAlibabaURL] = useState('');
  const [minPriceValue, setMinPriceValue] = useState();
  const [maxPriceValue, setMaxPriceValue] = useState();
  const [highestNOPPrice, setHighestNOPPrice] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const [scatteredGraphData, setScatteredGraphData] = useState([]);

  // Page Population Logic

  useEffect(() => {
    setCardItems(products.slice((0 * 9), (0 * 9) + 9));
    setTimeout(() => {
      const firstModal = document.getElementById('modal-1');
      const secondModal = document.getElementById('modal-2');
      window.onclick = function (event) {
        if (event.target == firstModal) { setShowModal(false) }
        else if (event.target == secondModal) { setShowPriceModal(false) }
      };
    }, 500);
  }, [])

  function calculateStatistics(numbers) {
    // Mean Calculation
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

    // Median Calculation
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sortedNumbers.length / 2);
    const median = sortedNumbers.length % 2 === 0
      ? (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2
      : sortedNumbers[mid];

    // Mode Calculation
    const frequency = {};
    let maxFreq = 0;
    let mode = [];

    for (const num of numbers) {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
      }
    }

    for (const key in frequency) {
      if (frequency[key] === maxFreq) {
        mode.push(parseFloat(key));
      }
    }

    return { mean, median, mode };
  }

  // Fetch Scrapped Products Logic

  useEffect(() => {
    const getProducts = async () => {
      try {
        const encodedTitle = encodeURIComponent(scannedData.title);
        const response = await fetchScrappedProducts(encodedTitle);
        const fetchData = response.data.dataArr;

        if (response.status === 200) {
          const priceArr = [];
          const nopArr = [];
          const filteredPrices = [];
          fetchData.forEach(x => {
            if (!x.price.includes("-") && !isNaN(Number(x.price))) { x.price = Number(x.price); filteredPrices.push(x); priceArr.push(x.price); nopArr.push(Number(x.nop)); }
          });
          const highestNOP = Math.max.apply(null, nopArr);
          const arrDataBC = filteredPrices.map(x => {
            if (highestNOP == Number(x.nop)) {setHighestNOPPrice(x.price)}
            return { price: x.price, nop: Number(x.nop) };
          });
          const statisticalData = calculateStatistics(priceArr);
          arrDataBC.sort(function (a, b) { return a.price - b.price });
          setBarChartGraphData(arrDataBC);
          setScatteredGraphData(response.data.graphDataArr);
          setAveragePrice(statisticalData.mean);
          setMedianPrice(statisticalData.median);
          setModePrice(statisticalData.mode);
          setFetchedData(filteredPrices);
          setScrappedProducts(filteredPrices);
          fixingHeights();
          setPendingMessage(null);
        } else if (response.status === 202) setPendingMessage(fetchData.message);

      } catch (error) {
        setPendingMessage(error.message);
      }
    };

    if (scannedData?.title) {
      getProducts();
    }
  }, [scannedData?.title, pendingMessage]);


  // Price Update Logic [New]

  async function updatePrice() {
    if (!newPrice || !newPriceCompare) return alert("Please enter either the price or compare-at price.");
    console.log("Price:", newPrice);
    console.log("Compare Price:", newPriceCompare);
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
          newCompareAtPrice:parseFloat(newPriceCompare),
        }),
      });
      const result = await response.json();
      if (result.success) {
        setToasterMessage("Price updated successfully!")
        setScannedData((prevData) => ({
          ...prevData,
          price: parseFloat(newPrice),
          compareAtPrice: parseFloat(newPriceCompare),
        }));
        setNewPrice(""); setNewPriceCompare("");
        document.querySelector("input[name='price']").value = "";
        document.querySelector("input[name='compare-at price']").value = "";
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

  function fixingHeights() {
    setTimeout(() => {
      const elementsSelected = document.getElementsByClassName('scrapped-title');
      const heightsArr = [];
      for (var x of elementsSelected) { heightsArr.push(x.clientHeight); }
      const calculatedHeight = Math.max.apply(null, heightsArr);
      for (var y of elementsSelected) { y.style.height = calculatedHeight + 'px'; }
    }, 1000);
  }

  // Slider Logic

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  setTimeout(() => {
    setLoading(true);
  }, 500);

  // Pagination logic 

  async function paginationHandler(x) {
    setCardItems(products.slice((x * 9), (x * 9) + 9));
  }

  const arr = [];
  for (let i = 1; i <= Math.ceil(products.length / 9); i++) {
    arr.push(i);
  }

  async function handlePrevPage() {
    if (currentPage > 0) {
      paginationHandler(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };


  async function handleNextPage() {
    if (currentPage < arr.length - 1) {
      paginationHandler(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const options = [
    { label: 'All\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0', value: 'all' },
    { label: 'Alibaba\u00A0', value: 'alibaba' },
    { label: 'Amazon', value: 'amazon' }
  ];

  const optionsFirst = [
    { label: 'Default\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0', value: 'default' },
    { label: 'Low to High\u00A0', value: 'lth' },
    { label: 'High to Low\u00A0', value: 'htl' }
  ];

  const optionsDownload = [
    { label: 'Alibaba', value: 'alibaba' },
    { label: 'Amazon', value: 'amazon' }
  ];

  const handleChangePI_1 = useCallback(
    (newValue) => setMinPriceValue(Number(newValue)),
    [],
  );

  const handleChangePI_2 = useCallback(
    (newValue) => setMaxPriceValue(Number(newValue)),
    [],
  );

  // Download JSON Logic

  // const downloadJSON = (data, filename = "data.json") => {
  //   const jsonStr = JSON.stringify(data, null, 2);
  //   const blob = new Blob([jsonStr], { type: "application/json" });
  //   const url = URL.createObjectURL(blob);
  
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };


  // Download CSV Logic

  async function downloadCSV(fetchedData) { 
    try {
      setToasterMessage("Generating download link. Please wait a moment.");
      const encodedTitle = encodeURIComponent(scannedData.title);
      const response = await fetchDownloadLink(encodedTitle);
      const downloadUrl = response.data.downloadUrl;
      window.open(downloadUrl, '_blank');
      setToasterMessage(null);
     } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch download link. Try again later.");
    }
  }

  return (
    <main style={{ padding: '60px', paddingTop: '80px', backgroundColor: '#3D3D3D' }}>
      <div className="back-ground">
        <Layout>
          <Layout.Section>
            <h3 className="heading">Your Products</h3>
            <h2 className="logo"><i>Komparo</i></h2>

            <article className="ins-container">
              <p><span className="highlight">Komparo</span> is your go-to price comparison app! Simply click on any one of your products to instantly find similar items on Alibaba, Amazon, and other eCommerce platforms. We also provide valuable price analysis to help you understand market trends and set the perfect selling price.</p>
            </article>
            <div className="container">

              {/* Page Population Logic */}

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

                  <div id="modal-1" className="modal" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-content">
                      <div className="modal-body">
                        <div>
                          <section className="sc-1">
                            <img src={scannedData?.imageUrl} className="image-scan" alt={scannedData?.title || 'Product image'} />
                            <article className="card-body">
                              <h3 className="scan-title">{scannedData?.title}</h3>
                              <article style={{display: 'flex', alignItems: 'center'}}>
                              <h4 className="price" style={{ fontSize: '22px', marginRight: '10px' }}>${scannedData?.price ? Number(scannedData.price).toFixed(2) : '0.00'}</h4>
                              {scannedData?.compareAtPrice && (<del className="price" style={{ fontSize: '14px', color: 'gray' }}>${scannedData?.compareAtPrice ? Number(scannedData.compareAtPrice).toFixed(2) : '0.00'}</del>)}
                              </article>
                              <p className="scan-desc" style={{ padding: '25px', backgroundColor: 'white', borderRadius: '20px', marginTop: '20px' }}>
                                {scannedData?.description && scannedData.description.length != 0 ? scannedData.description : 'No description provided!'}
                              </p>
                            </article>
                          </section>

                          {/* Pending Message Logic */}

                          <section className="sc-2">
                            {pendingMessage ?
                              <Text variant="bodyLg">
                                {pendingMessage}
                              </Text> : (
                                <>

                                  {/* Slider Logic */}

                                  <div className="image-slider-container">
                                    <section className="filtering-bar">
                                      <div className="price-filtering-form">
                                        <article style={{ display: 'flex', alignItems: 'center', width: '52%', marginRight: '7px' }}>
                                          <span style={{ marginRight: '3px', fontWeight: '600', fontSize: '15px' }}>$</span><TextField
                                            type="number"
                                            placeholder="Min"
                                            min={0}
                                            value={minPriceValue}
                                            onChange={handleChangePI_1}
                                            autoComplete="off"
                                          />
                                          <span style={{ margin: '0 3px' }}>-</span>
                                          <TextField
                                            type="number"
                                            placeholder="Max"
                                            min={0}
                                            value={maxPriceValue}
                                            onChange={handleChangePI_2}
                                            autoComplete="off"
                                          />
                                        </article>
                                        <button className="btn-ps hover-btn-s" style={{ color: 'white', cursor: "pointer", fontSize: '16px', backgroundColor: '#578E7E', border: 'none', borderRadius: '8px', padding: '4px 10px' }} onClick={() => {
                                          let minValue = minPriceValue; let maxValue = maxPriceValue;
                                          if (maxValue == undefined) { setMaxPriceValue(Infinity); maxValue = Infinity; }
                                          if (minValue == undefined) { setMinPriceValue(0); minValue = 0; }
                                          if (priceResetData.length > 0) {
                                            const arr = priceResetData.filter(x => x.price <= maxValue && x.price >= minValue);
                                            if (arr.length > 0) { setNoPriceMatched(false) } else { setNoPriceMatched(true) }
                                            setScrappedProducts(arr);
                                          } else {
                                            setPriceResetData(scrappedProducts);
                                            const arr = scrappedProducts.filter(x => x.price <= maxValue && x.price >= minValue);
                                            if (arr.length > 0) { setNoPriceMatched(false) } else { setNoPriceMatched(true) }
                                            setScrappedProducts(arr);
                                          }
                                          fixingHeights();
                                        }}>Search</button>&nbsp;
                                        {priceResetData.length > 0
                                          &&
                                          <button className="btn-ps hover-btn" style={{ color: 'white', cursor: "pointer", fontSize: '16px', backgroundColor: '#3d3d3d', border: 'none', borderRadius: '8px', padding: '4px 10px' }} onClick={() => {
                                            if (priceResetData.length > 0) {
                                              setMinPriceValue();
                                              setMaxPriceValue();
                                              setScrappedProducts(priceResetData);
                                              setPriceResetData([]);
                                              setNoPriceMatched(false);
                                              fixingHeights();
                                            }
                                          }}>Reset</button>
                                        }

                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '47%' }}>
                                        <Select
                                          label=""
                                          labelInline
                                          options={options}
                                          onChange={(event) => {
                                            setPlatform(event);
                                            if (event == 'all') {
                                              setPrice('default');
                                              setPriceResetData([]);
                                              setPriceDefaultData([]);
                                              setNoPriceMatched(false);
                                              setMinPriceValue();
                                              setMaxPriceValue();
                                              setNoProductsFromAlibaba(false);
                                              setNoProductsFromAmazon(false);
                                              setScrappedProducts(fetchedData);
                                              fixingHeights();
                                            }
                                            else if (event == 'alibaba') {
                                              setPrice('default');
                                              setPriceResetData([]);
                                              setPriceDefaultData([]);
                                              setNoPriceMatched(false);
                                              setMinPriceValue();
                                              setMaxPriceValue();
                                              const arr = fetchedData.filter(x => x.source == 'alibaba');
                                              if (arr.length == 0) { setNoProductsFromAlibaba(true) }
                                              setNoProductsFromAmazon(false);
                                              setScrappedProducts(arr);
                                              fixingHeights();
                                            }
                                            else {
                                              setPrice('default');
                                              setPriceResetData([]);
                                              setPriceDefaultData([]);
                                              setNoPriceMatched(false);
                                              setMinPriceValue();
                                              setMaxPriceValue();
                                              setNoProductsFromAlibaba(false);
                                              const arr = fetchedData.filter(x => x.source == 'amazon');
                                              if (arr.length == 0) { setNoProductsFromAmazon(true) }
                                              setScrappedProducts(arr);
                                              fixingHeights();
                                            }
                                          }}
                                          value={platform}
                                        />
                                        <Select
                                          label="Sort by Price : "
                                          labelInline
                                          options={optionsFirst}
                                          onChange={(event) => {
                                            setPrice(event);
                                            if (event == 'default') {
                                              setScrappedProducts(priceDefaultData);
                                              fixingHeights();
                                            }
                                            else if (event == 'lth') {
                                              if (priceDefaultData.length == 0) { setPriceDefaultData(scrappedProducts) }
                                              const arr = scrappedProducts.map(x => x);
                                              arr.sort(function (a, b) { return a.price - b.price });
                                              setScrappedProducts(arr);
                                              fixingHeights();
                                            }
                                            else {
                                              if (priceDefaultData.length == 0) { setPriceDefaultData(scrappedProducts) }
                                              const arr = scrappedProducts.map(x => x);
                                              arr.sort(function (a, b) { return b.price - a.price });
                                              setScrappedProducts(arr);
                                              fixingHeights();
                                              fixingHeights();
                                            }
                                          }}
                                          value={price}
                                        />
                                      </div>
                                    </section>
                                    {loading &&
                                      <>
                                        {noPriceMatched && <p style={{ textAlign: 'center', color: 'gray', marginTop: '45px', fontSize: '17px' }}><i>No product available in this price range</i></p>}
                                        {noProductsFromAlibaba && <p style={{ textAlign: 'center', color: 'gray', marginTop: '45px', fontSize: '17px' }}><i>No product available on Alibaba</i></p>}
                                        {noProductsFromAmazon && <p style={{ textAlign: 'center', color: 'gray', marginTop: '45px', fontSize: '17px' }}><i>No product available on Amazon</i></p>}
                                        < Slider {...settings}>
                                          {scrappedProducts.map((product, index) => (
                                            <article key={product.source == 'alibaba' ? `alibaba-${index}` : `amazon-${index}`} className="scrapped-data-card">
                                              <img
                                                src={product.image || "https://via.placeholder.com/150"}
                                                className="scrapped-img"
                                                alt={product.title}
                                              />
                                              <h4 className="scrapped-title" title={product.title}>{product.title.length > 50 ? product.title.slice(0, 50) + '...' : product.title}</h4>
                                              <div className="scrapped-rating">
                                                {((!isNaN(product.rating)) && (Number(product.rating) > 0)) ?
                                                  <InlineStack gap="100" align="start">
                                                    <Rating rating={Number(product.rating)} />
                                                  </InlineStack>
                                                  :
                                                  <p style={{ color: 'lightgray' }}><i>No rating found!</i></p>
                                                }
                                              </div>
                                              {product.source == 'alibaba' ? <AlibabaLogo /> : <AmazonLogo />}

                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h5 className="scrapped-price">${product.price}</h5>
                                                <button type="button" style={{ border: 'none', backgroundColor: 'transparent', textDecoration: 'underline', color: '#578E7E', marginRight: '5px' }}><a href={product.link} target="_blank">View Product</a></button>
                                              </div>

                                              <p style={{ textAlign: 'center', margin: '10px 0', marginBottom: '15px' }}>
                                                <Button
                                                  onClick={() => {
                                                    const newGraphData = [];
                                                    product.graphData.forEach(x => {
                                                      const arr = new Date(x.dataDate).toString().split(' ');
                                                      newGraphData.push({dataDate: arr[1] + ' ' + arr[2] + ' ' + arr[4], dataPrice: Number(x.dataPrice)});
                                                    });
                                                    setGraphData(newGraphData);
                                                    setShowPriceModal(true);
                                                  }}
                                                >
                                                  Price History
                                                </Button>

                                              </p>

                                            </article>
                                          ))}
                                        </Slider>
                                      </>
                                    }
                                  </div>
                                  <div id="modal-2" className="modal"
                                    style={{ display: showPriceModal ? 'block' : 'none', zIndex: '100', paddingTop: '25px' }}
                                  >
                                    <div className="modal-content"

                                    >
                                      <div className="modal-body"
                                        style={{ padding: '40px 0', paddingRight: '30px', paddingBottom: '10px' }}
                                      >
                                        <LineChartGraph graphData={graphData} />
                                        <p style={{ textAlign: 'center', marginTop: '15px' }}><Button variant="primary" onClick={() => setShowPriceModal(false)}>
                                          Close
                                        </Button>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <article style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                                      {/* <button className="btn-ps hover-btn" style={{ color: 'white', fontSize: '16px', backgroundColor: '#3d3d3d', border: 'none', borderRadius: '8px', padding: '7.5px 12px', cursor: 'pointer' }} onClick={() => downloadJSON(fetchedData)}> */}
                                      <button className="btn-ps hover-btn" style={{ color: 'white', fontSize: '16px', backgroundColor: '#3d3d3d', border: 'none', borderRadius: '8px', padding: '7.5px 12px', cursor: 'pointer' }} onClick={() => downloadCSV()}>
                                         Download 
                                      </button>
                                  </article>
                                  
                                  <Divider borderColor="border-inverse" />

                                  <br /><br />

                                  {fetchedData.length > 0 && <BarChartGraph dataSet={barChartGraphData} />}

                                  {/* {fetchedData.length > 0 && <ScatterChartGraph graphData={scatteredGraphData} />} */}

                                  
<br />
{fetchedData.length > 0 && <table>
<tbody>
<tr>
    <th style={{borderBottomColor: 'white'}}>Average Price</th>
    <td>${averagePrice.toFixed(2)}</td>
  </tr>
  <tr>
    <th style={{borderBottomColor: 'white'}}>Most Frequent Price</th>
    <td>${modePrice[0].toFixed(2)}</td>
  </tr>
   <tr>
    <th>Highest NOP Price</th>
    <td>${highestNOPPrice.toFixed(2)}</td>
  </tr>
</tbody>
</table>}

                                  <br />

                                  <Divider borderColor="border-inverse" />

                                  {/* Price Update Form */}

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
                                        marginLeft: "30px",
                                        textAlign: "left",
                                      }}
                                    >
                                      <span
                                        className="btn"
                                        style={{ fontWeight: "bold" }}
                                      >
                                        Current Pricing &nbsp; &nbsp;
                                      </span>
                                    </p>

                                    <div style={{ display: "flex", marginTop: "25px", marginBottom: "25px" }}>
                                    <p
                                      style={{
                                        fontSize: "18px",
                                        marginLeft: "60px",
                                        textAlign: "left",
                                      }}
                                      >
                                        
                                      <span className="btn">
                                        Price &nbsp; &nbsp; 
                                      </span>
                                        
                                      <span className="form-default">
                                        ${scannedData?.price && Number(scannedData.price).toFixed(2)} 
                                        </span>
                                      </p>

                                      <p  
                                      style={{
                                        fontSize: "18px",
                                        marginLeft: "60px",
                                        textAlign: "left",
                                      }}>
                                        <span className="btn">
                                            Compare-at Price &nbsp; &nbsp; 
                                        </span>
                                          
                                        <span className="form-default">
                                          ${scannedData?.price && Number(scannedData.compareAtPrice).toFixed(2)}
                                        </span>
                                      </p>
                                    </div>

                                    <Divider borderColor="border-inverse" />

                                    <p
                                      style={{
                                        fontSize: "18px",
                                        marginTop: "25px",
                                        marginLeft: "30px",
                                        textAlign: "left",
                                      }}
                                    >
                                      <span
                                        className="btn"
                                        style={{ fontWeight: "bold" }}
                                      >
                                        New Pricing  &nbsp; &nbsp;
                                      </span>
                                    </p>

                                    <div style={{ display: "flex", marginTop: "25px", marginBottom: "25px" }}>
                                    <p
                                      style={{
                                        fontSize: "18px",
                                        marginLeft: "55px",
                                        textAlign: "left",
                                      }}
                                    >
                                      <span className="btn">
                                        Price &nbsp; &nbsp;<strong>$</strong>
                                      </span>
                                      <input
                                        id="ipu"
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
                                        min="0"
                                        step="0.01"
                                      />
                                    </p>
                                     <p
                                      style={{
                                        fontSize: "18px",
                                        textAlign: "left",
                                          // marginTop: "25px",
                                        marginLeft: "25px",
                                      }}
                                    >
                                      <span
                                        className="btn"
                                        // style={{ fontWeight: "bold" }}
                                      >
                                        Compare-at Price &nbsp; &nbsp;<strong>$</strong>
                                      </span>
                                      <input
                                        id="ipu-c"
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
                                        onChange={(e) => setNewPriceCompare(e.target.value)}
                                        name="compare-at price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                      />
                                      </p>
                                    </div>

                                    <Divider borderColor="border-inverse" />

                                    <button
                                      style={{
                                        color: "white",
                                        backgroundColor: "#3d3d3d",
                                        // backgroundColor: "#578E7E",
                                        marginTop: "25px",
                                        border: "none",
                                        padding: "8px 20px",
                                        borderRadius: "22px",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                      }}
                                      type="submit"
                                      className="btn hover-btn"
                                      onClick={updatePrice}
                                    >
                                      Update
                                    </button>
                                  </form>

                                  <Divider borderColor="border-inverse" />
                                
                                </>
                              )}
                          </section>

                          {/* Close Button */}

                          <p style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Button variant="primary"
                              onClick={() => {
                                setShowModal(false);
                                setScannedData(null);
                                setFetchedData([]);
                                setScrappedProducts([]);
                                setPlatform('all');
                                setPrice('default');
                                setPriceResetData([]);
                                setPriceDefaultData([]);
                                setNoPriceMatched(false);
                                setMinPriceValue();
                                setMaxPriceValue();
                                setNewPrice("");
                                setPendingMessage(null);
                                setAveragePrice(0);
                                setNoProductsFromAlibaba(false);
                                setNoProductsFromAmazon(false);
                                document.getElementById('ipu').value = '';
                                setPlatformDownload('Alibaba');
                              }}>
                              Close
                            </Button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pagination */}

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
                        type="button"
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

                    <button button="type"
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
    </main >
  )
}


function ProductCard({ product, setShowModal, setScannedData }) {

  function scanHandler(data) {
    setScannedData(data);
    setShowModal(true);
  }

  return (
    <div className="card" title="click to compare prices" onClick={() => scanHandler(product)}>
      <img src={product.imageUrl || "/placeholder.svg"} alt={product.title} className="image" />
      <div style={{ marginLeft: '10px' }}>
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