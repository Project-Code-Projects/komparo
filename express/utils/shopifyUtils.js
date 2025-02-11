// import axios from 'axios';

// const shopifyAPI = async () => {
//     const shop = 'your-shop-name.myshopify.com';
//     const accessToken = 'your-access-token';

//     try {
//         const response = await axios.get(`https://${shop}/admin/api/2024-01/products.json`, {
//             headers: {
//                 'X-Shopify-Access-Token': accessToken,
//                 'Content-Type': 'application/json',
//             },
//         });

//         const products = response.data.products;
//         console.log('Initial Product List:', products);

//         // Store in DB or cache
//         return products;
//     } catch (error) {
//         console.error('Error fetching products:', error);
//     }
// };

// // Call this function on server start
// shopifyAPI();

// const client = new shopify.clients.Rest({ session });
// const response = client.get({ path: 'shop' });