import axios from 'axios';

export const fetchDownloadLink = async (query) => {
    try {
        if (!query) {
            throw new Error('Query is required to fetch scrapped products.');
        }

        query = query.trim();

        const response = await axios.get(`http://localhost:3001/api/download/?query=${query}`);

        return response;
    } catch (error) {
        console.error(`${error.message}: Error retrieving download link. Either no match found, or server issues.`);
        throw new Error(error.response?.data?.message || 'No match found.');
    }
};