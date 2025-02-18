import axios from 'axios';

export const fetchScrappedProducts = async (query) => {
    try {
        if (!query) {
            throw new Error('Query is required to fetch scrapped products.');
        }

        query = query.trim();

        // console.log(`http://localhost:3001/api/products?query=${query}`);
        const response = await axios.get(`http://localhost:3001/api/products?query=${query}`);

        // console.log("Products fetched successfully:", response.data);

        return response;
    } catch (error) {
        console.error(`${error.message}: Error retrieving scrapped products. Either no match found, or server issues.`);
        throw new Error(error.response?.data?.message || 'No match found.');
    }
};