import 'dotenv/config.js';
import cloudinary from 'cloudinary';

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || "dganhxhid";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "672381925111413";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "KYxtoS3wN2T8eLq0qUP5USr7XQc";

export const config = cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});
