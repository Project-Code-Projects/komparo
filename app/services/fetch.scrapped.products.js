import axios from 'axios';

export const fetchScrappedProducts = async (query) => {
    try {
        if (!query) {
            throw new Error('Query is required to fetch scrapped products.');
        }

        query = query.trim();

        const response = await axios.get(`http://localhost:3001/api/products?query=${query}`);

        // Scrapped
        if (response.status === 200) {
            console.log("Products fetched successfully:", response.data);
            return response.data;
        }

        // Pending
        if (response.status === 202) {
            console.log(response.data.message);
            return response.data.message;
        }

    } catch (error) {
        console.error(`${error.message}: Error retrieving scrapped products.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch scrapped products.');
    }
};