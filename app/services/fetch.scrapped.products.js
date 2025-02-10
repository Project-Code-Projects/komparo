import axios from 'axios';

export const fetchScrappedProducts = async (query) => {
    try {
        if (!query) {
            throw new Error('Query is required to fetch scrapped products.');
        }

        query = query.trim();

        const response = await axios.get(`http://localhost:3001/api/products?query=${query}`);

        console.log("Products fetched successfully:", response.data);

        return response;
    } catch (error) {
        console.error(`${error.message}: Error retrieving scrapped products.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch matching products. Please try again later.');
    }
};